import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/apiFetch';
export default function CreateMusicReview() {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [message, setMessage] = useState('');

  // --- NEW DASHBOARD STATE ---
  const [viewMode, setViewMode] = useState<'create' | 'manage'>('create');
  const [reviews, setReviews] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // --- FETCH REVIEWS ---
  const fetchReviews = async () => {
    try {
      const response = await apiFetch('/api/music_reviews/');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      setMessage("Failed to load reviews.");
    }
  };

  useEffect(() => {
    if (viewMode === 'manage') {
      fetchReviews();
    }
  }, [viewMode]);

  // --- DELETE LOGIC ---
  const handleDelete = async (id: number, reviewTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${reviewTitle}"? This will also delete the album cover from the cloud.`)) {
      return;
    }
    try {
      setMessage('Deleting review and image...');
      const response = await apiFetch(`/api/music_reviews/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Review deleted successfully! 🗑️');
        fetchReviews();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage('Failed to connect to the backend server.');
    }
  };

  // --- EDIT SELECTION LOGIC ---
  const handleEditClick = (review: any) => {
    // Fill the form with the selected review's data
    setTitle(review.title);
    setImageUrl(review.image_url);
    setSummary(review.summary);
    setFullContent(review.full_content);
    // Convert backend "::" format back to comma-separated for the input box
    setKeywordsInput(review.keywords ? review.keywords.replace(/::/g, ', ') : '');
    
    setEditingId(review.id);
    setViewMode('create'); // Switch to the form view
    setMessage(`Editing mode active for: ${review.title}`);
  };

  // Reset form when switching to a fresh 'Create' state
  const resetForm = () => {
    setTitle(''); setImageUrl(''); setSummary(''); setFullContent(''); setKeywordsInput('');
    setEditingId(null);
    setMessage('If you clicked Publish, then the review was successfully published/updated! 🎉');
  };

  // The modified Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'music_reviews'); // Explicitly target the music_reviews folder

    try {
      setMessage("Uploading image...");
      const response = await apiFetch('/api/media', {
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
    setMessage(editingId ? 'Updating review...' : 'Publishing review...');

    const formattedKeywords = keywordsInput.split(',').map(k => k.trim()).filter(k => k.length > 0).join('::');
    const payload = { title, image_url: imageUrl, summary, full_content: fullContent, keywords: formattedKeywords };

    // Decide if we are POSTing (new) or PUTting (updating existing)
    const method = editingId ? 'PUT' : 'POST';
    const endpoint = editingId 
        ? `/api/music_reviews/${editingId}`
        : `/api/music_reviews`;

    try {
      const response = await apiFetch(endpoint, {
        method: method,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage(editingId ? 'Music Review updated successfully! 🎵' : 'Music Review published successfully! 🎵');
        resetForm();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage('Failed to connect to the backend server.');
    }
  };

  const colors = { background: '#FAF8F5', text: '#5D4A3A', border: '#D8CFC4', button: '#E8DCCB', active: '#D8CFC4' };
  const inputStyle = { width: '100%', padding: '12px', border: `1px solid ${colors.border}`, borderRadius: '4px', backgroundColor: '#FFFFFF', color: colors.text, outline: 'none' };
  const tabButtonStyle = (active: boolean) => ({
    padding: '8px 16px', cursor: 'pointer', backgroundColor: active ? colors.active : 'transparent',
    border: `1px solid ${colors.border}`, borderRadius: '4px 4px 0 0', color: colors.text,
    fontWeight: active ? 'bold' : 'normal', marginRight: '5px', borderBottom: active ? 'none' : `1px solid ${colors.border}`,
  });
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '40px 20px', color: colors.text }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontWeight: 'normal', fontSize: '28px', margin: 0 }}>Music Review Admin</h2>
            <div>
                <button 
                    onClick={() => { resetForm(); setViewMode('create'); }} 
                    style={{ ...tabButtonStyle(viewMode === 'create'), borderRadius: '4px', borderBottom: `1px solid ${colors.border}` }}>
                    {editingId ? "Editing Mode" : "Create New"}
                </button>
                <button 
                    onClick={() => { resetForm(); setViewMode('manage'); }} 
                    style={{ ...tabButtonStyle(viewMode === 'manage'), borderRadius: '4px', borderBottom: `1px solid ${colors.border}` }}>
                    Manage Reviews
                </button>
            </div>
        </div>
        
        {viewMode === 'manage' && (
            <div>
                {reviews.length === 0 ? <p>No reviews found.</p> : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {reviews.map(review => (
                            <li key={review.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: `1px solid ${colors.border}` }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{review.title}</h3>
                                </div>
                                <div>
                                    <button 
                                        onClick={() => handleEditClick(review)}
                                        style={{ padding: '8px 12px', marginRight: '10px', cursor: 'pointer', backgroundColor: colors.button, border: 'none', borderRadius: '4px' }}>
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(review.id, review.title)}
                                        style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#ffeaa7', color: '#d63031', border: '1px solid #d63031', borderRadius: '4px', fontWeight: 'bold' }}>
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )}

        {viewMode === 'create' && (
            <>
                <div style={{ padding: '15px', border: `1px dashed ${colors.border}`, borderRadius: '4px', backgroundColor: '#f9f9f9', marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Upload Album Cover Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ color: colors.text }} />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    Uploading automatically saves to Cloudinary and fills the Image Path below.
                </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Song / Album Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Image Path</label>
                    <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required style={inputStyle} />
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
                    <input type="text" value={keywordsInput} onChange={(e) => setKeywordsInput(e.target.value)} required style={inputStyle} />
                </div>

                <button type="submit" style={{ padding: '12px 24px', cursor: 'pointer', backgroundColor: colors.button, color: colors.text, border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', alignSelf: 'flex-start' }}>
                    {editingId ? 'Update Review' : 'Publish Review'}
                </button>
                </form>
            </>
        )}

        {message && <p style={{ marginTop: '20px', fontWeight: 'bold', color: colors.text }}>{message}</p>}
      </div>
    </div>
  );
}