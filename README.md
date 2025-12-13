## Game UI Upgrade Scaffold

This branch introduces the first incremental pieces of the new arcade-style UI:

-   PIXI-based background scaffold (`CanvasBackgroundPIXI`) with performance-conscious teardown.
-   Global feature flags in `src/config/featureFlags.ts` to toggle between legacy and new components.
-   HUD, Sound Manager, badge, and level-up overlay placeholders wired to the Zustand store (no breaking changes).
-   Arcade navigation prototype powered by `use-sound` with neon button styling.
-   Zustand store extensions for XP, level, badges, and portfolio updates while keeping the existing API intact.
-   Dynamic wallet scaffolding (feature-gated) with Linera adapter and signer integration.

### Feature Flags

Flags live in `src/config/featureFlags.ts` and default to the legacy experience:

-   `USE_PIXI_BACKGROUND`
-   `USE_GAME_HUD`
-   `USE_ARCADE_NAV`

Toggle them to preview the new components safely. The layout automatically adjusts based on the active navigation.

### Performance Notes

-   The PIXI background is throttled to a lightweight grid until we layer in parallax effects.
-   Sound manager loads assets lazily and stays muted by default.
-   Confetti effects are currently disabled (placeholders only) to keep the build lean.
-   Dynamic wallet connect requires environment variables and will show a modal gate if unset.

### Next Steps

-   Replace the placeholder HUD buttons with real actions.
-   Add particle/animation layers to the PIXI scene behind the feature flag.
-   Wire badge and level overlays to store events once the progression flow is scripted.
-   Integrate real GraphQL data once the service hooks are available.
-   Configure Dynamic environment IDs and Linera RPC URLs for wallet authentication. See `src/config/dynamicConfig.ts` and set:
    -   `VITE_DYNAMIC_ENV_ID`
    -   `VITE_LINERA_RPC_URL`
    -   `VITE_LINERA_APP_ID` (optional application binding)
