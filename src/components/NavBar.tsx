
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className = "navbar">
            <h2 className = "logo">blackbidz.com</h2>
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