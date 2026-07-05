import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Embers } from './Embers';

/**
 * The bonfire: a twisted coiled sword stabbed into a mound of bone ash,
 * heat glowing up its lower blade, wrapped in a layered fire of volumetric
 * flame sheets + noise-eroded particles + embers + flickering light.
 */

const NOISE = /* glsl */ `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
                   mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
    }
    float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
        return v;
    }
`;

/* ── volumetric flame sheets: the body of the fire ── */
const sheetVertex = /* glsl */ `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const sheetFragment = /* glsl */ `
    uniform float uTime;
    uniform float uSeed;
    varying vec2 vUv;
    ${NOISE}

    void main() {
        vec2 uv = vUv;
        // rising turbulence, layered at two speeds
        float n1 = fbm(vec2(uv.x * 2.6 + uSeed, uv.y * 1.9 - uTime * 2.1));
        float n2 = fbm(vec2(uv.x * 5.0 - uSeed, uv.y * 3.4 - uTime * 3.4)) * 0.5;
        // flame body: widest at base, tapering, eaten by noise as it climbs
        float side = 1.0 - abs(uv.x - 0.5) * 2.0;
        float body = side * (1.0 - uv.y);
        float flame = smoothstep(0.22, 0.62, body + (n1 + n2 - 0.75) * 0.5 - uv.y * 0.30);
        if (flame < 0.01) discard;

        // white-hot core low and centered, cooling to blood at the tips (HDR for bloom)
        float core = smoothstep(0.45, 0.95, flame) * (1.0 - uv.y * 0.85);
        vec3 col = vec3(0.55, 0.10, 0.07);                       // outer blood
        col = mix(col, vec3(1.15, 0.45, 0.09), smoothstep(0.12, 0.5, flame));  // orange
        col = mix(col, vec3(1.7, 1.25, 0.7), core);              // white-gold heart
        gl_FragColor = vec4(col, flame * 0.62);
    }
`;

function FlameSheets() {
    const mats = useRef<(THREE.ShaderMaterial | null)[]>([null, null]);
    const uniforms = useMemo(
        () => [0, 1].map((i) => ({ uTime: { value: i * 37.0 }, uSeed: { value: i * 4.7 } })),
        []
    );
    useFrame((_, delta) => {
        mats.current.forEach((m) => m && (m.uniforms.uTime.value += delta));
    });
    return (
        <>
            {[0, Math.PI / 2].map((ry, i) => (
                <mesh key={ry} position={[0, 0.72, 0]} rotation={[0, ry + 0.4, 0]}>
                    <planeGeometry args={[1.0, 1.5]} />
                    <shaderMaterial
                        ref={(m) => { mats.current[i] = m; }}
                        vertexShader={sheetVertex}
                        fragmentShader={sheetFragment}
                        uniforms={uniforms[i]}
                        transparent
                        depthWrite={false}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </>
    );
}

/* ── flame particles: licks and tongues above the sheets ── */
const flameVertex = /* glsl */ `
    attribute float aSeed;
    attribute float aSize;
    uniform float uTime;
    uniform float uPixelRatio;
    varying float vProg;
    varying float vSeed;

    void main() {
        float speed = 0.55 + fract(aSeed * 7.31) * 0.5;
        float prog  = fract(aSeed + uTime * speed);
        float ang   = fract(aSeed * 13.7) * 6.28318;

        float spread = (0.20 * (1.0 - prog) + 0.04) * (0.7 + fract(aSeed * 5.2) * 0.6);
        vec3 p;
        p.x = cos(ang) * spread + sin(uTime * 2.4 + aSeed * 60.0) * 0.09 * prog;
        p.z = sin(ang) * spread * 0.7;
        p.y = prog * (1.0 + fract(aSeed * 3.7) * 0.55);

        vProg = prog;
        vSeed = aSeed;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float profile = sin(prog * 3.14159);
        gl_PointSize = aSize * profile * uPixelRatio * (26.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
    }
`;
const flameFragment = /* glsl */ `
    uniform float uTime;
    varying float vProg;
    varying float vSeed;
    ${NOISE}

    void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float n = fbm(uv * 3.5 + vec2(vSeed * 43.0, vSeed * 91.0 - uTime * 1.8));
        float a = smoothstep(0.0, 0.24, (0.5 - d) + (n - 0.5) * 0.4);
        if (a < 0.01) discard;

        vec3 core  = vec3(1.6, 1.2, 0.62);
        vec3 mid   = vec3(1.15, 0.46, 0.09);
        vec3 blood = vec3(0.5, 0.09, 0.08);
        vec3 col = mix(core, mid, smoothstep(0.06, 0.4, vProg));
        col = mix(col, blood, smoothstep(0.42, 0.85, vProg));

        float fade = smoothstep(0.0, 0.07, vProg) * (1.0 - smoothstep(0.7, 1.0, vProg));
        gl_FragColor = vec4(col, a * fade * 0.8);
    }
`;

const smokeVertex = /* glsl */ `
    attribute float aSeed;
    attribute float aSize;
    uniform float uTime;
    uniform float uPixelRatio;
    varying float vProg;
    varying float vSeed;

    void main() {
        float prog = fract(aSeed + uTime * (0.16 + fract(aSeed * 5.1) * 0.1));
        float ang  = fract(aSeed * 13.7) * 6.28318;
        vec3 p;
        p.y = 1.0 + prog * 2.3;
        p.x = cos(ang) * 0.12 + sin(uTime * 0.7 + aSeed * 31.0) * (0.15 + prog * 0.45);
        p.z = sin(ang) * 0.1;

        vProg = prog;
        vSeed = aSeed;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = aSize * (0.5 + prog) * uPixelRatio * (30.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
    }
`;
const smokeFragment = /* glsl */ `
    uniform float uTime;
    varying float vProg;
    varying float vSeed;
    ${NOISE}

    void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float n = fbm(uv * 2.5 + vec2(vSeed * 71.0, -uTime * 0.35));
        float a = smoothstep(0.0, 0.3, (0.5 - length(uv)) + (n - 0.5) * 0.4);
        float fade = smoothstep(0.0, 0.2, vProg) * (1.0 - smoothstep(0.6, 1.0, vProg));
        gl_FragColor = vec4(vec3(0.06, 0.045, 0.045), a * fade * 0.18);
    }
`;

function makeParticles(count: number) {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
        seeds[i] = Math.random();
        sizes[i] = 6 + Math.random() * 9;
    }
    return { positions, seeds, sizes };
}

function ParticlePass({
    count, vertexShader, fragmentShader, blending,
}: {
    count: number; vertexShader: string; fragmentShader: string; blending: THREE.Blending;
}) {
    const mat = useRef<THREE.ShaderMaterial>(null);
    const data = useMemo(() => makeParticles(count), [count]);
    const uniforms = useMemo(
        () => ({
            uTime: { value: Math.random() * 100 },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.75) },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useFrame((_, delta) => {
        if (mat.current) mat.current.uniforms.uTime.value += delta;
    });

    return (
        <points frustumCulled={false}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
                <bufferAttribute attach="attributes-aSeed" args={[data.seeds, 1]} />
                <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
            </bufferGeometry>
            <shaderMaterial
                ref={mat}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={blending}
            />
        </points>
    );
}

/* ── the coiled sword: a flat blade that twists as it rises ── */
export function makeTwistedBladeGeometry(height = 2.25, turns = 1.6) {
    // diamond cross-section, many y-slices; each slice tapered, twisted, swayed
    const g = new THREE.CylinderGeometry(1, 1, height, 4, 96, true);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const t = (v.y + height / 2) / height; // 0 tip (in the ash) → 1 hilt
        // blade widens from the buried tip, narrows slightly before the guard
        const width = 0.045 + 0.115 * Math.pow(Math.min(t / 0.7, 1), 0.75) * (1 - 0.3 * Math.max(0, (t - 0.82) / 0.18));
        const thick = 0.012 + 0.02 * t;
        const x0 = v.x * width;
        const z0 = v.z * thick;
        const ang = t * Math.PI * 2 * turns + 0.5;
        const x = x0 * Math.cos(ang) - z0 * Math.sin(ang) + Math.sin(t * Math.PI * 1.7) * 0.045;
        const z = x0 * Math.sin(ang) + z0 * Math.cos(ang) + Math.cos(t * Math.PI * 1.3) * 0.03;
        pos.setXYZ(i, x, v.y + height / 2, z);
    }
    g.computeVertexNormals();
    return g;
}

/** charred iron that glows with heat near the fire, cooling as it rises */
function makeHeatMaterial(hotUpTo = 1.2) {
    const m = new THREE.MeshStandardMaterial({
        color: '#171110',
        roughness: 0.55,
        metalness: 0.8,
        emissive: new THREE.Color('#ff5a1a'),
        emissiveIntensity: 1.0,
    });
    m.onBeforeCompile = (s) => {
        s.vertexShader = s.vertexShader
            .replace('#include <common>', '#include <common>\nvarying float vHeatY;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvHeatY = position.y;');
        s.fragmentShader = s.fragmentShader
            .replace('#include <common>', '#include <common>\nvarying float vHeatY;')
            .replace(
                '#include <emissivemap_fragment>',
                `#include <emissivemap_fragment>\ntotalEmissiveRadiance *= smoothstep(${hotUpTo.toFixed(2)}, 0.05, vHeatY);`
            );
    };
    return m;
}

const IRON = new THREE.MeshStandardMaterial({ color: '#171110', roughness: 0.6, metalness: 0.8 });

function CoiledSword() {
    const blade = useMemo(() => makeTwistedBladeGeometry(), []);
    const heatMat = useMemo(() => makeHeatMaterial(1.25), []);

    return (
        <group rotation={[0.05, 0.3, -0.10]}>
            <mesh geometry={blade} material={heatMat} />
            {/* guard: two down-swept crescent prongs */}
            <mesh position={[0.11, 2.24, 0]} rotation={[Math.PI / 2, 0, -2.5]} material={IRON}>
                <torusGeometry args={[0.13, 0.022, 6, 14, Math.PI * 0.8]} />
            </mesh>
            <mesh position={[-0.11, 2.24, 0]} rotation={[Math.PI / 2, 0, 0.65]} material={IRON}>
                <torusGeometry args={[0.13, 0.022, 6, 14, Math.PI * 0.8]} />
            </mesh>
            {/* grip + pommel */}
            <mesh position={[0, 2.44, 0]} material={IRON}>
                <cylinderGeometry args={[0.032, 0.04, 0.36, 8]} />
            </mesh>
            <mesh position={[0, 2.66, 0]} material={IRON}>
                <sphereGeometry args={[0.06, 10, 8]} />
            </mesh>
        </group>
    );
}

/* ── the ash mound with bones ── */
function hash2(x: number, z: number) {
    const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
    return s - Math.floor(s);
}

const ASH = new THREE.MeshStandardMaterial({ color: '#464039', roughness: 1 });
const BONE = new THREE.MeshStandardMaterial({ color: '#6e675c', roughness: 0.9 });

function AshMound() {
    const geometry = useMemo(() => {
        const g = new THREE.SphereGeometry(1, 36, 22);
        const pos = g.attributes.position as THREE.BufferAttribute;
        const v = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            const n = 1 + (hash2(v.x * 3.1, v.z * 3.1) - 0.5) * 0.34 + (hash2(v.x * 9.7, v.z * 9.7) - 0.5) * 0.12;
            v.multiplyScalar(n);
            pos.setXYZ(i, v.x, v.y, v.z);
        }
        g.computeVertexNormals();
        return g;
    }, []);

    /* a proper pile: femurs ringing the base, ribs arcing out of the ash, skulls */
    const femurs = useMemo(() => {
        const arr: { pos: [number, number, number]; rot: [number, number, number]; len: number }[] = [];
        for (let i = 0; i < 24; i++) {
            const a = hash2(i * 3.7, i * 1.3) * Math.PI * 2;
            const ring = i < 15; // most form the debris ring at the base
            const r = ring ? 0.72 + hash2(i * 7.1, i * 2.9) * 0.5 : 0.25 + hash2(i * 7.1, i * 2.9) * 0.4;
            arr.push({
                pos: [Math.cos(a) * r, (ring ? 0.03 : 0.12) + hash2(i * 1.9, i * 8.3) * 0.1, Math.sin(a) * r],
                rot: [hash2(i, 1) * 1.1 - 0.55, a + hash2(i, 4) * 1.5, hash2(i, 2) * 0.9 - 0.45],
                len: 0.2 + hash2(i * 5.3, i) * 0.18,
            });
        }
        return arr;
    }, []);

    const ribs = useMemo(() => {
        const arr: { pos: [number, number, number]; rot: [number, number, number]; r: number }[] = [];
        for (let i = 0; i < 7; i++) {
            const a = hash2(i * 9.1, i * 2.3) * Math.PI * 2;
            const r = 0.4 + hash2(i * 4.7, i) * 0.5;
            arr.push({
                pos: [Math.cos(a) * r, 0.05 + hash2(i, i) * 0.08, Math.sin(a) * r],
                rot: [hash2(i, 5) * 1.2 - 0.2, a, hash2(i, 6) * 1.2 - 0.6],
                r: 0.1 + hash2(i * 2.9, i) * 0.08,
            });
        }
        return arr;
    }, []);

    const skulls = useMemo(
        () => [
            { pos: [0.55, 0.16, 0.42] as const, rot: [0.3, -0.7, 0.15] as const, s: 1 },
            { pos: [-0.68, 0.09, 0.30] as const, rot: [-0.2, 1.9, 0.5] as const, s: 0.9 },
            { pos: [0.18, 0.07, -0.78] as const, rot: [0.55, 0.4, -0.3] as const, s: 0.85 },
        ],
        []
    );

    return (
        <group>
            <mesh geometry={geometry} material={ASH} scale={[1.15, 0.34, 1.15]} position={[0, 0.02, 0]} />
            {femurs.map((b, i) => (
                <group key={i} position={b.pos} rotation={b.rot}>
                    <mesh material={BONE} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.022, 0.026, b.len, 6]} />
                    </mesh>
                    <mesh material={BONE} position={[b.len / 2, 0, 0]}>
                        <sphereGeometry args={[0.038, 6, 5]} />
                    </mesh>
                    <mesh material={BONE} position={[-b.len / 2, 0, 0]}>
                        <sphereGeometry args={[0.036, 6, 5]} />
                    </mesh>
                </group>
            ))}
            {ribs.map((b, i) => (
                <mesh key={`r${i}`} material={BONE} position={b.pos} rotation={b.rot}>
                    <torusGeometry args={[b.r, 0.014, 5, 10, Math.PI * 0.9]} />
                </mesh>
            ))}
            {skulls.map((s, i) => (
                <group key={`s${i}`} position={s.pos as unknown as [number, number, number]} rotation={s.rot as unknown as [number, number, number]} scale={s.s}>
                    <mesh material={BONE}>
                        <sphereGeometry args={[0.085, 10, 8]} />
                    </mesh>
                    <mesh material={BONE} position={[0, -0.055, 0.045]}>
                        <boxGeometry args={[0.09, 0.05, 0.08]} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

export function Bonfire({
    position,
    emberCount = 110,
}: {
    position: [number, number, number];
    emberCount?: number;
}) {
    const light = useRef<THREE.PointLight>(null);
    const glow = useRef<THREE.MeshBasicMaterial>(null);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const f = 9 + 2.4 * Math.sin(t * 7.3) * Math.sin(t * 3.1) + 1.3 * Math.sin(t * 13.7);
        if (light.current) light.current.intensity = f;
        if (glow.current) glow.current.opacity = 0.10 + (f - 9) * 0.012;
    });

    return (
        <group position={position}>
            <AshMound />
            <CoiledSword />

            {/* the fire: sheets carry the body, particles the licks */}
            <group position={[0, 0.28, 0]}>
                <FlameSheets />
                <ParticlePass count={56} vertexShader={flameVertex} fragmentShader={flameFragment} blending={THREE.AdditiveBlending} />
                <ParticlePass count={10} vertexShader={smokeVertex} fragmentShader={smokeFragment} blending={THREE.NormalBlending} />
                <Embers count={emberCount} position={[0, 0.4, 0]} />
            </group>

            {/* warm pool of light on the ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                <circleGeometry args={[2.3, 24]} />
                <meshBasicMaterial ref={glow} color="#ff6a22" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>

            <pointLight ref={light} position={[0, 1.0, 0]} color="#ff7a2a" distance={18} decay={2} />
        </group>
    );
}
