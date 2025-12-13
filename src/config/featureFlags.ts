export const featureFlags = {
    USE_PIXI_BACKGROUND: false,
    USE_GAME_HUD: false,
    USE_ARCADE_NAV: false,
} as const;

export type FeatureFlagKey = keyof typeof featureFlags;

export const isFeatureEnabled = (flag: FeatureFlagKey) =>
    Boolean(featureFlags[flag]);


