import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

interface LevelUpOverlayProps {
    level: number;
    onClose?: () => void;
}

export function LevelUpOverlay({
    level,
    onClose,
}: LevelUpOverlayProps) {
    useEffect(() => {
        const timeout = window.setTimeout(() => {
            onClose?.();
        }, 3500);
        return () => window.clearTimeout(timeout);
    }, [onClose]);

    return (
        <AnimatePresence>
            <div className="pointer-events-none fixed inset-0 z-35 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35 }}
                    className="pointer-events-auto card-brutal-primary border-neon-primary px-10 py-8 text-center"
                >
                    <p className="text-xs font-mono-brutal text-accent">
                        LEVEL UP!
                    </p>
                    <h2 className="mt-3 font-brutal text-4xl text-primary">
                        LEVEL {level}
                    </h2>
                    <p className="mt-2 text-sm font-mono-brutal text-text-muted">
                        Keep trading to boost your rank.
                    </p>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default LevelUpOverlay;

