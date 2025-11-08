import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { GlowFilter } from "@pixi/filter-glow";
import { featureFlags, getPerformanceLevel } from "@/utils/featureFlags";

// Feature flag check
const USE_PIXI = featureFlags.USE_PIXI_BACKGROUND;

interface CanvasBackgroundPIXIProps {
    className?: string;
}

export function CanvasBackgroundPIXI({ className }: CanvasBackgroundPIXIProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<PIXI.Application | null>(null);
    const spritesRef = useRef<PIXI.Sprite[]>([]);
    const particlesRef = useRef<PIXI.Graphics[]>([]);
    const animationFrameRef = useRef<number>();

    // Crypto icons data
    const cryptoIcons = [
        { symbol: "₿", color: 0xf7931a }, // BTC orange
        { symbol: "Ξ", color: 0x627eea }, // ETH blue
        { symbol: "◎", color: 0x9945ff }, // SOL purple
        { symbol: "₳", color: 0x0033ad }, // ADA blue
        { symbol: "DOGE", color: 0xc2a633 }, // DOGE yellow
    ];

    useEffect(() => {
        if (!USE_PIXI || !containerRef.current) return;

        const performanceLevel = getPerformanceLevel();
        const particleCount = performanceLevel === 'high' ? 15 : performanceLevel === 'medium' ? 10 : 5;

        // Initialize PIXI Application
        const app = new PIXI.Application();
        
        app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            background: '#050505',
            antialias: performanceLevel === 'high',
            resolution: performanceLevel === 'high' ? window.devicePixelRatio || 1 : 1,
            autoDensity: true,
            resizeTo: containerRef.current,
        }).then(() => {
            if (!containerRef.current) return;
            
            containerRef.current.appendChild(app.canvas);
            appRef.current = app;

            // Create glow filter
            const glowFilter = new GlowFilter({
                distance: 15,
                outerStrength: 2,
                innerStrength: 1,
                color: 0x00ffc3,
                quality: performanceLevel === 'high' ? 0.5 : 0.3,
            });

            // Create floating crypto icons
            const sprites: PIXI.Sprite[] = [];
            for (let i = 0; i < particleCount; i++) {
                const iconData = cryptoIcons[i % cryptoIcons.length];
                const sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
                
                // Create text sprite for icon
                const text = new PIXI.Text(iconData.symbol, {
                    fontFamily: 'Arial',
                    fontSize: 32,
                    fill: iconData.color,
                    fontWeight: 'bold',
                });
                
                sprite.addChild(text);
                sprite.filters = [glowFilter];
                sprite.anchor.set(0.5);
                sprite.x = Math.random() * app.screen.width;
                sprite.y = Math.random() * app.screen.height;
                sprite.alpha = 0.3;
                sprite.scale.set(0.5 + Math.random() * 0.5);
                
                // Animation properties
                (sprite as any).vx = (Math.random() - 0.5) * 0.5;
                (sprite as any).vy = (Math.random() - 0.5) * 0.5;
                (sprite as any).rotationSpeed = (Math.random() - 0.5) * 0.02;
                
                app.stage.addChild(sprite);
                sprites.push(sprite);
            }
            spritesRef.current = sprites;

            // Create grid lines
            const gridGraphics = new PIXI.Graphics();
            gridGraphics.setStrokeStyle({ width: 1, color: 0x00ffc3, alpha: 0.1 });
            const gridSize = 50;
            for (let x = 0; x < app.screen.width; x += gridSize) {
                gridGraphics.moveTo(x, 0);
                gridGraphics.lineTo(x, app.screen.height);
            }
            for (let y = 0; y < app.screen.height; y += gridSize) {
                gridGraphics.moveTo(0, y);
                gridGraphics.lineTo(app.screen.width, y);
            }
            app.stage.addChild(gridGraphics);

            // Create cursor-follow particles
            const particles: PIXI.Graphics[] = [];
            let mouseX = app.screen.width / 2;
            let mouseY = app.screen.height / 2;

            // Mouse tracking
            app.canvas.addEventListener('mousemove', (e) => {
                const rect = app.canvas.getBoundingClientRect();
                mouseX = e.clientX - rect.left;
                mouseY = e.clientY - rect.top;
            });

            // Animation loop
            let lastTime = performance.now();
            const animate = (currentTime: number) => {
                const deltaTime = (currentTime - lastTime) / 16.67; // Normalize to 60fps
                lastTime = currentTime;

                // Animate sprites
                spritesRef.current.forEach((sprite) => {
                    sprite.x += (sprite as any).vx * deltaTime;
                    sprite.y += (sprite as any).vy * deltaTime;
                    sprite.rotation += (sprite as any).rotationSpeed * deltaTime;

                    // Wrap around edges
                    if (sprite.x < 0) sprite.x = app.screen.width;
                    if (sprite.x > app.screen.width) sprite.x = 0;
                    if (sprite.y < 0) sprite.y = app.screen.height;
                    if (sprite.y > app.screen.height) sprite.y = 0;
                });

                // Create cursor trail particles
                if (performanceLevel !== 'low' && Math.random() > 0.7) {
                    const particle = new PIXI.Graphics();
                    particle.circle(0, 0, 2);
                    particle.fill({ color: 0x00ffc3 });
                    particle.x = mouseX;
                    particle.y = mouseY;
                    particle.alpha = 0.8;
                    (particle as any).life = 30;
                    (particle as any).vx = (Math.random() - 0.5) * 2;
                    (particle as any).vy = (Math.random() - 0.5) * 2;
                    
                    app.stage.addChild(particle);
                    particles.push(particle);
                    particlesRef.current = particles;
                }

                // Update and remove old particles
                particlesRef.current.forEach((particle, index) => {
                    (particle as any).life--;
                    particle.alpha = (particle as any).life / 30;
                    particle.x += (particle as any).vx;
                    particle.y += (particle as any).vy;
                    
                    if ((particle as any).life <= 0) {
                        app.stage.removeChild(particle);
                        particlesRef.current.splice(index, 1);
                        particle.destroy();
                    }
                });

                animationFrameRef.current = requestAnimationFrame(animate);
            };

            animationFrameRef.current = requestAnimationFrame(animate);
        });

        // Handle resize
        const handleResize = () => {
            if (appRef.current && containerRef.current) {
                appRef.current.renderer.resize(
                    containerRef.current.clientWidth,
                    containerRef.current.clientHeight
                );
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (appRef.current) {
                appRef.current.destroy(true, { children: true, texture: true });
                appRef.current = null;
            }
        };
    }, []);

    // Fallback to original canvas if PIXI is disabled
    if (!USE_PIXI) {
        return null; // Will fall back to original CanvasBackground
    }

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 z-0 pointer-events-none ${className || ''}`}
            style={{ width: '100vw', height: '100vh' }}
        />
    );
}

