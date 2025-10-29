import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    LuPlay as Play,
    LuTrendingUp as TrendingUp,
    LuTrophy as Trophy,
    LuUsers as Users,
    LuBriefcase as Briefcase,
    LuArrowRight as ArrowRight,
    LuStar as Star,
    LuZap as Zap,
    LuTarget as Target,
    LuShield as Shield,
} from "react-icons/lu";
import roxyLogo from "@/assets/roxy-logo.png";
import roxyMain from "@/assets/roxy.png";
import roxy33 from "@/assets/roxy-33.png";
import roxy44 from "@/assets/roxy-44.png";
import wealth from "@/assets/wealth.png";

export function Landing() {
    const features = [
        {
            icon: TrendingUp,
            title: "REAL-TIME TRADING",
            description:
                "Trade crypto assets with live market data and instant execution",
        },
        {
            icon: Trophy,
            title: "COMPETITIVE LEADERBOARDS",
            description:
                "Compete with traders worldwide and climb the rankings",
        },
        {
            icon: Users,
            title: "GUILD SYSTEM",
            description:
                "Join forces with other traders and build powerful alliances",
        },
        {
            icon: Briefcase,
            title: "PORTFOLIO MANAGEMENT",
            description:
                "Track your investments and optimize your trading strategy",
        },
    ];

    const stats = [
        { number: "10K+", label: "ACTIVE TRADERS" },
        { number: "$2.5M", label: "TOTAL VOLUME" },
        { number: "500+", label: "CRYPTO ASSETS" },
        { number: "50+", label: "GUILDS" },
    ];

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute top-20 left-10 w-32 h-32 border-2 border-primary opacity-20"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                    <motion.div
                        className="absolute top-40 right-20 w-24 h-24 border-2 border-accent opacity-30"
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                    <motion.div
                        className="absolute bottom-40 left-20 w-16 h-16 border-2 border-primary opacity-25"
                        animate={{ rotate: 180 }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
                        <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                            <img
                                src={roxyLogo}
                                alt="Roxy Logo"
                                className="w-20 h-20 object-contain"
                            />
                            <div>
                                <h1 className="text-7xl font-brutal text-primary leading-none">
                                    ROXY
                                </h1>
                                <div className="w-full h-1 bg-accent mt-2"></div>
                            </div>
                        </div>

                        <h2 className="text-5xl font-brutal text-white mb-6 leading-tight">
                            CRYPTO PORTFOLIO
                            <br />
                            <span className="text-accent">MANAGER</span>
                        </h2>

                        <div className="space-y-4 mb-8 ">
                            <p className="text-2xl font-mono-brutal text-text-body leading-relaxed">
                                The ultimate crypto trading game where strategy
                                meets opportunity.
                            </p>
                            <p className="text-xl font-mono-brutal text-text-body leading-relaxed">
                                Build your empire, compete with the best, and
                                dominate the markets.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                to="/app"
                                className="btn-brutal text-lg px-8 py-4 flex items-center justify-center gap-2 group"
                            >
                                START TRADING
                                <ArrowRight
                                    className="group-hover:translate-x-1 transition-transform"
                                    size={20}
                                />
                            </Link>

                            <button className="border-2 border-primary text-primary hover:bg-primary hover:text-black font-brutal px-8 py-4 transition-none flex items-center justify-center gap-2">
                                <Play size={20} />
                                WATCH TRAILER
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Content - Wealth Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative">
                            <motion.img
                                src={wealth}
                                alt="Wealth - Build Your Empire"
                                className="w-full mx-auto"
                                animate={{ y: [-10, 10, -10] }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            {/* Floating Elements */}
                            <motion.div
                                className="absolute top-10 -left-10 w-20 h-20 bg-primary border-2 border-primary flex items-center justify-center"
                                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <TrendingUp className="text-black" size={32} />
                            </motion.div>

                            <motion.div
                                className="absolute top-32 -right-10 w-16 h-16 bg-accent border-2 border-accent flex items-center justify-center"
                                animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Trophy className="text-black" size={24} />
                            </motion.div>

                            <motion.div
                                className="absolute bottom-20 -left-5 w-12 h-12 bg-primary border-2 border-primary flex items-center justify-center"
                                animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Star className="text-black" size={20} />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-card">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-brutal text-primary mb-4">
                            WHY CHOOSE ROXY?
                        </h2>
                        <p className="text-xl font-mono-brutal text-text-body mx-auto">
                            Experience the future of crypto trading with our
                            revolutionary platform
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                className="bg-black border-2 border-primary p-6 text-center hover:border-accent transition-none group"
                            >
                                <div className="w-16 h-16 bg-primary border-2 border-primary flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:border-accent transition-none">
                                    <feature.icon
                                        className="text-black"
                                        size={32}
                                    />
                                </div>
                                <h3 className="text-xl font-brutal text-primary mb-3">
                                    {feature.title}
                                </h3>
                                <p className="font-mono-brutal text-text-body">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-brutal text-primary mb-4">
                            JOIN THE REVOLUTION
                        </h2>
                        <p className="text-xl font-mono-brutal text-text-body">
                            Be part of the most active crypto trading community
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                className="text-center"
                            >
                                <div className="text-4xl font-brutal text-primary mb-2">
                                    {stat.number}
                                </div>
                                <div className="font-mono-brutal text-text-body">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Character Showcase */}
            <section className="py-20 bg-card">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-brutal text-primary mb-4">
                            MEET THE CHARACTERS
                        </h2>
                        <p className="text-xl font-mono-brutal text-text-body">
                            Discover the personalities that make Roxy unique
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <div className="relative mb-6">
                                <img
                                    src={roxy33}
                                    alt="Roxy Character 33"
                                    className="w-48 h-48 mx-auto object-contain border-2 border-primary"
                                />
                                <motion.div
                                    className="absolute -top-4 -right-4 w-12 h-12 bg-accent border-2 border-accent flex items-center justify-center"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                >
                                    <Zap className="text-black" size={24} />
                                </motion.div>
                            </div>
                            <h3 className="text-2xl font-brutal text-primary mb-2">
                                ROXY 33
                            </h3>
                            <p className="font-mono-brutal text-text-body">
                                The strategic mastermind with lightning-fast
                                reflexes
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-center"
                        >
                            <div className="relative mb-6">
                                <img
                                    src={roxy44}
                                    alt="Roxy Character 44"
                                    className="w-48 h-48 mx-auto object-contain border-2 border-accent"
                                />
                                <motion.div
                                    className="absolute -top-4 -right-4 w-12 h-12 bg-primary border-2 border-primary flex items-center justify-center"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                    }}
                                >
                                    <Target className="text-black" size={24} />
                                </motion.div>
                            </div>
                            <h3 className="text-2xl font-brutal text-accent mb-2">
                                ROXY 44
                            </h3>
                            <p className="font-mono-brutal text-text-body">
                                The precision trader with unmatched accuracy
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-center"
                        >
                            <div className="relative mb-6">
                                <img
                                    src={roxyMain}
                                    alt="Roxy Character"
                                    className="w-48 h-48 mx-auto object-contain border-2 border-primary"
                                />
                                <motion.div
                                    className="absolute -top-4 -right-4 w-12 h-12 bg-accent border-2 border-accent flex items-center justify-center"
                                    animate={{ rotate: [0, 360] }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                >
                                    <Shield className="text-black" size={24} />
                                </motion.div>
                            </div>
                            <h3 className="text-2xl font-brutal text-primary mb-2">
                                ROXY
                            </h3>
                            <p className="font-mono-brutal text-text-body">
                                The legendary trader with unmatched charisma and
                                skill
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-6xl font-brutal text-primary mb-6">
                            READY TO DOMINATE?
                        </h2>
                        <p className="text-2xl font-mono-brutal text-text-body mb-8">
                            Join thousands of traders already building their
                            crypto empires
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                to="/app"
                                className="btn-brutal text-xl px-12 py-6 flex items-center justify-center gap-3 group"
                            >
                                START YOUR JOURNEY
                                <ArrowRight
                                    className="group-hover:translate-x-2 transition-transform"
                                    size={24}
                                />
                            </Link>

                            <Link
                                to="/app/leaderboard"
                                className="border-2 border-accent text-accent hover:bg-accent hover:text-black font-brutal text-xl px-12 py-6 transition-none flex items-center justify-center gap-3"
                            >
                                <Trophy size={24} />
                                VIEW LEADERBOARD
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-card border-t-2 border-primary">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <img
                            src={roxyLogo}
                            alt="Roxy Logo"
                            className="w-12 h-12 object-contain"
                        />
                        <h3 className="text-2xl font-brutal text-primary">
                            ROXY
                        </h3>
                    </div>
                    <p className="font-mono-brutal text-text-body mb-4">
                        The ultimate crypto portfolio management experience
                    </p>
                    <div className="flex justify-center gap-8">
                        <Link
                            to="/app"
                            className="font-brutal text-primary hover:text-accent transition-none"
                        >
                            DASHBOARD
                        </Link>
                        <Link
                            to="/app/markets"
                            className="font-brutal text-primary hover:text-accent transition-none"
                        >
                            MARKETS
                        </Link>
                        <Link
                            to="/app/portfolio"
                            className="font-brutal text-primary hover:text-accent transition-none"
                        >
                            PORTFOLIO
                        </Link>
                        <Link
                            to="/app/leaderboard"
                            className="font-brutal text-primary hover:text-accent transition-none"
                        >
                            LEADERBOARD
                        </Link>
                        <Link
                            to="/app/guilds"
                            className="font-brutal text-primary hover:text-accent transition-none"
                        >
                            GUILDS
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
