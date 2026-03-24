import { Component } from 'react'
import PropTypes from 'prop-types'

class ProgressTracker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isExpanded: false
        }
    }

    toggleExpand = () => {
        this.setState(prevState => ({
            isExpanded: !prevState.isExpanded
        }))
    }

    render() {
        const { totalGames, totalScore, accuracy } = this.props
        const { isExpanded } = this.state

        return (
            <div className="progress-tracker">
                <div className="tracker-header" onClick={this.toggleExpand}>
                    <h4>📈 Your Progress</h4>
                    <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                </div>

                {isExpanded && (
                    <div className="tracker-details">
                        <div className="detail-item">
                            <span className="label">Games:</span>
                            <span className="value">{totalGames}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Score:</span>
                            <span className="value">{totalScore}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Accuracy:</span>
                            <span className="value">{accuracy}%</span>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

ProgressTracker.propTypes = {
    totalGames: PropTypes.number.isRequired,
    totalScore: PropTypes.number.isRequired,
    accuracy: PropTypes.number.isRequired
}

export default ProgressTracker
