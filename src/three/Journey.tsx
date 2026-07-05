import { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { STATIONS, SEGMENT } from './road';
import { Bonfire, makeTwistedBladeGeometry } from './Bonfire';
import { Brand } from './Brand';

/**
 * The world along the road: a black nightscape under a pale moon, jagged
 * crags and a broken arch flanking the path, mist pooling on the ground,
 * ash drifting in the air, fog gates at the area boundaries. Everything
 * procedural; the dark and the atmosphere do the work.
 */

/* ── shared procedural helpers ── */
function hash2(x: number, z: number) {
    const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
    return s - Math.floor(s);
}
function vnoise(x: number, y: number) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/* jagged rock: an icosahedron shoved around by noise */
function makeCragGeometry(seed = 0) {
    const g = new THREE.IcosahedronGeometry(1, 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const n = 1 + (hash2(v.x * 2.7 + seed, v.y * 2.7 + v.z) - 0.5) * 0.52;
        v.multiplyScalar(n);
        pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
}

/* ── sky ── */
const skyVertex = /* glsl */ `
    varying vec3 vPos;
    void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const skyFragment = /* glsl */ `
    varying vec3 vPos;
    void main() {
        float h = normalize(vPos).y;
        vec3 zenith  = vec3(0.014, 0.009, 0.011);
        vec3 horizon = vec3(0.085, 0.032, 0.036);
        vec3 col = mix(horizon, zenith, smoothstep(-0.05, 0.40, h));
        gl_FragColor = vec4(col, 1.0);
    }
`;

/* ── the eclipsed sun: a dark disc ringed by a wavering corona ── */
const eclipseVertex = /* glsl */ `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const eclipseFragment = /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
                   mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
    }
    float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.05; a *= 0.5; }
        return v;
    }
    void main() {
        vec2 c = vUv - 0.5;
        float d = length(c) * 2.0;
        vec2 dir = d > 0.0001 ? normalize(c) : vec2(1.0, 0.0);

        // the corona breathes: slow, low-frequency waver, never jitter
        float n = fbm(dir * 1.6 + uTime * 0.006);
        float r0 = 0.50 + (n - 0.5) * 0.032;

        // sharp line inside a soft halo
        float ring = exp(-abs(d - r0) * 34.0) + exp(-abs(d - r0) * 9.0) * 0.35;
        // faint streaks of corona light reaching outward
        float rays = pow(fbm(dir * 3.1 + 4.7 + uTime * 0.004), 3.0)
                   * exp(-max(d - r0, 0.0) * 4.5) * 0.7;
        float bleed = exp(-max(d - r0, 0.0) * 6.5) * 0.3;
        float disc = smoothstep(r0 + 0.015, r0 - 0.03, d);

        // HDR so the bloom pass ignites it
        vec3 ringCol = vec3(2.4, 1.1, 0.30) * ring + vec3(1.5, 0.55, 0.18) * (rays + bleed);
        vec3 discCol = vec3(0.012, 0.007, 0.009);
        vec3 col = mix(ringCol, discCol, disc);

        float alpha = max(disc, min(ring + rays + bleed, 1.0));
        if (alpha < 0.004) discard;
        gl_FragColor = vec4(col, alpha);
    }
`;

function Eclipse({ position }: { position: [number, number, number] }) {
    const mat = useRef<THREE.ShaderMaterial>(null);
    const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
    useFrame((state) => {
        if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    });
    return (
        <mesh position={position}>
            <planeGeometry args={[26, 26]} />
            <shaderMaterial
                ref={mat}
                vertexShader={eclipseVertex}
                fragmentShader={eclipseFragment}
                uniforms={uniforms}
                transparent
                depthWrite={false}
            />
        </mesh>
    );
}

/* ── Lothric on the horizon: rides with the camera, never arrives ── */
function Skyline() {
    const g = useRef<THREE.Group>(null);
    const MAT = useMemo(() => new THREE.MeshBasicMaterial({ color: '#050304' }), []);
    useFrame(({ camera }) => {
        if (g.current) g.current.position.z = camera.position.z - 78;
    });
    return (
        <group ref={g}>
            {/* the high keep, right of the road */}
            <group position={[30, 0, 0]}>
                <mesh material={MAT} position={[0, 9, 0]}><boxGeometry args={[7, 18, 5]} /></mesh>
                <mesh material={MAT} position={[0, 20.8, 0]}><coneGeometry args={[2.7, 6.5, 4]} /></mesh>
                <mesh material={MAT} position={[-5.5, 6, 1]}><boxGeometry args={[3.5, 12, 3.5]} /></mesh>
                <mesh material={MAT} position={[-5.5, 14.2, 1]}><coneGeometry args={[2.4, 4.5, 4]} /></mesh>
                <mesh material={MAT} position={[5, 4.5, -1]}><boxGeometry args={[4, 9, 4]} /></mesh>
                <mesh material={MAT} position={[5, 10.8, -1]}><coneGeometry args={[2.6, 4, 4]} /></mesh>
            </group>
            {/* broken towers, left */}
            <group position={[-28, 0, -6]}>
                <mesh material={MAT} position={[0, 6.5, 0]} rotation={[0, 0, 0.06]}><boxGeometry args={[4.5, 13, 4]} /></mesh>
                <mesh material={MAT} position={[6, 3.5, 2]} rotation={[0, 0.4, -0.05]}><boxGeometry args={[3, 7, 3]} /></mesh>
                <mesh material={MAT} position={[6, 8.4, 2]}><coneGeometry args={[2, 3.6, 4]} /></mesh>
            </group>
            <Crows />
        </group>
    );
}

/* ── grave-blades: dead men's swords, crooked in the dirt ── */
function Graves() {
    const geo = useMemo(() => makeTwistedBladeGeometry(1.15, 0.9), []);
    const MAT = useMemo(
        () => new THREE.MeshStandardMaterial({ color: '#15100f', roughness: 0.8, metalness: 0.5 }),
        []
    );
    const spots = useMemo(() => {
        const arr: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
        for (let i = 0; i < 11; i++) {
            const side = i % 2 ? 1 : -1;
            arr.push({
                pos: [side * (3.4 + hash2(i * 7.3, 2) * 2.6), -0.08, 2 - hash2(i * 3.1, 5) * 172],
                rot: [hash2(i, 8) * 0.5 - 0.25, hash2(i, 9) * Math.PI, hash2(i, 3) * 0.7 - 0.35],
            });
        }
        return arr;
    }, []);
    return (
        <>
            {spots.map((s, i) => (
                <mesh key={i} geometry={geo} material={MAT} position={s.pos} rotation={s.rot} />
            ))}
        </>
    );
}

/* ── a soul, left where somebody fell ── */
function SoulOrb({ position }: { position: [number, number, number] }) {
    const core = useRef<THREE.MeshBasicMaterial>(null);
    const halo = useRef<THREE.MeshBasicMaterial>(null);
    useFrame((s) => {
        const a = 0.55 + 0.3 * Math.sin(s.clock.elapsedTime * 1.6 + position[2]);
        if (core.current) core.current.opacity = a;
        if (halo.current) halo.current.opacity = a * 0.2;
    });
    return (
        <group position={position}>
            <mesh>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshBasicMaterial ref={core} color="#e8fff2" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
            </mesh>
            <mesh>
                <sphereGeometry args={[0.22, 8, 8]} />
                <meshBasicMaterial ref={halo} color="#9fe8c0" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
            </mesh>
        </group>
    );
}

/* ── tattered banner: dark cloth, wind-worried, eaten at the hem ── */
const bannerVertex = /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        vec3 p = position;
        float loose = 1.0 - uv.y; // fixed at the top, free at the hem
        p.z += sin(uv.y * 4.0 - uTime * 1.4) * 0.10 * loose;
        p.x += sin(uv.y * 2.5 - uTime * 0.9 + 1.7) * 0.05 * loose;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
`;
const bannerFragment = /* glsl */ `
    uniform float uSeed;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
                   mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
    }
    float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 3; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
        return v;
    }
    void main() {
        // ragged hem and nibbled edges
        float tatter = smoothstep(0.30, 0.55, vUv.y + (fbm(vec2(vUv.x * 6.0 + uSeed, vUv.y * 3.0)) - 0.5) * 0.55);
        float edges = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
        float a = tatter * edges;
        if (a < 0.15) discard;
        // deep dried-blood cloth, darker toward the hem
        vec3 col = mix(vec3(0.05, 0.015, 0.02), vec3(0.16, 0.045, 0.055), vUv.y);
        gl_FragColor = vec4(col, 1.0);
    }
`;

function Banner({ position, seed }: { position: [number, number, number]; seed: number }) {
    const mat = useRef<THREE.ShaderMaterial>(null);
    const uniforms = useMemo(() => ({ uTime: { value: seed * 10 }, uSeed: { value: seed } }), [seed]);
    useFrame((_, delta) => {
        if (mat.current) mat.current.uniforms.uTime.value += delta;
    });
    return (
        <mesh position={position}>
            <planeGeometry args={[0.85, 2.3, 8, 24]} />
            <shaderMaterial
                ref={mat}
                vertexShader={bannerVertex}
                fragmentShader={bannerFragment}
                uniforms={uniforms}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

/* ── a chain sagging from the arch ── */
function Chain({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
    const geo = useMemo(() => {
        const a = new THREE.Vector3(...from);
        const b = new THREE.Vector3(...to);
        const mid = a.clone().lerp(b, 0.5);
        mid.y = Math.min(a.y, b.y) * 0.35 + 0.4; // the sag
        const curve = new THREE.CatmullRomCurve3([a, mid, b]);
        return new THREE.TubeGeometry(curve, 24, 0.032, 5, false);
    }, [from, to]);
    const MAT = useMemo(() => new THREE.MeshStandardMaterial({ color: '#171213', roughness: 0.6, metalness: 0.8 }), []);
    return <mesh geometry={geo} material={MAT} />;
}

/* ── candles guttering by the graves ── */
function Candles({ position }: { position: [number, number, number] }) {
    const glowRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
    const sticks = useMemo(
        () =>
            [0, 1, 2, 3].map((i) => ({
                x: Math.cos(i * 2.4) * 0.12,
                z: Math.sin(i * 2.4) * 0.12,
                h: 0.08 + hash2(i * 3.1, position[2]) * 0.14,
            })),
        [position]
    );
    useFrame((s) => {
        const t = s.clock.elapsedTime;
        glowRefs.current.forEach((m, i) => {
            if (m) m.opacity = 0.5 + 0.3 * Math.sin(t * (6 + i) + i * 9.1) * Math.sin(t * 2.3 + i);
        });
    });
    const WAX = useMemo(() => new THREE.MeshStandardMaterial({ color: '#57504a', roughness: 0.9 }), []);
    return (
        <group position={position}>
            {sticks.map((c, i) => (
                <group key={i} position={[c.x, 0, c.z]}>
                    <mesh material={WAX} position={[0, c.h / 2, 0]}>
                        <cylinderGeometry args={[0.022, 0.028, c.h, 6]} />
                    </mesh>
                    <mesh position={[0, c.h + 0.025, 0]}>
                        <sphereGeometry args={[0.018, 6, 6]} />
                        <meshBasicMaterial
                            ref={(m) => { glowRefs.current[i] = m; }}
                            color="#ffb45e"
                            transparent
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                            toneMapped={false}
                        />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

/* ── crows keeping their distance over the keep ── */
function Crows() {
    const flock = useRef<THREE.Group>(null);
    const wings = useRef<(THREE.Mesh | null)[]>([]);
    const DARK = useMemo(() => new THREE.MeshBasicMaterial({ color: '#020102', side: THREE.DoubleSide }), []);
    useFrame((s) => {
        const t = s.clock.elapsedTime;
        if (flock.current) flock.current.rotation.y = t * 0.14;
        wings.current.forEach((w, i) => {
            if (w) w.rotation.z = Math.sin(t * (7 + (i % 3)) + i * 2.6) * 0.45;
        });
    });
    return (
        <group ref={flock} position={[26, 26, -2]}>
            {[0, 1, 2].map((i) => (
                <group key={i} position={[7 + i * 1.6, i * 0.8, 0]} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
                    <mesh ref={(m) => { wings.current[i * 2] = m; }} material={DARK} position={[-0.28, 0, 0]}>
                        <planeGeometry args={[0.6, 0.16]} />
                    </mesh>
                    <mesh ref={(m) => { wings.current[i * 2 + 1] = m; }} material={DARK} position={[0.28, 0, 0]} rotation={[0, 0, Math.PI]}>
                        <planeGeometry args={[0.6, 0.16]} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

/* ── broken colonnade: what's left of a processional way ── */
function Colonnade({ material, capGeo }: { material: THREE.Material; capGeo: THREE.BufferGeometry }) {
    const columns = useMemo(() => {
        const arr: { pos: [number, number, number]; h: number; lean: number; fallen: boolean }[] = [];
        for (let i = 0; i < 8; i++) {
            const side = i % 2 ? 1 : -1;
            const zBase = -66 - i * 3.4;
            const fallen = i === 3 || i === 6;
            arr.push({
                pos: [side * 3.6, 0, zBase],
                h: 1.6 + hash2(i * 4.1, 7) * 2.6,
                lean: (hash2(i * 8.3, 2) - 0.5) * 0.16,
                fallen,
            });
        }
        return arr;
    }, []);
    return (
        <>
            {columns.map((c, i) =>
                c.fallen ? (
                    <mesh key={i} material={material} position={[c.pos[0] * 0.7, 0.34, c.pos[2]]} rotation={[0, 0.3, Math.PI / 2 - 0.08]}>
                        <cylinderGeometry args={[0.34, 0.38, c.h, 9]} />
                    </mesh>
                ) : (
                    <group key={i} position={c.pos} rotation={[0, 0, c.lean]}>
                        <mesh material={material} position={[0, c.h / 2, 0]}>
                            <cylinderGeometry args={[0.32, 0.4, c.h, 9]} />
                        </mesh>
                        {/* shattered crown */}
                        <mesh geometry={capGeo} material={material} position={[0, c.h + 0.1, 0]} scale={[0.45, 0.22, 0.45]} />
                    </group>
                )
            )}
        </>
    );
}

/* ── mist / fog gate shader (shared) ── */
const mistVertex = /* glsl */ `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const mistFragment = /* glsl */ `
    uniform float uTime;
    uniform float uSeed;
    uniform float uAlpha;
    uniform vec3 uColor;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
                   mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
    }
    float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.05; a *= 0.5; }
        return v;
    }
    void main() {
        float n = fbm(vUv * vec2(3.0, 1.6) + vec2(uSeed + uTime * 0.04, uSeed));
        float edge = smoothstep(0.0, 0.28, vUv.x) * smoothstep(1.0, 0.72, vUv.x)
                   * smoothstep(0.0, 0.22, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
        gl_FragColor = vec4(uColor, n * edge * uAlpha);
    }
`;

function MistPlane({
    position, rotation, size, alpha, color, seed,
}: {
    position: [number, number, number];
    rotation: [number, number, number];
    size: [number, number];
    alpha: number;
    color: string;
    seed: number;
}) {
    const mat = useRef<THREE.ShaderMaterial>(null);
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uSeed: { value: seed },
            uAlpha: { value: alpha },
            uColor: { value: new THREE.Color(color) },
        }),
        [seed, alpha, color]
    );
    useFrame((state) => {
        if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    });
    return (
        <mesh position={position} rotation={rotation}>
            <planeGeometry args={size} />
            <shaderMaterial
                ref={mat}
                vertexShader={mistVertex}
                fragmentShader={mistFragment}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

/* ── ash drifting in the air, DS3's signature ── */
const moteVertex = /* glsl */ `
    attribute float aSeed;
    uniform float uTime;
    uniform float uPixelRatio;
    varying float vA;
    void main() {
        vec3 p = position;
        p.y = 7.0 - mod(aSeed * 7.0 + uTime * (0.10 + aSeed * 0.12), 7.0);
        p.x += sin(uTime * 0.25 + aSeed * 50.0) * 0.8;
        p.z += cos(uTime * 0.18 + aSeed * 30.0) * 0.5;
        vA = 0.5 + 0.5 * sin(uTime * (0.8 + aSeed) + aSeed * 20.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (1.2 + aSeed * 1.6) * uPixelRatio * (18.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
    }
`;
const moteFragment = /* glsl */ `
    varying float vA;
    void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = (1.0 - smoothstep(0.15, 0.5, d)) * (0.10 + vA * 0.12);
        gl_FragColor = vec4(vec3(0.55, 0.50, 0.46), a);
    }
`;

function AshMotes({ count }: { count: number }) {
    const mat = useRef<THREE.ShaderMaterial>(null);
    const data = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const seeds = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() * 2 - 1) * 13;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 10 - Math.random() * 195;
            seeds[i] = Math.random();
        }
        return { positions, seeds };
    }, [count]);
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.75) },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    useFrame((state) => {
        if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    });
    return (
        <points frustumCulled={false}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
                <bufferAttribute attach="attributes-aSeed" args={[data.seeds, 1]} />
            </bufferGeometry>
            <shaderMaterial
                ref={mat}
                vertexShader={moteVertex}
                fragmentShader={moteFragment}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

/* ── the world ── */
export function Journey({ tier }: { tier: 'full' | 'lite' }) {
    const z = (i: number) => STATIONS[i].z;
    const emberCount = tier === 'full' ? 110 : 60;

    const [rockColor, rockNormal, groundColor, groundNormal] = useLoader(THREE.TextureLoader, [
        '/textures/rock_color.jpg',
        '/textures/rock_normal.jpg',
        '/textures/ground_color.jpg',
        '/textures/ground_normal.jpg',
    ]);

    useMemo(() => {
        for (const t of [rockColor, rockNormal, groundColor, groundNormal]) {
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            t.needsUpdate = true;
        }
        rockColor.colorSpace = THREE.SRGBColorSpace;
        groundColor.colorSpace = THREE.SRGBColorSpace;
        rockColor.repeat.set(2.5, 2.5);
        rockNormal.repeat.set(2.5, 2.5);
        groundColor.repeat.set(14, 68);
        groundNormal.repeat.set(14, 68);
    }, [rockColor, rockNormal, groundColor, groundNormal]);

    const ROCK = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: '#655a5e',
                map: rockColor,
                normalMap: rockNormal,
                normalScale: new THREE.Vector2(1.15, 1.15),
                roughness: 1,
            }),
        [rockColor, rockNormal]
    );

    const cragGeo = useMemo(() => makeCragGeometry(1), []);
    const cragGeo2 = useMemo(() => makeCragGeometry(7), []);

    /* uneven ground, flat only where the road runs */
    const groundGeo = useMemo(() => {
        const g = new THREE.PlaneGeometry(90, 440, 60, 160);
        const pos = g.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i); // becomes -z after rotation
            const off = Math.min(Math.abs(x) / 5, 1);
            const damp = off * off * (3 - 2 * off); // keep the road walkable
            const h = (vnoise(x * 0.14, y * 0.14) * 1.3 + vnoise(x * 0.5, y * 0.5) * 0.3) * damp;
            pos.setZ(i, h);
        }
        g.computeVertexNormals();
        return g;
    }, []);

    /* crag instances: tall spires + low rubble */
    const spires = useMemo(() => {
        const arr: { pos: [number, number, number]; scale: [number, number, number]; rotY: number }[] = [];
        for (let i = 0; i < 42; i++) {
            const side = i % 2 === 0 ? 1 : -1;
            const r1 = hash2(i * 3.3, 1), r2 = hash2(i * 7.7, 2), r3 = hash2(i * 1.9, 3);
            const h = 2.5 + r2 * 7.5;
            arr.push({
                pos: [side * (7.5 + r1 * 10), h * 0.32, 8 - r3 * 198],
                scale: [0.9 + r1 * 1.4, h, 0.9 + r2 * 1.2],
                rotY: r3 * Math.PI,
            });
        }
        for (let i = 0; i < 26; i++) {
            const side = i % 2 === 0 ? 1 : -1;
            const r1 = hash2(i * 5.1, 4), r2 = hash2(i * 2.7, 5), r3 = hash2(i * 9.3, 6);
            arr.push({
                pos: [side * (4.5 + r1 * 4), 0.1 + r2 * 0.2, 6 - r3 * 190],
                scale: [0.5 + r1 * 1.3, 0.35 + r2 * 0.8, 0.5 + r2 * 1.1],
                rotY: r3 * Math.PI * 2,
            });
        }
        return arr;
    }, []);

    return (
        <group>
            {/* sky + moon */}
            <mesh>
                <sphereGeometry args={[260, 24, 16]} />
                <shaderMaterial vertexShader={skyVertex} fragmentShader={skyFragment} side={THREE.BackSide} depthWrite={false} />
            </mesh>
            <Eclipse position={[-46, 44, -150]} />

            {/* ground */}
            <mesh geometry={groundGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -80]}>
                <meshStandardMaterial
                    color="#5a5049"
                    map={groundColor}
                    normalMap={groundNormal}
                    normalScale={new THREE.Vector2(0.9, 0.9)}
                    roughness={1}
                />
            </mesh>

            {/* crags */}
            <instancedMesh
                args={[undefined, undefined, spires.length]}
                geometry={cragGeo}
                material={ROCK}
                ref={(node) => {
                    if (!node) return;
                    const m = new THREE.Matrix4();
                    const q = new THREE.Quaternion();
                    const e = new THREE.Euler();
                    spires.forEach((s, i) => {
                        e.set(0, s.rotY, 0);
                        q.setFromEuler(e);
                        m.compose(new THREE.Vector3(...s.pos), q, new THREE.Vector3(...s.scale));
                        node.setMatrixAt(i, m);
                    });
                    node.instanceMatrix.needsUpdate = true;
                }}
            />

            {/* the broken arch over the road, hung with what the war left */}
            <group position={[0.4, 0, z(1) - 10]}>
                <mesh position={[0, 3.4, 0]} rotation={[0, 0, 0.28]} material={ROCK}>
                    <torusGeometry args={[4.4, 0.5, 7, 22, Math.PI * 0.78]} />
                </mesh>
                <mesh geometry={cragGeo2} material={ROCK} position={[-4.4, 1.8, 0]} scale={[1.2, 4.2, 1.2]} />
                <mesh geometry={cragGeo2} material={ROCK} position={[4.5, 1.4, 0]} scale={[1.0, 3.2, 1.0]} />
                <Banner position={[-3.6, 2.35, 0.35]} seed={1.7} />
                <Banner position={[3.7, 2.0, -0.3]} seed={4.3} />
                <Chain from={[0.6, 3.6, 0.2]} to={[2.6, 0.05, 0.5]} />
                <Chain from={[-1.2, 3.8, -0.2]} to={[-3.0, 0.05, -0.4]} />
            </group>

            {/* what's left of a processional way */}
            <Colonnade material={ROCK} capGeo={cragGeo2} />

            {/* candles guttering where someone knelt */}
            <Candles position={[-4.1, 0, -30.5]} />
            <Candles position={[4.6, 0, -88]} />
            <Candles position={[-3.9, 0, z(4) - 2.2]} />

            {/* the far city, and the dead by the roadside */}
            <Skyline />
            <Graves />
            <SoulOrb position={[-3.0, 0.3, z(1) - 3.5]} />
            <SoulOrb position={[3.3, 0.28, z(3) - 6]} />
            <SoulOrb position={[2.6, 0.3, z(6) - 1.2]} />

            {/* air: ash motes + pooling mist */}
            <AshMotes count={tier === 'full' ? 260 : 110} />
            {[-18, -55, -95, -135, -168].map((mz, i) => (
                <MistPlane
                    key={mz}
                    position={[i % 2 ? -2 : 2, 0.5, mz]}
                    rotation={[-Math.PI / 2, 0, i * 0.9]}
                    size={[28, 12]}
                    alpha={0.14}
                    color="#2a2226"
                    seed={i * 13.7}
                />
            ))}

            {/* fog gates at area boundaries */}
            {STATIONS.slice(1).map((s) => (
                <MistPlane
                    key={s.id}
                    position={[0, 3.2, s.z + SEGMENT / 2]}
                    rotation={[0, 0, 0]}
                    size={[20, 8]}
                    alpha={0.5}
                    color="#1c0e10"
                    seed={Math.abs(s.z)}
                />
            ))}

            {/* ── stations ── */}
            {/* hero: the first bonfire, the Brand above it */}
            <Bonfire position={[2.6, 0, z(0) - 3]} emberCount={emberCount} />
            <Brand position={[2.6, 3.4, z(0) - 3]} />

            {/* about: two standing stones */}
            <mesh geometry={cragGeo2} material={ROCK} position={[-3.4, 1.9, z(1) - 2]} scale={[0.9, 2.6, 0.7]} />
            <mesh geometry={cragGeo2} material={ROCK} position={[3.8, 1.4, z(1) - 5]} scale={[0.7, 2.0, 0.6]} />

            {/* skills: the arsenal, blades planted at the roadside */}
            {[-2.6, -3.4, 2.8, 3.6, -4.2, 4.4].map((x, i) => (
                <group key={i} position={[x, 0, z(2) - i * 1.3]} rotation={[0, 0, (i % 2 ? -1 : 1) * (0.12 + (i % 3) * 0.08)]}>
                    <mesh position={[0, 1.1, 0]} material={ROCK}>
                        <boxGeometry args={[0.16, 2.2 + (i % 3) * 0.5, 0.05]} />
                    </mesh>
                    <mesh position={[0, 1.75, 0]} material={ROCK}>
                        <boxGeometry args={[0.5, 0.09, 0.07]} />
                    </mesh>
                </group>
            ))}

            {/* experience: a path of low stones */}
            {[0, 1, 2, 3, 4].map((i) => (
                <mesh key={i} geometry={i % 2 ? cragGeo : cragGeo2} material={ROCK}
                    position={[i % 2 ? -2.8 : 2.8, 0.4, z(3) - i * 2.6]}
                    scale={[0.7, 0.7 + (i % 3) * 0.3, 0.6]} rotation={[0, i, 0]} />
            ))}

            {/* ethos: one tall monolith */}
            <mesh geometry={cragGeo2} material={ROCK} position={[-3.4, 4.2, z(4) - 3]} scale={[1.3, 5.5, 1.0]} />

            {/* projects: the gate, pillars you pass between */}
            <mesh geometry={cragGeo} material={ROCK} position={[-3.1, 3.4, z(5) + 2]} scale={[1.1, 4.6, 1.1]} />
            <mesh geometry={cragGeo2} material={ROCK} position={[3.1, 3.6, z(5) + 2]} scale={[1.1, 4.8, 1.1]} />

            {/* certifications: a row of marks */}
            {[0, 1, 2].map((i) => (
                <mesh key={i} geometry={cragGeo} material={ROCK}
                    position={[3.0 + i * 0.4, 0.9, z(6) - i * 2.2]}
                    scale={[0.5, 1.3 - i * 0.2, 0.4]} rotation={[0, i * 2, 0]} />
            ))}

            {/* contact: the second bonfire, journey's end */}
            <Bonfire position={[1.6, 0, z(7) - 4]} emberCount={emberCount} />
        </group>
    );
}
