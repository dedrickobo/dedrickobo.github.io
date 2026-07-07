import { Suspense, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, GodRays } from '@react-three/postprocessing';
import { Rig } from './Rig';
import { Journey } from './Journey';
import { CAM_START, CAM_HEIGHT } from './road';
import type { GfxTier } from './tier';

/**
 * The single WebGL layer for the whole site: a fixed canvas behind the DOM.
 * You are on a road at night, backlit by an eclipsed sun.
 *
 * Light rig:
 *  - eclipse backlight: warm gold directional from the eclipse's own position,
 *    rimming every silhouette from behind (the FromSoft key light)
 *  - cool steel counter-fill from the opposite side, very low
 *  - hemisphere bounce: blood-dusk sky over ash ground
 *  - god rays stream from the eclipse's corona (full tier)
 */
export default function Scene({ tier }: { tier: Exclude<GfxTier, 'off'> }) {
    const [sun, setSun] = useState<THREE.Mesh | null>(null);

    const effects = (withRays: boolean) => (
        <EffectComposer multisampling={4}>
            {withRays && sun ? (
                <GodRays sun={sun} samples={60} density={0.97} decay={0.95} weight={0.24} exposure={0.26} clampMax={0.9} blur />
            ) : (
                <></>
            )}
            <Bloom intensity={0.9} luminanceThreshold={0.16} luminanceSmoothing={0.3} mipmapBlur />
            <Vignette eskil={false} offset={0.2} darkness={0.85} />
        </EffectComposer>
    );

    return (
        <div
            aria-hidden
            style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
        >
            <Canvas
                dpr={[1, tier === 'full' ? 1.75 : 1.25]}
                camera={{ fov: 55, position: [0, CAM_HEIGHT, CAM_START], near: 0.1, far: 320 }}
                gl={{ antialias: tier === 'lite', alpha: false, powerPreference: 'high-performance' }}
            >
                <color attach="background" args={['#0b0708']} />
                <fogExp2 attach="fog" args={['#0e0708', 0.022]} />

                <hemisphereLight args={['#2a1216', '#0c0a09', 0.45]} />
                <ambientLight intensity={0.1} color="#38303a" />
                <directionalLight position={[-46, 44, -150]} intensity={0.72} color="#c9995c" />
                <directionalLight position={[30, 18, 60]} intensity={0.22} color="#3d4452" />

                <Rig />
                <Suspense fallback={null}>
                    <Journey tier={tier} onSunReady={setSun} />
                </Suspense>
                {tier === 'full' && effects(true)}
            </Canvas>
        </div>
    );
}
