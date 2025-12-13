import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import { useGameStore } from "@/store/gameStore";

// Placeholder audio assets (to be replaced with real files later)
const soundPaths = {
    click: "/sounds/click.mp3",
    success: "/sounds/success.mp3",
    levelUp: "/sounds/level-up.mp3",
    error: "/sounds/error.mp3",
} as const;

interface GameSoundManagerProps {
    muted?: boolean;
}

/**
    * Minimal sound manager. The real assets will be integrated later.
    * Provides a simple API via ref callbacks for other components.
    */
export function GameSoundManager({ muted = true }: GameSoundManagerProps) {
    const [isMuted, setIsMuted] = useState(muted);
    const lastXPEventAtRef = useRef<number | undefined>(undefined);
    const levelRef = useRef<number | undefined>(undefined);

    const lastXPEventAt = useGameStore((state) => state.lastXPEventAt);
    const level = useGameStore((state) => state.level ?? state.player.level);

    const commonOptions = { soundEnabled: !isMuted, preload: false } as const;
    const [playClick] = useSound(soundPaths.click, commonOptions);
    const [playSuccess] = useSound(soundPaths.success, {
        ...commonOptions,
    });
    const [playLevelUp] = useSound(soundPaths.levelUp, {
        ...commonOptions,
    });
    const [playError] = useSound(soundPaths.error, commonOptions);

    useEffect(() => {
        if (
            typeof lastXPEventAt === "number" &&
            lastXPEventAt !== lastXPEventAtRef.current
        ) {
            lastXPEventAtRef.current = lastXPEventAt;
            playSuccess();
        }
    }, [lastXPEventAt, playSuccess]);

    useEffect(() => {
        if (typeof level !== "number") {
            return;
        }
        if (typeof levelRef.current === "number" && level > levelRef.current) {
            playLevelUp();
        }
        levelRef.current = level;
    }, [level, playLevelUp]);

    useEffect(() => {
        if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.debug("[GameSoundManager] Muted:", isMuted);
        }
    }, [isMuted]);

    // Expose helpers through window for quick QA introspection.
    useEffect(() => {
        if (typeof window !== "undefined") {
            (window as any).__gameSound__ = {
                toggleMute: () => setIsMuted((prev) => !prev),
                playClick,
                playError,
            };
        }
    }, [playClick, playError]);

    return null;
}

export default GameSoundManager;

