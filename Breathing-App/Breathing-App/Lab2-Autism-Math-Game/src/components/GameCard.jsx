import PropTypes from 'prop-types'

function GameCard({ icon, title, description, color }) {
    return (
        <div className="game-card" style={{ borderColor: color }}>
            <div className="game-icon" style={{ backgroundColor: color }}>
                {icon}
            </div>
            <h3 className="game-title">{title}</h3>
            <p className="game-description">{description}</p>
            <div className="game-button" style={{ backgroundColor: color }}>
                Play Now →
            </div>
        </div>
    )
}

GameCard.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
}

export default GameCard
