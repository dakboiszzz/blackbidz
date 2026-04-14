// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Reusing your theme colors for consistency
  const colors = {
    background: '#FAF8F5',
    text: '#5D4A3A',
    border: '#D8CFC4',
    button: '#E8DCCB',
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // FastAPI expects form data for login, not JSON
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      
      // Save the token to global memory
      login(data.access_token);
      
      // Redirect to the Admin Panel!
      navigate('/admin'); 

    } catch (err) {
      setError("Incorrect username or password. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.text }}>
      <form 
        onSubmit={handleLogin} 
        style={{ 
          backgroundColor: '#FFFFFF', 
          padding: '40px', 
          borderRadius: '8px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          width: '100%',
          maxWidth: '350px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <h2 style={{ margin: 0, textAlign: 'center', fontFamily: 'TAN-Mon-Cheri, serif' }}>Admin Access</h2>
        
        {error && <div style={{ color: '#d63031', backgroundColor: '#ffdadb', padding: '10px', borderRadius: '4px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ width: '100%', padding: '12px', border: `1px solid ${colors.border}`, borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '12px', border: `1px solid ${colors.border}`, borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            padding: '12px', 
            backgroundColor: colors.button, 
            color: colors.text, 
            border: 'none', 
            borderRadius: '4px', 
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}
        >
          {isLoading ? 'Verifying...' : 'Enter Secure Area'}
        </button>
      </form>
    </div>
  );
}