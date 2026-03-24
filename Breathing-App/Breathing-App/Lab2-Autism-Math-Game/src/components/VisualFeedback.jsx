import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

function VisualFeedback({ type, message }) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        setIsVisible(true)
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [type, message])

    if (!isVisible) return null

    const getEmoji = () => {
        switch (type) {
            case 'correct':
                return '🎉'
            case 'wrong':
                return '🤔'
            case 'complete':
                return '🏆'
            default:
                return '✨'
        }
    }

    const getClassName = () => {
        return `feedback-${type} visual-feedback ${isVisible ? 'fade-in' : 'fade-out'}`
    }

    return (
        <div className={getClassName()}>
            <span className="feedback-emoji">{getEmoji()}</span>
            <span className="feedback-message">{message}</span>
        </div>
    )
}

VisualFeedback.propTypes = {
    type: PropTypes.oneOf(['correct', 'wrong', 'complete']).isRequired,
    message: PropTypes.string.isRequired
}

export default VisualFeedback
