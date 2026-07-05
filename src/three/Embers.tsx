import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Sourced ember emitter: sparks born at a point (a bonfire), rising in a
 * widening cone, flickering out. Embers have an origin, or they're confetti.
 * One draw call; all motion in the vertex shader.
 */

const vertex = /* glsl */ `
    attribute float aSeed;
    attribute float aSize;
    uniform float uTime;
    uniform float uPixelRatio;
    varying float vAlpha;
    varying float vHeat;

    void main() {
        float speed = 0.11 + fract(aSeed * 7.31) * 0.14;
        float prog  = fract(aSeed + uTime * speed);        // 0 birth → 1 death
        float ang   = fract(aSeed * 13.7) * 6.28318;
        float rad   = fract(aSeed * 5.23);

        vec3 p;
        // rise ~2.6 units, drifting outward as they climb
        p.y = prog * (2.0 + fract(aSeed * 3.7) * 1.4);
        float spread = 0.10 + prog * (0.45 + rad * 0.5);
        p.x = cos(ang) * spread + sin(uTime * (0.6 + rad) + aSeed * 40.0) * 0.12 * prog;
        p.z = sin(ang) * spread * 0.6;

        vHeat = 1.0 - prog * (0.55 + rad * 0.3);           // cools as it climbs
        float flicker = 0.65 + 0.35 * sin(uTime * (3.0 + rad * 5.0) + aSeed * 91.0);
        vAlpha = smoothstep(0.0, 0.06, prog) * (1.0 - smoothstep(0.55, 1.0, prog)) * flicker;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = aSize * uPixelRatio * (22.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
    }
`;

const fragment = /* glsl */ `
    varying float vAlpha;
    varying float vHeat;

    void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float disc = 1.0 - smoothstep(0.12, 0.5, length(uv));
        if (disc < 0.001) discard;

        vec3 hot   = vec3(0.99, 0.72, 0.28);
        vec3 ember = vec3(0.92, 0.42, 0.10);
        vec3 blood = vec3(0.48, 0.09, 0.10);
        vec3 col = mix(blood, mix(ember, hot, smoothstep(0.7, 1.0, vHeat)), vHeat);

        gl_FragColor = vec4(col, disc * vAlpha);
    }
`;

type EmbersProps = {
    count: number;
    position?: [number, number, number];
};

export function Embers({ count, position = [0, 0, 0] }: EmbersProps) {
    const mat = useRef<THREE.ShaderMaterial>(null);

    const { positions, seeds, sizes } = useMemo(() => {
        const positions = new Float32Array(count * 3); // placeholder; shader computes real position
        const seeds = new Float32Array(count);
        const sizes = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            seeds[i] = Math.random();
            sizes[i] = 1.4 + Math.random() * 2.4;
        }
        return { positions, seeds, sizes };
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
        <points position={position} frustumCulled={false}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
                <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
            </bufferGeometry>
            <shaderMaterial
                ref={mat}
                vertexShader={vertex}
                fragmentShader={fragment}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
