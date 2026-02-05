import React, { useState, useEffect } from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * Settings - A FUNCTION COMPONENT with FORMS demonstrating:
 * - Controlled form inputs
 * - Form validation
 * - useState for form state management
 * - useEffect for side effects
 * - Event handling (onChange, onSubmit)
 */
function Settings() {
    const {
        user,
        theme,
        toggleTheme,
        breathingSpeed,
        setBreathingSpeed,
        breathingPattern,
        setBreathingPattern
    } = useSensory();

    // FORM STATE using useState hook
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        dailyGoal: 10,
        notifications: true,
        soundEnabled: true
    });

    // VALIDATION STATE
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // useEffect - Load saved settings
    useEffect(() => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setFormData(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error('Failed to load settings:', e);
            }
        }
        if (user) {
            setFormData(prev => ({
                ...prev,
                displayName: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    // VALIDATION FUNCTION
    const validate = (data) => {
        const newErrors = {};

        if (!data.displayName.trim()) {
            newErrors.displayName = 'Display name is required';
        } else if (data.displayName.length < 2) {
            newErrors.displayName = 'Name must be at least 2 characters';
        }

        if (!data.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (data.dailyGoal < 1 || data.dailyGoal > 120) {
            newErrors.dailyGoal = 'Goal must be between 1 and 120 minutes';
        }

        return newErrors;
    };

    // EVENT HANDLER - Input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(newValue, 10) || 0 : newValue
        }));

        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // EVENT HANDLER - Input blur (for validation)
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        const validationErrors = validate(formData);
        if (validationErrors[name]) {
            setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
        }
    };

    // EVENT HANDLER - Form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitSuccess(false);

        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setTouched({
                displayName: true,
                email: true,
                dailyGoal: true
            });
            setIsSubmitting(false);
            return;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Save to localStorage
        localStorage.setItem('userSettings', JSON.stringify(formData));

        setIsSubmitting(false);
        setSubmitSuccess(true);

        // Clear success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
    };

    return (
        <div className="settings-page">
            <div className="settings-container">
                <h2>Settings</h2>

                {submitSuccess && (
                    <div className="alert alert-success">
                        ✓ Settings saved successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="settings-form">
                    {/* Profile Section */}
                    <section className="settings-section">
                        <h3>Profile</h3>

                        <div className="form-group">
                            <label htmlFor="displayName">Display Name *</label>
                            <input
                                type="text"
                                id="displayName"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.displayName && touched.displayName ? 'error' : ''}
                                placeholder="Enter your name"
                            />
                            {errors.displayName && touched.displayName && (
                                <span className="error-message">{errors.displayName}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.email && touched.email ? 'error' : ''}
                                placeholder="Enter your email"
                            />
                            {errors.email && touched.email && (
                                <span className="error-message">{errors.email}</span>
                            )}
                        </div>
                    </section>

                    {/* Preferences Section */}
                    <section className="settings-section">
                        <h3>Preferences</h3>

                        <div className="form-group">
                            <label htmlFor="dailyGoal">Daily Mindfulness Goal (minutes)</label>
                            <input
                                type="number"
                                id="dailyGoal"
                                name="dailyGoal"
                                value={formData.dailyGoal}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min="1"
                                max="120"
                                className={errors.dailyGoal && touched.dailyGoal ? 'error' : ''}
                            />
                            {errors.dailyGoal && touched.dailyGoal && (
                                <span className="error-message">{errors.dailyGoal}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="breathingSpeed">Breathing Speed</label>
                            <select
                                id="breathingSpeed"
                                name="breathingSpeed"
                                value={breathingSpeed}
                                onChange={(e) => setBreathingSpeed(e.target.value)}
                            >
                                <option value="slow">Slow (Relaxed)</option>
                                <option value="medium">Medium (Balanced)</option>
                                <option value="fast">Fast (Energizing)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="breathingPattern">Default Breathing Pattern</label>
                            <select
                                id="breathingPattern"
                                name="breathingPattern"
                                value={breathingPattern}
                                onChange={(e) => setBreathingPattern(e.target.value)}
                            >
                                <option value="relaxed">Relaxed (4-4-4-4)</option>
                                <option value="calm">Calm (4-7-8)</option>
                                <option value="energize">Energize (4-4-4)</option>
                                <option value="focus">Focus (5-5-5-5)</option>
                            </select>
                        </div>
                    </section>

                    {/* Notifications Section */}
                    <section className="settings-section">
                        <h3>Notifications</h3>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="notifications"
                                    checked={formData.notifications}
                                    onChange={handleChange}
                                />
                                <span className="checkmark"></span>
                                Enable daily reminders
                            </label>
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="soundEnabled"
                                    checked={formData.soundEnabled}
                                    onChange={handleChange}
                                />
                                <span className="checkmark"></span>
                                Enable ambient sounds
                            </label>
                        </div>
                    </section>

                    {/* Theme Section */}
                    <section className="settings-section">
                        <h3>Appearance</h3>
                        <div className="form-group">
                            <label>Theme</label>
                            <div className="theme-toggle">
                                <button
                                    type="button"
                                    className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                                    onClick={() => theme !== 'light' && toggleTheme()}
                                >
                                    ☀️ Light
                                </button>
                                <button
                                    type="button"
                                    className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                                    onClick={() => theme !== 'dark' && toggleTheme()}
                                >
                                    🌙 Dark
                                </button>
                            </div>
                        </div>
                    </section>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Settings;
