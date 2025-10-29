import { useEffect, useRef } from "react";

interface Coin {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    symbol: string;
}

interface Sparkle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
}

export function CanvasBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const coinsRef = useRef<Coin[]>([]);
    const sparklesRef = useRef<Sparkle[]>([]);
    const lastTimeRef = useRef<number>(0);

    const symbols = ["BTC", "ETH", "DOGE", "ADA", "SOL"];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createCoin = (): Coin => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 20 + 10,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            opacity: Math.random() * 0.3 + 0.1,
            symbol: symbols[Math.floor(Math.random() * symbols.length)],
        });

        const createSparkle = (x: number, y: number): Sparkle => ({
            x,
            y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 60,
            maxLife: 60,
            size: Math.random() * 3 + 1,
        });

        // Initialize coins
        coinsRef.current = Array.from({ length: 15 }, () => createCoin());

        const animate = (currentTime: number) => {
            lastTimeRef.current = currentTime;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw coins
            coinsRef.current.forEach((coin) => {
                // Update position
                coin.x += coin.vx;
                coin.y += coin.vy;
                coin.rotation += coin.rotationSpeed;

                // Bounce off edges
                if (coin.x < 0 || coin.x > canvas.width) coin.vx *= -1;
                if (coin.y < 0 || coin.y > canvas.height) coin.vy *= -1;

                // Keep within bounds
                coin.x = Math.max(0, Math.min(canvas.width, coin.x));
                coin.y = Math.max(0, Math.min(canvas.height, coin.y));

                // Draw coin
                ctx.save();
                ctx.globalAlpha = coin.opacity;
                ctx.translate(coin.x, coin.y);
                ctx.rotate(coin.rotation);

                // Draw coin background
                ctx.fillStyle = "#FFD700";
                ctx.beginPath();
                ctx.arc(0, 0, coin.size / 2, 0, Math.PI * 2);
                ctx.fill();

                // Draw symbol
                ctx.fillStyle = "#000";
                ctx.font = `${coin.size * 0.6}px Arial`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(coin.symbol, 0, 0);

                ctx.restore();
            });

            // Update and draw sparkles
            sparklesRef.current = sparklesRef.current.filter((sparkle) => {
                sparkle.x += sparkle.vx;
                sparkle.y += sparkle.vy;
                sparkle.life--;

                if (sparkle.life > 0) {
                    const alpha = sparkle.life / sparkle.maxLife;
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = "#16A349";
                    ctx.beginPath();
                    ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                    return true;
                }
                return false;
            });

            // Occasionally add sparkles
            if (Math.random() < 0.02) {
                const sparkle = createSparkle(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height
                );
                sparklesRef.current.push(sparkle);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
        />
    );
}
