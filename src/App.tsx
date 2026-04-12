import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Blogs from './components/Blogs';
import BlogPost from './components/BlogPost';
import AdminPanel from './components/AdminPanel';
import './App.css'
import Loader from './components/Loader';
import { useState, useEffect } from 'react';
import MusicEvaluations from './components/MusicEvaluations';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [isServerReady, setIsServerReady] = useState(false);
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    const checkServer = async () => {
      try {
        // Ping your health endpoint
        const res = await fetch(`${API_URL}/api/health`);
        if (res.ok) {
          setIsServerReady(true);
        } else {
          throw new Error();
        }
      } catch (err) {
        setMessage("Server is sleeping. Waking it up...");
        // Re-check every 4 seconds until it responds
        setTimeout(checkServer, 4000);
      }
    };

    checkServer();
  }, []);

  if (!isServerReady) {
    return <Loader message={message} />;
  }
  return (
    <Router>
      <div className="portfolio-container">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/blogs" element={<Blogs />} />
          
          <Route path="/blogs/:slug" element={<BlogPost />} />
          <Route path="/secret-admin-panel" element={<AdminPanel />} />
          <Route path="/projects" element={<MusicEvaluations />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
