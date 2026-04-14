import { useState, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

export default function AdminPanel() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  // --- NEW STATE FOR DASHBOARD ---
  // 'create' shows your form, 'manage' shows the list of posts
  const [viewMode, setViewMode] = useState<'create' | 'manage'>('create'); 
  const [posts, setPosts] = useState<any[]>([]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
  };
  // --- FETCH POSTS FOR MANAGE VIEW ---
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      setMessage("Failed to load posts.");
    }
  };
  // Run fetchPosts whenever we switch to the 'manage' tab
  useEffect(() => {
    if (viewMode === 'manage') {
      fetchPosts();
    }
  }, [viewMode]);

  // --- DELETE LOGIC ---
  const handleDelete = async (postId: number, postTitle: string) => {
    // Safety check so you don't accidentally click it
    if (!window.confirm(`Are you sure you want to delete "${postTitle}"? This will also delete its images from the cloud.`)) {
      return;
    }

    try {
      setMessage('Deleting post and images...');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Post deleted successfully! 🗑️');
        // Refresh the list so the deleted post disappears
        fetchPosts(); 
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage('Failed to connect to the backend server.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(editingId ? 'Updating Post...' : 'Publishing...');

    const payload = { title, slug, summary, content, is_published: true };
    const method = editingId ? 'PUT' : 'POST';
    
    // IMPORTANT: Make sure this URL matches your FastAPI route exactly
    const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/api/blogs/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/blogs`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage(editingId ? 'Post updated successfully! ✍️' : 'Post published successfully! 🎉');
        resetForm(); // Clear the form after success
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage('Failed to connect to the backend server.');
    }
  };

  const handleEditClick = (post: any) => {
    setTitle(post.title);
    setSlug(post.slug);
    setSummary(post.summary);
    setContent(post.content);
    setEditingId(post.id);
    setViewMode('create'); // Instantly flips the view back to the editor tab
    setMessage(`Editing mode active for: ${post.title}`);
  };
  const resetForm = () => {
    setTitle(''); setSlug(''); setSummary(''); setContent('');
    setEditingId(null);
    setMessage('');
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
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/media/`, {
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
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontWeight: 'normal', fontSize: '28px', margin: 0 }}>Blog Admin Panel</h2>
            {/* MAIN NAVIGATION: Switch between Create and Manage */}
            <div>
                <button 
                    onClick={() => { resetForm(); setViewMode('create'); }} 
                    style={{ ...tabButtonStyle(viewMode === 'create'), borderRadius: '4px', borderBottom: `1px solid ${colors.border}` }}>
                    {editingId ? "Editing Mode" : "Create New"}
                </button>
                <button 
                    onClick={() => setViewMode('manage')} 
                    style={{ ...tabButtonStyle(viewMode === 'manage'), borderRadius: '4px', borderBottom: `1px solid ${colors.border}` }}>
                    Manage Posts
                </button>
            </div>
        </div>


        {/* ========================================= */}
        {/* VIEW 1: MANAGE POSTS (NEW)                */}
        {/* ========================================= */}
        {viewMode === 'manage' && (
            <div>
                {posts.length === 0 ? <p>No posts found.</p> : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {posts.map(post => (
                            <li key={post.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: `1px solid ${colors.border}` }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{post.title}</h3>
                                    <small style={{ color: '#888' }}>{post.slug} | {post.is_published ? 'Published' : 'Draft'}</small>
                                </div>
                                <div>
                                    {/* Edit button placeholder for the next step */}
                                    <button 
                                        onClick={() => handleEditClick(post)}
                                        style={{ padding: '8px 12px', marginRight: '10px', cursor: 'pointer', backgroundColor: colors.button, border: 'none', borderRadius: '4px' }}>
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(post.id, post.title)}
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
      Images are saved to Cloudinary with a unique timestamp, the link is automatically inserted.
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
            {editingId ? 'Update Post' : 'Publish Post'}
          </button>
        </form>
          </>
        )}
        {message && <p style={{ marginTop: '20px', fontWeight: 'bold', color: colors.text }}>{message}</p>}
      </div>
    </div>
  );
}