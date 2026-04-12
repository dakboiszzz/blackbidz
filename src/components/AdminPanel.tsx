import { useState } from 'react';

export default function AdminPanel() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Publishing...');

    const newPost = { title, slug, summary, content, is_published: true };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        setMessage('Post published successfully! 🎉');
        setTitle(''); setSlug(''); setSummary(''); setContent('');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage('Failed to connect to the backend server.');
    }
  };

  // Theme colors derived from your homepage
  const colors = {
    background: '#FAF8F5',
    text: '#5D4A3A',
    border: '#D8CFC4',
    button: '#E8DCCB',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    backgroundColor: '#FFFFFF',
    color: colors.text,
    fontFamily: 'inherit',
    outline: 'none',
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '40px 20px', color: colors.text }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontWeight: 'normal', marginBottom: '20px', fontSize: '28px' }}>Create a New Blog Post</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title</label>
            <input type="text" value={title} onChange={handleTitleChange} required style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Slug (URL snippet)</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Summary</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Content (Markdown)</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={15} required style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical' }} />
          </div>

          <button type="submit" style={{ 
            padding: '12px 24px', 
            cursor: 'pointer', 
            backgroundColor: colors.button, 
            color: colors.text, 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            alignSelf: 'flex-start'
          }}>
            Publish Post
          </button>
        </form>

        {message && <p style={{ marginTop: '20px', fontWeight: 'bold', color: colors.text }}>{message}</p>}
      </div>
    </div>
  );
}