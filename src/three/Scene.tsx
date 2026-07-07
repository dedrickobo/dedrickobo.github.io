import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Rig } from './Rig';
import { Journey } from './Journey';
import { CAM_START, CAM_HEIGHT } from './road';
import type { GfxTier } from './tier';

/**
 * The single WebGL layer for the whole site: a fixed canvas behind the DOM.
 * You are on a road at night. Scrolling walks it. Bloom makes the fire,
 * the Brand, and the moon actually glow; the vignette closes the dark in.
 */
export default function Scene({ tier }: { tier: Exclude<GfxTier, 'off'> }) {
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
                <ambientLight intensity={0.26} color="#38303a" />
                {/* eclipse-light: pale, cold, from high left; strong enough to catch the normal maps */}
                <directionalLight position={[-30, 40, -60]} intensity={0.85} color="#5c5560" />
                <Rig />
                <Suspense fallback={null}>
                    <Journey tier={tier} />
                </Suspense>
                {tier === 'full' && (
                    <EffectComposer multisampling={4}>
                        <Bloom intensity={0.9} luminanceThreshold={0.16} luminanceSmoothing={0.3} mipmapBlur />
                        <Vignette eskil={false} offset={0.2} darkness={0.85} />
                    </EffectComposer>
                )}
            </Canvas>
        </div>
    );
}
