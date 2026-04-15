import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
// Import your existing admin components
import AdminPanel from './AdminPanel';
import CreateMusicReview from './CreateMusicReview';
import SecretDiaries from './SecretDiaries';
export default function AdminDashboard() {
  // State to track which admin panel is currently active
  const [activeTab, setActiveTab] = useState<'blogs' | 'music' | 'diaries'>('blogs');
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Send back to homepage after logging out
  };

  const colors = {
    background: '#FAF8F5',
    text: '#5D4A3A',
    border: '#D8CFC4',
    button: '#E8DCCB',
    activeTab: '#FFFFFF'
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* --- DASHBOARD HEADER & NAVIGATION --- */}
      <header style={{ 
        backgroundColor: '#FFFFFF', 
        padding: '20px 40px', 
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontFamily: 'TAN-Mon-Cheri, serif', color: colors.text }}>
          Master Admin
        </h1>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setActiveTab('blogs')}
            style={{ 
              padding: '10px 20px', 
              cursor: 'pointer', 
              backgroundColor: activeTab === 'blogs' ? colors.text : 'transparent', 
              color: activeTab === 'blogs' ? '#FFF' : colors.text,
              border: `1px solid ${colors.text}`, 
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            Blog Articles
          </button>
          
          <button 
            onClick={() => setActiveTab('music')}
            style={{ 
              padding: '10px 20px', 
              cursor: 'pointer', 
              backgroundColor: activeTab === 'music' ? colors.text : 'transparent', 
              color: activeTab === 'music' ? '#FFF' : colors.text,
              border: `1px solid ${colors.text}`, 
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            Music Reviews
          </button>
          <button 
            onClick={() => setActiveTab('diaries')}
            style={{ 
                padding: '10px 20px', 
                cursor: 'pointer', 
                backgroundColor: activeTab === 'diaries' ? colors.text : 'transparent', 
                color: activeTab === 'diaries' ? '#FFF' : colors.text,
                border: `1px solid ${colors.text}`, 
                borderRadius: '4px',
                fontWeight: 'bold'
            }}
            >
            Personal Diaries
            </button>

            <Link 
            to="/admin/diaries"
            style={{ 
              padding: '10px 20px', 
              textDecoration: 'none',
              backgroundColor: '#5D4A3A', 
              color: '#FFF',
              borderRadius: '4px',
              marginLeft: '20px',
              fontWeight: 'bold'
            }}
          >
            Read Vault
          </Link>

          <button 
            onClick={handleLogout}
            style={{ 
              padding: '10px 20px', 
              cursor: 'pointer', 
              backgroundColor: '#ffdadb', 
              color: '#d63031',
              border: '1px solid #d63031', 
              borderRadius: '4px',
              marginLeft: '20px',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* --- DYNAMIC CONTENT AREA --- */}
      {/* We simply render the component you selected! */}
      <main style={{ flex: 1, padding: '20px' }}>
        {activeTab === 'blogs' && <AdminPanel />}
        {activeTab === 'music' && <CreateMusicReview />}
        {activeTab === 'diaries' && <SecretDiaries />}
      </main>

    </div>
  );
}