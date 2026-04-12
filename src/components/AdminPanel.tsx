import { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

export default function AdminPanel() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [isPreview, setIsPreview] = useState(false);

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
    active: '#D8CFC4',
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
  const tabButtonStyle = (active: boolean) => ({
    padding: '8px 16px',
    cursor: 'pointer',
    backgroundColor: active ? colors.active : 'transparent',
    border: `1px solid ${colors.border}`,
    borderRadius: '4px 4px 0 0',
    color: colors.text,
    fontWeight: active ? 'bold' : 'normal',
    marginRight: '5px',
    borderBottom: active ? 'none' : `1px solid ${colors.border}`,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    setMessage("Uploading image...");
    const response = await fetch('http://127.0.0.1:8000/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      // The markdown syntax for images
      const markdownLink = `\n![Image Description](${data.url})\n`;
      
      // Append the link to your existing content state
      setContent(prev => prev + markdownLink);
      setMessage("Image uploaded and link inserted! 🖼️");
    } else {
      setMessage("Upload failed on server.");
    }
  } catch (error) {
    setMessage("Error connecting to upload API.");
  }
};
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '40px 20px', color: colors.text }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontWeight: 'normal', marginBottom: '20px', fontSize: '28px' }}>Create a New Blog Post</h2>
        
        {/* TAB BUTTONS */}
        <div style={{ display: 'flex', marginBottom: '-1px' }}>
          <button type="button" onClick={() => setIsPreview(false)} style={tabButtonStyle(!isPreview)}>Write</button>
          <button type="button" onClick={() => setIsPreview(true)} style={tabButtonStyle(isPreview)}>Preview</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: `1px solid ${colors.border}`, padding: '20px', borderRadius: '0 4px 4px 4px' }}>
            <div style={{ 
    padding: '15px', 
    border: `1px dashed ${colors.border}`, 
    borderRadius: '4px', 
    backgroundColor: '#f9f9f9',
    marginBottom: '10px' 
  }}>
    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
      Add Image to Blog
    </label>
    <input 
      type="file" 
      accept="image/*" 
      onChange={handleImageUpload} 
      style={{ color: colors.text }}
    />
    <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
      Images are saved to <code>/public/blogs/</code> with a unique timestamp.
    </p>
  </div>
          {/* Only show inputs if NOT in preview, OR show title always so you know which blog it is */}
          {!isPreview ? (
            <>
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
            </>
          ) : (
            /* PREVIEW MODE SECTION */
            <div style={{ minHeight: '500px' }}>
               <h1 style={{ borderBottom: `2px solid ${colors.border}`, paddingBottom: '10px' }}>{title || "Untitled Blog"}</h1>
               <p style={{ fontStyle: 'italic', color: '#888' }}>{summary}</p>
               <hr style={{ borderColor: colors.border, opacity: 0.3, margin: '20px 0' }} />
               {/* This is your actual component rendering the content */}
               <MarkdownRenderer content={content || "*No content to preview yet...*"} />
            </div>
          )}

          <button type="submit" style={{ 
            padding: '12px 24px', 
            cursor: 'pointer', 
            backgroundColor: colors.button, 
            color: colors.text, 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '10px'
          }}>
            Publish Post
          </button>
        </form>

        {message && <p style={{ marginTop: '20px', fontWeight: 'bold', color: colors.text }}>{message}</p>}
      </div>
    </div>
  );
}