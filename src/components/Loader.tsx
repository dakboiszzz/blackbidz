import React from 'react';

interface LoaderProps {
  message: string;
}

function Loader({ message }: LoaderProps) {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <h2 style={styles.title}>LTH's Blog</h2>
      <p style={styles.text}>{message}</p>
      <span style={styles.subtext}>Hugging Face is booting the backend container...</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#FAF8F5', // Matching your blog theme
    color: '#5D4A3A',
    textAlign: 'center',
    padding: '20px'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #D8CFC4',
    borderTop: '5px solid #5D4A3A',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  title: {
    fontWeight: 'normal',
    marginBottom: '10px'
  },
  text: {
    fontSize: '18px',
    margin: '5px 0'
  },
  subtext: {
    fontSize: '14px',
    color: '#888',
    marginTop: '15px'
  }
};
export default  Loader;
// Note: You'll need to add the @keyframes spin to your App.css