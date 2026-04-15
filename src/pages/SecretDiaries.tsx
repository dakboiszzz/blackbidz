import { useState, useEffect } from 'react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { apiFetch } from '../utils/apiFetch';
import { Link } from 'react-router-dom';
export default function SecretDiaries() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [viewMode, setViewMode] = useState<'create' | 'manage'>('create'); 
  const [diaries, setDiaries] = useState<any[]>([]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
  };

  const fetchDiaries = async () => {
    try {
      const response = await apiFetch('/api/diaries');
      if (response.ok) {
        const data = await response.json();
        setDiaries(data);
      }
    } catch (error) {
      setMessage("Failed to load diary entries.");
    }
  };

  useEffect(() => {
    if (viewMode === 'manage') {
      fetchDiaries();
    }
  }, [viewMode]);

  const handleDelete = async (diaryId: number, diaryTitle: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${diaryTitle}"?`)) {
      return;
    }

    try {
      setMessage('Deleting entry...');
      const response = await apiFetch(`/api/diaries/${diaryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Entry deleted successfully! 🗑️');
        fetchDiaries(); 
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage('Failed to connect to the backend server.');
    }
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>, publishStatus: boolean) => {
    e.preventDefault();
    setMessage(editingId ? 'Updating...' : 'Saving...');

    const payload = { title, slug, summary, content, is_published: publishStatus };
    const method = editingId ? 'PUT' : 'POST';
    const endpoint = editingId ? `/api/diaries/${editingId}` : `/api/diaries`;

    try {
      const response = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        if (publishStatus) {
            setMessage(editingId ? 'Entry updated and locked! 🔒' : 'New entry locked in the vault! 🔒');
        } else {
            setMessage('Draft saved successfully! 📝');
        }
        resetForm(); 
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage('Failed to connect to the backend server.');
    }
  };

  const handleEditClick = (diary: any) => {
    setTitle(diary.title);
    setSlug(diary.slug);
    setSummary(diary.summary);
    setContent(diary.content);
    setEditingId(diary.id);
    setViewMode('create'); 
    setMessage(`Editing mode active for: ${diary.title}`);
  };

  const resetForm = () => {
    setTitle(''); setSlug(''); setSummary(''); setContent('');
    setEditingId(null);
    setMessage('');
  };
  
  const colors = {
    background: '#FAF8F5', text: '#5D4A3A', border: '#D8CFC4', button: '#E8DCCB', active: '#D8CFC4',
  };

  const inputStyle = {
    width: '100%', padding: '12px', border: `1px solid ${colors.border}`, borderRadius: '4px',
    backgroundColor: '#FFFFFF', color: colors.text, fontFamily: 'inherit', outline: 'none',
  };

  const tabButtonStyle = (active: boolean) => ({
    padding: '8px 16px', cursor: 'pointer', backgroundColor: active ? colors.active : 'transparent',
    border: `1px solid ${colors.border}`, borderRadius: '4px 4px 0 0', color: colors.text,
    fontWeight: active ? 'bold' : 'normal', marginRight: '5px', borderBottom: active ? 'none' : `1px solid ${colors.border}`,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'diaries'); // Cloudinary folder

    try {
      setMessage("Uploading image...");
      const response = await apiFetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const markdownLink = `\n![Diary Image](${data.url})\n`;
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
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontWeight: 'normal', fontSize: '28px', margin: 0 }}>Secret Diary Vault</h2>
            <div>
                <button 
                    onClick={() => { resetForm(); setViewMode('create'); }} 
                    style={{ ...tabButtonStyle(viewMode === 'create'), borderRadius: '4px', borderBottom: `1px solid ${colors.border}` }}>
                    {editingId ? "Editing Mode" : "New Entry"}
                </button>
                <button 
                    onClick={() => setViewMode('manage')} 
                    style={{ ...tabButtonStyle(viewMode === 'manage'), borderRadius: '4px', borderBottom: `1px solid ${colors.border}` }}>
                    Manage Entries
                </button>
            </div>
        </div>

        {viewMode === 'manage' && (
            <div>
                {diaries.length === 0 ? <p>The vault is empty.</p> : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {diaries.map(diary => (
                            <li key={diary.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: `1px solid ${colors.border}` }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{diary.title}</h3>
                                    <small style={{ color: '#888' }}>
                                      {diary.slug} | 
                                      <span style={{ 
                                          marginLeft: '5px', padding: '2px 6px', borderRadius: '12px', fontSize: '12px',
                                          backgroundColor: diary.is_published ? '#dff9fb' : '#f5f6fa',
                                          color: diary.is_published ? '#22a6b3' : '#718093', fontWeight: 'bold'
                                      }}>
                                          {diary.is_published ? 'Locked' : 'Draft'}
                                      </span>
                                    </small>
                                </div>
                                <div>
                                    
                                    <button 
                                        onClick={() => handleEditClick(diary)}
                                        style={{ padding: '8px 12px', marginRight: '10px', cursor: 'pointer', backgroundColor: colors.button, border: 'none', borderRadius: '4px' }}>
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(diary.id, diary.title)}
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
        <div style={{ display: 'flex', marginBottom: '-1px' }}>
          <button type="button" onClick={() => setIsPreview(false)} style={tabButtonStyle(!isPreview)}>Write</button>
          <button type="button" onClick={() => setIsPreview(true)} style={tabButtonStyle(isPreview)}>Preview</button>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: `1px solid ${colors.border}`, padding: '20px', borderRadius: '0 4px 4px 4px' }}>
            <div style={{ padding: '15px', border: `1px dashed ${colors.border}`, borderRadius: '4px', backgroundColor: '#f9f9f9', marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Add Image to Diary</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ color: colors.text }} />
            </div>

          {!isPreview ? (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title</label>
                <input type="text" value={title} onChange={handleTitleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Slug</label>
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
            <div style={{ minHeight: '500px' }}>
               <h1 style={{ borderBottom: `2px solid ${colors.border}`, paddingBottom: '10px' }}>{title || "Untitled Entry"}</h1>
               <p style={{ fontStyle: 'italic', color: '#888' }}>{summary}</p>
               <hr style={{ borderColor: colors.border, opacity: 0.3, margin: '20px 0' }} />
               <MarkdownRenderer content={content || "*No content to preview yet...*"} />
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
                type="button" 
                onClick={(e) => handleSave(e, false)} 
                style={{ padding: '12px 24px', cursor: 'pointer', backgroundColor: 'transparent', color: colors.text, border: `2px solid ${colors.border}`, borderRadius: '4px', fontSize: '16px', fontWeight: 'bold' }}>
                Save Draft
            </button>
            <button 
                type="button" 
                onClick={(e) => handleSave(e, true)} 
                style={{ padding: '12px 24px', cursor: 'pointer', backgroundColor: colors.button, color: colors.text, border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold' }}>
                {editingId ? 'Update & Lock' : 'Lock in Vault'}
            </button>
        </div>
        </form>
          </>
        )}
        {message && <p style={{ marginTop: '20px', fontWeight: 'bold', color: colors.text }}>{message}</p>}
      </div>
    </div>
  );
}