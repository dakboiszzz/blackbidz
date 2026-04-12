import { useState } from 'react';

export default function CreateMusicReview() {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [message, setMessage] = useState('');

  // The modified Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'music_reviews'); // Explicitly target the music_reviews folder

    try {
      setMessage("Uploading image...");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        // Auto-fill the Image Path input with the new URL
        setImageUrl(data.url); 
        
        setMessage("Image uploaded and path set! 🖼️");
      } else {
        setMessage("Upload failed on server.");
      }
    } catch (error) {
      setMessage("Error connecting to upload API.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Publishing review...');

    const formattedKeywords = keywordsInput.split(',').map(k => k.trim()).filter(k => k.length > 0).join('::');
    const newReview = { title, image_url: imageUrl, summary, full_content: fullContent, keywords: formattedKeywords };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/music_reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        setMessage('Music Review published successfully! 🎵');
        setTitle(''); setImageUrl(''); setSummary(''); setFullContent(''); setKeywordsInput('');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage('Failed to connect to the backend server.');
    }
  };

  const colors = { background: '#FAF8F5', text: '#5D4A3A', border: '#D8CFC4', button: '#E8DCCB' };
  const inputStyle = { width: '100%', padding: '12px', border: `1px solid ${colors.border}`, borderRadius: '4px', backgroundColor: '#FFFFFF', color: colors.text, outline: 'none' };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '40px 20px', color: colors.text }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontWeight: 'normal', marginBottom: '20px', fontSize: '28px' }}>Add a Music Review</h2>
        
        {/* IMAGE UPLOAD BOX */}
        <div style={{ padding: '15px', border: `1px dashed ${colors.border}`, borderRadius: '4px', backgroundColor: '#f9f9f9', marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Upload Album Cover Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ color: colors.text }} />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Uploading automatically saves to <code>/public/music_reviews/</code> and fills the Image Path below.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Song / Album Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Image Path</label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required style={inputStyle} placeholder="Upload an image above, or type path manually" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Short Summary</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} required style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Full Review</label>
            <textarea value={fullContent} onChange={(e) => setFullContent(e.target.value)} rows={8} required style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Keywords (Separate with commas)</label>
            <input type="text" value={keywordsInput} onChange={(e) => setKeywordsInput(e.target.value)} required style={inputStyle} placeholder="Khá hợp khi yêu đương, Hợp khi yêu đời, Vui vẻ phấn chấn" />
          </div>

          <button type="submit" style={{ padding: '12px 24px', cursor: 'pointer', backgroundColor: colors.button, color: colors.text, border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', alignSelf: 'flex-start' }}>
            Publish Review
          </button>
        </form>

        {message && <p style={{ marginTop: '20px', fontWeight: 'bold', color: colors.text }}>{message}</p>}
      </div>
    </div>
  );
}