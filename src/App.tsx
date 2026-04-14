import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Hero from './pages/Hero';
import Footer from './components/Footer';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import './App.css'
import Loader from './components/Loader';
import { useState, useEffect } from 'react';
import MusicEvaluations from './pages/MusicEvaluations';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
// 1. IMPORT YOUR NEW FILES HERE
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [isServerReady, setIsServerReady] = useState(false);
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${API_URL}/api/health`);
        if (res.ok) {
          setIsServerReady(true);
        } else {
          throw new Error();
        }
      } catch (err) {
        setMessage("Server is sleeping. Waking it up...");
        setTimeout(checkServer, 4000);
      }
    };

    checkServer();
  }, []);

  if (!isServerReady) {
    return <Loader message={message} />;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="portfolio-container">
          <Navbar />
          
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/" element={<Hero />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogPost />} />
            <Route path="/projects" element={<MusicEvaluations />} />
            
            {/* 2. ADD THE LOGIN ROUTE HERE */}
            <Route path="/login" element={<Login />} />
            
            {/* --- PROTECTED ADMIN ROUTES --- */}
            {/* 3. WRAP YOUR SECRET ROUTES IN THE PROTECTED ROUTE COMPONENT */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>

          <Footer />
        </div>
      </Router> 
    </AuthProvider>
  );
}

export default App;