import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { GlowFilter } from "@pixi/filter-glow";

interface CanvasBackgroundPIXIProps {
    className?: string;
}

/**
 * Minimal PIXI background scaffold.
 * Renders a static grid with gentle glow, ready for further upgrades.
 */
export function CanvasBackgroundPIXI({ className }: CanvasBackgroundPIXIProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<PIXI.Application | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const app = new PIXI.Application();
        let destroyed = false;
        
        app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundAlpha: 0,
            antialias: true,
            autoDensity: true,
        }).then(() => {
            if (destroyed || !container) return;
            
            container.appendChild(app.canvas);
            appRef.current = app;

            const glowFilter = new GlowFilter({
                distance: 12,
                outerStrength: 2,
                innerStrength: 0,
                color: 0x00ffc3,
                quality: 0.3,
            });

            const backdrop = new PIXI.Graphics();
            backdrop.beginFill(0x050505, 1);
            backdrop.drawRect(0, 0, app.screen.width, app.screen.height);
            backdrop.endFill();
            app.stage.addChild(backdrop);

            const grid = new PIXI.Graphics();
            const step = 80;
            grid.lineStyle(1, 0x11212b, 0.6);
            for (let x = 0; x < app.screen.width; x += step) {
                grid.moveTo(x, 0);
                grid.lineTo(x, app.screen.height);
            }
            for (let y = 0; y < app.screen.height; y += step) {
                grid.moveTo(0, y);
                grid.lineTo(app.screen.width, y);
            }
            grid.filters = [glowFilter as unknown as PIXI.Filter];
            app.stage.addChild(grid);
        });

        const handleResize = () => {
            const appInstance = appRef.current;
            if (!appInstance) return;
            appInstance.renderer.resize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            destroyed = true;
            window.removeEventListener("resize", handleResize);
            appRef.current?.destroy(true);
                appRef.current = null;
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
}

export default CanvasBackgroundPIXI;
