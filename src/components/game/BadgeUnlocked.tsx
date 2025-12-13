import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BadgeUnlockedProps {
    badgeId: string;
    onClose?: () => void;
}

const VARIANTS = {
    hidden: { opacity: 0, scale: 0.9, y: 40 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.25 },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: -20,
        transition: { duration: 0.2 },
    },
};

export function BadgeUnlocked({
    badgeId,
    onClose,
}: BadgeUnlockedProps) {
    useEffect(() => {
        const timeout = window.setTimeout(() => {
            onClose?.();
        }, 3000);
        return () => window.clearTimeout(timeout);
    }, [onClose]);

    return (
        <AnimatePresence>
            <div className="pointer-events-none fixed top-1/5 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4">
                <motion.div
                    variants={VARIANTS}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="pointer-events-auto card-brutal-primary border-neon-accent px-8 py-6 text-center"
                >
                    <p className="text-xs font-mono-brutal text-accent">
                        ACHIEVEMENT UNLOCKED
                    </p>
                    <h3 className="mt-2 font-brutal text-2xl">{badgeId}</h3>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default BadgeUnlocked;

