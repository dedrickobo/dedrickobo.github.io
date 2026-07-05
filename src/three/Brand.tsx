import { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as THREE from 'three';

/**
 * The Brand of Sacrifice, extruded from the site's own SVG, hanging in the
 * air above the first bonfire. It breathes (a slow scale pulse, no spin),
 * bobs like something not quite anchored to the world, and its blood glow
 * pulses like a fresh wound. The firelight below catches its edges.
 */
export function Brand({ position }: { position: [number, number, number] }) {
    const outer = useRef<THREE.Group>(null);
    const svg = useLoader(SVGLoader, '/brandofsacrifice.svg');

    const { geometry, scale } = useMemo(() => {
        // Only the filled path is the solid Brand; the stroked group is decoration.
        const shapes = svg.paths
            .filter((p) => {
                const fill = (p.userData?.style as { fill?: string } | undefined)?.fill;
                return fill && fill !== 'none';
            })
            .flatMap((p) => SVGLoader.createShapes(p));

        const geometry = new THREE.ExtrudeGeometry(shapes, {
            depth: 16,
            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 1.4,
            bevelSegments: 2,
            curveSegments: 8,
        });
        geometry.center();
        geometry.computeBoundingBox();
        const bb = geometry.boundingBox!;
        const height = bb.max.y - bb.min.y;
        return { geometry, scale: 2.3 / height }; // ~2.3 world units tall
    }, [svg]);

    const materials = useMemo(() => {
        const body = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#160a0b'),
            emissive: new THREE.Color('#8f1d22'),
            emissiveIntensity: 0.5,
            roughness: 0.38,
            metalness: 0.55,
        });
        const aura = new THREE.MeshBasicMaterial({
            color: new THREE.Color('#a3242a'),
            transparent: true,
            opacity: 0.14,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        return { body, aura };
    }, []);

    useFrame((state) => {
        const g = outer.current;
        if (!g) return;
        const t = state.clock.elapsedTime;

        // breathing, bobbing; a lean toward the cursor, never a spin
        g.scale.setScalar(scale * (1 + 0.02 * Math.sin(t * 1.3)));
        g.position.y = position[1] + Math.sin(t * 0.8) * 0.08;
        g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * 0.18, 0.04);
        g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.10, 0.04);

        // the wound pulses
        materials.body.emissiveIntensity = 0.45 + 0.32 * (0.5 + 0.5 * Math.sin(t * 1.3));
        materials.aura.opacity = 0.10 + 0.07 * (0.5 + 0.5 * Math.sin(t * 1.3));
    });

    return (
        <group ref={outer} position={position}>
            {/* SVG space is y-down: flip once here */}
            <group rotation={[Math.PI, 0, 0]}>
                <mesh geometry={geometry} material={materials.body} />
                <mesh geometry={geometry} material={materials.aura} scale={1.035} />
            </group>
        </group>
    );
}
