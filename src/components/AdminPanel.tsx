import { useState } from 'react';

export default function AdminPanel() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  // Auto-generate a slug from the title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Publishing...');

    const newPost = {
      title,
      slug,
      summary,
      content,
      is_published: true // Set to false if you want to save as draft
    };

    try {
      // Adjust the URL if your FastAPI server runs on a different port
      const response = await fetch('http://127.0.0.1:8000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Create a New Blog Post</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Title</label><br />
          <input type="text" value={title} onChange={handleTitleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div>
          <label>Slug (URL snippet)</label><br />
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div>
          <label>Summary</label><br />
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} style={{ width: '100%', padding: '8px' }} />
        </div>

        <div>
          <label>Content (Markdown)</label><br />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={15} required style={{ width: '100%', padding: '8px', fontFamily: 'monospace' }} />
        </div>

        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Publish Post
        </button>
      </form>

      {message && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}