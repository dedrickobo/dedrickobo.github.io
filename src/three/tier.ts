export type GfxTier = 'full' | 'lite' | 'off';

/**
 * Decide how much GPU work this device gets.
 * off  = reduced motion or no WebGL: the CSS backdrop carries the page alone.
 * lite = weak or coarse-pointer devices: fewer embers, no extra passes.
 * full = everything.
 */
export function detectTier(): GfxTier {
    if (typeof window === 'undefined') return 'off';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off';

    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') ?? probe.getContext('webgl');
    if (!gl) return 'off';

    const nav = navigator as Navigator & { deviceMemory?: number };
    const weak =
        (nav.hardwareConcurrency ?? 8) <= 4 ||
        (nav.deviceMemory ?? 8) <= 4 ||
        window.matchMedia('(pointer: coarse)').matches;

    return weak ? 'lite' : 'full';
}
