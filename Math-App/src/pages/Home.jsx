import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import './Home.css';

const activities = [
    {
        to: '/builder',
        icon: '🧩',
        title: 'Shape Builder',
        desc: 'Drag & drop shapes to create amazing pictures!',
        color: 'teal',
        gradient: 'linear-gradient(135deg, #4ECDC4, #2BA8A0)',
        delay: 0.1,
    },
    {
        to: '/explorer',
        icon: '🌐',
        title: '3D Explorer',
        desc: 'Spin and explore 3D shapes up close!',
        color: 'lavender',
        gradient: 'linear-gradient(135deg, #A8B5E0, #7B8FD4)',
        delay: 0.2,
    },
    {
        to: '/quiz',
        icon: '❓',
        title: 'Shape Quiz',
        desc: 'Test what you know and earn stars!',
        color: 'yellow',
        gradient: 'linear-gradient(135deg, #FFE66D, #F5C842)',
        delay: 0.3,
    },
    {
        to: '/research',
        icon: '📚',
        title: 'Research',
        desc: 'Discover evidence-based strategies for spatial geometry!',
        color: 'teal',
        gradient: 'linear-gradient(135deg, #C3A6FF, #9B82E0)',
        delay: 0.4,
    },
];

const mascotVariants = {
    animate: {
        y: [0, -14, 0],
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
};

export default function Home() {
    const { stars } = useProgress();

    return (
        <div className="home-page">
            {/* Decorative blobs */}
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />

            {/* Header */}
            <header className="home-header">
                <motion.div
                    className="star-counter"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
                >
                    ⭐ {stars}
                </motion.div>
            </header>

            {/* Hero */}
            <div className="home-hero">
                <motion.div
                    className="mascot"
                    variants={mascotVariants}
                    animate="animate"
                >
                    <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Body */}
                        <circle cx="70" cy="75" r="50" fill="#4ECDC4" />
                        {/* Face */}
                        <circle cx="70" cy="68" r="36" fill="#A8EDEA" />
                        {/* Eyes */}
                        <circle cx="57" cy="62" r="8" fill="white" />
                        <circle cx="83" cy="62" r="8" fill="white" />
                        <circle cx="59" cy="64" r="4" fill="#2D3561" />
                        <circle cx="85" cy="64" r="4" fill="#2D3561" />
                        {/* Eye shine */}
                        <circle cx="61" cy="62" r="1.5" fill="white" />
                        <circle cx="87" cy="62" r="1.5" fill="white" />
                        {/* Smile */}
                        <path d="M55 76 Q70 90 85 76" stroke="#2D3561" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                        {/* Antenna */}
                        <line x1="70" y1="32" x2="70" y2="18" stroke="#FFE66D" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="70" cy="14" r="7" fill="#FFE66D" />
                        {/* Ears */}
                        <circle cx="20" cy="75" r="12" fill="#4ECDC4" />
                        <circle cx="120" cy="75" r="12" fill="#4ECDC4" />
                        <circle cx="20" cy="75" r="7" fill="#A8EDEA" />
                        <circle cx="120" cy="75" r="7" fill="#A8EDEA" />
                        {/* Stars around */}
                        <text x="10" y="30" fontSize="18" fill="#FFE66D">⭐</text>
                        <text x="110" y="25" fontSize="14" fill="#C3A6FF">✦</text>
                        <text x="5" y="110" fontSize="12" fill="#FF6B6B">♦</text>
                        <text x="118" y="115" fontSize="16" fill="#4ECDC4">◆</text>
                    </svg>
                </motion.div>

                <motion.h1
                    className="home-title title-xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Hello, Explorer! 👋
                </motion.h1>
                <motion.p
                    className="home-subtitle body-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    Let's learn about shapes together!
                </motion.p>
            </div>

            {/* Activity Cards */}
            <div className="activity-grid">
                {activities.map(({ to, icon, title, desc, gradient, delay }) => (
                    <motion.div
                        key={to}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Link to={to} className="activity-card" style={{ '--card-gradient': gradient }}>
                            <div className="activity-icon-wrap">
                                <span className="activity-icon">{icon}</span>
                            </div>
                            <div className="activity-info">
                                <h2 className="title-sm">{title}</h2>
                                <p className="body-sm" style={{ color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>{desc}</p>
                            </div>
                            <span className="activity-arrow">→</span>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Fun fact */}
            <motion.div
                className="fun-fact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
            >
                <span className="fun-fact-icon">💡</span>
                <p className="body-sm">Did you know? A cube has <strong>6 faces</strong>, <strong>12 edges</strong>, and <strong>8 corners</strong>!</p>
            </motion.div>
        </div>
    );
}
