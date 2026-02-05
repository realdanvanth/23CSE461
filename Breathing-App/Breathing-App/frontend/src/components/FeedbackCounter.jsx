import React, { Component } from 'react';

/**
 * FeedbackCounter - A CLASS COMPONENT demonstrating:
 * - Class-based component syntax
 * - State management in class components
 * - Event handling
 * - Lifecycle methods (componentDidMount, componentDidUpdate)
 */
class FeedbackCounter extends Component {
    constructor(props) {
        super(props);
        // STATE in class component
        this.state = {
            moodScore: 3,
            feedback: '',
            submitted: false,
            sessionCount: 0
        };

        // EVENT HANDLER binding
        this.handleMoodChange = this.handleMoodChange.bind(this);
        this.handleFeedbackChange = this.handleFeedbackChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    // LIFECYCLE METHOD - componentDidMount
    componentDidMount() {
        console.log('FeedbackCounter mounted - Lifecycle: componentDidMount');
        // Load saved session count from localStorage
        const savedCount = localStorage.getItem('feedbackSessionCount');
        if (savedCount) {
            this.setState({ sessionCount: parseInt(savedCount, 10) });
        }
    }

    // LIFECYCLE METHOD - componentDidUpdate
    componentDidUpdate(prevProps, prevState) {
        if (prevState.sessionCount !== this.state.sessionCount) {
            console.log('Session count updated - Lifecycle: componentDidUpdate');
            localStorage.setItem('feedbackSessionCount', this.state.sessionCount.toString());
        }
    }

    // EVENT HANDLER - Mood slider change
    handleMoodChange(event) {
        this.setState({ moodScore: parseInt(event.target.value, 10) });
    }

    // EVENT HANDLER - Feedback text change
    handleFeedbackChange(event) {
        this.setState({ feedback: event.target.value });
    }

    // EVENT HANDLER - Form submit
    handleSubmit(event) {
        event.preventDefault();
        this.setState(prevState => ({
            submitted: true,
            sessionCount: prevState.sessionCount + 1
        }));
    }

    // EVENT HANDLER - Reset form
    handleReset() {
        this.setState({
            moodScore: 3,
            feedback: '',
            submitted: false
        });
    }

    getMoodEmoji(score) {
        const emojis = ['😢', '😔', '😐', '🙂', '😊'];
        return emojis[score - 1] || '😐';
    }

    getMoodLabel(score) {
        const labels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
        return labels[score - 1] || 'Neutral';
    }

    render() {
        const { moodScore, feedback, submitted, sessionCount } = this.state;

        return (
            <div className="feedback-counter">
                <div className="feedback-header">
                    <h3>Session Feedback</h3>
                    <span className="session-badge">Sessions: {sessionCount}</span>
                </div>

                {submitted ? (
                    <div className="feedback-success">
                        <div className="success-icon">✓</div>
                        <h4>Thank you for your feedback!</h4>
                        <p>Your mood: {this.getMoodEmoji(moodScore)} {this.getMoodLabel(moodScore)}</p>
                        {feedback && <p className="feedback-text">"{feedback}"</p>}
                        <button className="btn btn-primary" onClick={this.handleReset}>
                            Submit Another
                        </button>
                    </div>
                ) : (
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label>How do you feel after this session?</label>
                            <div className="mood-slider-container">
                                <span className="mood-emoji">{this.getMoodEmoji(moodScore)}</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={moodScore}
                                    onChange={this.handleMoodChange}
                                    className="mood-slider"
                                />
                                <span className="mood-label">{this.getMoodLabel(moodScore)}</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="feedback">Additional feedback (optional)</label>
                            <textarea
                                id="feedback"
                                value={feedback}
                                onChange={this.handleFeedbackChange}
                                placeholder="Share your thoughts about the session..."
                                rows="3"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Submit Feedback
                        </button>
                    </form>
                )}
            </div>
        );
    }
}

export default FeedbackCounter;
