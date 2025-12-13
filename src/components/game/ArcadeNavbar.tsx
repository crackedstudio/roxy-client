import { NavLink } from "react-router-dom";
import useSound from "use-sound";
import { useMemo } from "react";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
    { to: "/app", label: "Dashboard", aria: "Go to dashboard" },
    { to: "/app/markets", label: "Markets", aria: "Browse markets" },
    { to: "/app/portfolio", label: "Portfolio", aria: "View portfolio" },
    { to: "/app/leaderboard", label: "Leaderboard", aria: "Open leaderboard" },
    { to: "/app/guilds", label: "Guilds", aria: "View guilds" },
] as const;

interface ArcadeNavbarProps {
    className?: string;
    soundPath?: string;
    muted?: boolean;
}

export function ArcadeNavbar({
    className,
    soundPath = "/sounds/click.mp3",
    muted = true,
}: ArcadeNavbarProps) {
    const [playClick] = useSound(soundPath, {
        soundEnabled: !muted,
        interrupt: true,
    });

    const navItems = useMemo(() => NAV_LINKS, []);

    return (
        <nav
            className={cn(
                "fixed inset-x-0 bottom-4 z-30 flex justify-center lg:bottom-auto lg:left-6 lg:top-1/2 lg:h-[80vh] lg:-translate-y-1/2",
                className
            )}
        >
            <div className="pointer-events-auto grid w-full max-w-3xl grid-cols-3 gap-3 px-4 lg:flex lg:h-full lg:w-auto lg:flex-col lg:gap-4 lg:px-0">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        aria-label={item.aria}
                        className={({ isActive }) =>
                            cn(
                                "relative flex items-center justify-center border-neon-primary bg-black px-3 py-4 text-sm font-brutal uppercase tracking-wide transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                                isActive && "border-neon-accent text-accent",
                                "hover:opacity-90"
                            )
                        }
                        onClick={() => playClick()}
                        end={item.to === "/app"}
                    >
                        {({ isActive }) => (
                            <>
                                <span>{item.label}</span>
                                {isActive && (
                                    <span className="absolute inset-x-4 -bottom-2 h-1 bg-primary lg:inset-y-4 lg:-right-2 lg:h-auto lg:w-1" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}

export default ArcadeNavbar;


