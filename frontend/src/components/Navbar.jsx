// src/components/Navbar.jsx
export default function Navbar({ onHome }) {
    return (
        <nav className="navbar">
            <div className="navbar-logo" onClick={onHome} role="button" tabIndex={0}>
                <span className="logo-icon">🗺️</span>
                <span>PathBuilder</span>
            </div>
            <div className="navbar-actions">
                <span className="text-muted">Learning Path Builder</span>
            </div>
        </nav>
    );
}
