// Feature flags for progressive rollout
// Allows enabling/disabling new features without breaking existing functionality

export const featureFlags = {
    USE_PIXI_BACKGROUND: import.meta.env.VITE_USE_PIXI_BACKGROUND !== 'false',
    USE_GAME_HUD: import.meta.env.VITE_USE_GAME_HUD !== 'false',
    USE_ARCADE_NAV: import.meta.env.VITE_USE_ARCADE_NAV !== 'false',
    USE_SOUND: import.meta.env.VITE_USE_SOUND !== 'false',
    REDUCE_MOTION: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

// Check if device is mobile/low-end
export const isMobileDevice = () => {
    return window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Performance detection
export const getPerformanceLevel = (): 'high' | 'medium' | 'low' => {
    if (featureFlags.REDUCE_MOTION) return 'low';
    if (isMobileDevice()) return 'medium';
    
    // Check device pixel ratio and hardware concurrency
    const pixelRatio = window.devicePixelRatio || 1;
    const cores = navigator.hardwareConcurrency || 4;
    
    if (pixelRatio > 2 && cores >= 8) return 'high';
    if (pixelRatio > 1 && cores >= 4) return 'medium';
    return 'low';
};

