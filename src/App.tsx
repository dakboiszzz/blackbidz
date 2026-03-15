import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Blogs from './components/Blogs';
import './App.css'

function App() {
  return (
    <Router>
      <div className="portfolio-container">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
