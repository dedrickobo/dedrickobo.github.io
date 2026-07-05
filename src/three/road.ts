/**
 * The road: the world-space contract between the camera rig, the world,
 * and (later) the Hub. One station per DOM section, marching down -Z.
 * The Hub model can later fly the rig to any STATIONS[i] pose directly.
 */
export const SEGMENT = 24;

export const STATIONS = [
    { id: 'hero', z: 0 },
    { id: 'about', z: -SEGMENT * 1 },
    { id: 'skills', z: -SEGMENT * 2 },
    { id: 'experience', z: -SEGMENT * 3 },
    { id: 'ethos', z: -SEGMENT * 4 },
    { id: 'projects', z: -SEGMENT * 5 },
    { id: 'certifications', z: -SEGMENT * 6 },
    { id: 'contact', z: -SEGMENT * 7 },
] as const;

export const CAM_START = 6;
export const CAM_HEIGHT = 1.7;
/** camera halts a few paces before the final bonfire */
export const TRAVEL = CAM_START - (STATIONS[STATIONS.length - 1].z + 3);
