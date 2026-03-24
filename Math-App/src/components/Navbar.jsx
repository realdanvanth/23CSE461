import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/', icon: '🏠', label: 'Home' },
    { to: '/builder', icon: '🧩', label: 'Build' },
    { to: '/explorer', icon: '🌐', label: 'Explore' },
    { to: '/quiz', icon: '❓', label: 'Quiz' },
    { to: '/rewards', icon: '🏆', label: 'Rewards' },
    { to: '/research', icon: '📚', label: 'Research' },
];

export default function Navbar() {
    return (
        <nav className="navbar">
            {navItems.map(({ to, icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                >
                    <span className="nav-icon">{icon}</span>
                    <span className="nav-label">{label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
