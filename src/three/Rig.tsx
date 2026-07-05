import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAM_START, CAM_HEIGHT, TRAVEL } from './road';

/**
 * The traveler. Scroll progress walks the camera down the road; the mouse
 * steers the gaze a few degrees. Architected for the future Hub model:
 * anything that can write a target pose can drive this rig instead of scroll.
 */
export function Rig() {
    const { camera } = useThree();

    useFrame((state) => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;

        // walk the road (Lenis already smooths scroll; keep our own lerp light)
        const targetZ = CAM_START - p * TRAVEL;
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.09);

        // gentle gait: a slow weave and a footstep bob keyed to distance walked
        camera.position.x = Math.sin(camera.position.z * 0.22) * 0.35;
        camera.position.y = CAM_HEIGHT + Math.sin(camera.position.z * 1.4) * 0.03;

        // mouse look, damped: a gaze, not a swivel
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -state.pointer.x * 0.07, 0.045);
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, state.pointer.y * 0.04, 0.045);
    });

    return null;
}
