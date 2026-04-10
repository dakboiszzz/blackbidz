import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  is_published: boolean;
  created_at: string;
}

const API_URL = "http://127.0.0.1:8000";

function Blogs() {
  const [blogs, setBlogs] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/blogs`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch blogs from the server");
        return res.json();
      })
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ flex: 1, width: '100%', maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
      <h1 style={{ fontFamily: 'TAN Mon Cheri, serif', fontSize: '4.5rem', lineHeight: 1.1, margin: '0 0 4rem 0', fontWeight: 'normal' }}>
        My Blogs
      </h1>
      
      {loading && <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.2rem', opacity: 0.7 }}>Loading the latest articles...</p>}
      {error && <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.2rem', color: 'red', opacity: 0.8 }}>Oops! {error}</p>}

      {!loading && !error && blogs.length === 0 && (
        <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.2rem', opacity: 0.7 }}>No thoughts have been published yet. Check back soon!</p>
      )}

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {blogs.map(blog => (
          <li key={blog.id} style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: '2.5rem', margin: '0 0 1rem 0' }}>
              {blog.title}
            </h2>
            <p style={{ fontFamily: 'Lora, serif', fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.8, marginBottom: '1rem' }}>
              {blog.summary}
            </p>
            <Link to={`/blogs/${blog.slug}`} style={{ fontFamily: 'EB Garamond, serif', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', color: 'var(--text-color)', textDecoration: 'none', borderBottom: '1px solid var(--text-color)', paddingBottom: '2px' }}>
              Read more
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Blogs;