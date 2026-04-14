import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function Navbar() {
    const { isAuthenticated } = useAuth(); 

    return (
        <nav className="navbar">
            
            {/* The Stealth Logo */}
            <h2 className="logo" style={{ margin: 0 }}>
                {/* Part 1: Goes to Home */}
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    blackbidz
                </Link>
                
                {/* Part 2: The Secret Period */}
                <Link 
                    to={isAuthenticated ? "/admin" : "/login"} 
                    title={isAuthenticated ? "Dashboard" : "Admin"}
                    style={{ 
                        textDecoration: 'none', 
                        color: 'inherit',
                        display: 'inline-block', // Needed so we can scale it on hover
                        transition: 'transform 0.2s ease, color 0.2s ease',
                    }}
                    onMouseOver={(e) => { 
                        e.currentTarget.style.transform = 'scale(1.3)'; // Grows slightly
                        e.currentTarget.style.color = '#5D4A3A'; // Touches your dark brown theme
                    }}
                    onMouseOut={(e) => { 
                        e.currentTarget.style.transform = 'scale(1)'; 
                        e.currentTarget.style.color = 'inherit';
                    }}
                >
                    .
                </Link>
                
                {/* Part 3: Goes to Home */}
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    com
                </Link>
            </h2>

            {/* Your Main Links (Clean and untouched) */}
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/blogs">Blogs</Link>
                <Link to="/projects">Projects</Link>
            </div>
        </nav>
    );
}

export default Navbar;