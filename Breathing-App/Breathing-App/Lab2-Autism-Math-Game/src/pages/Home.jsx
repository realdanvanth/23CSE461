import { Link } from 'react-router-dom'
import GameCard from '../components/GameCard'

function Home() {
    return (
        <div className="home-page">
            <div className="hero-section">
                <h1 className="title">Welcome to Math Learning Fun! 🎉</h1>
                <p className="subtitle">Learn math through fun games and colorful activities!</p>
            </div>

            <div className="games-grid">
                <Link to="/number-game" style={{ textDecoration: 'none' }}>
                    <GameCard
                        icon="🔢"
                        title="Number Recognition"
                        description="Learn and identify numbers with fun visuals!"
                        color="#FF6B6B"
                    />
                </Link>

                <Link to="/addition-game" style={{ textDecoration: 'none' }}>
                    <GameCard
                        icon="➕"
                        title="Addition Game"
                        description="Add numbers together with colorful objects!"
                        color="#4ECDC4"
                    />
                </Link>

                <Link to="/pattern-game" style={{ textDecoration: 'none' }}>
                    <GameCard
                        icon="🎨"
                        title="Pattern Matching"
                        description="Find and match patterns to improve memory!"
                        color="#FFE66D"
                    />
                </Link>

                <Link to="/progress" style={{ textDecoration: 'none' }}>
                    <GameCard
                        icon="📊"
                        title="My Progress"
                        description="See your amazing achievements and scores!"
                        color="#95E1D3"
                    />
                </Link>
            </div>

            <div className="info-section">
                <h2>Why This App is Special 🌟</h2>
                <div className="features">
                    <div className="feature-card">
                        <div className="feature-icon">🧠</div>
                        <h3>Memory Improvement</h3>
                        <p>Games designed to strengthen memory through repetition and pattern recognition</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Contextual Learning</h3>
                        <p>Math concepts taught with real-world objects and visual representations</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Instant Feedback</h3>
                        <p>Immediate visual and audio feedback to reinforce learning</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
