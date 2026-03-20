import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarkdownRenderer from './MarkdownRenderer';

interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  is_published: boolean;
  created_at: string;
}

const API_URL = "https://blackbi-lth-blog.hf.space";

export default function BlogPost() {
  const { slug } = useParams(); 
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/blogs/${slug}`)
      .then(res => {
        if (res.status === 404) throw new Error("This blog post could not be found.");
        if (!res.ok) throw new Error("Failed to fetch the article from the server.");
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <main className="blog-post-container" style={{ flex: 1, width: '100%', maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
        <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.2rem', opacity: 0.7 }}>Dusting off the pages...</p>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="blog-post-container" style={{ flex: 1, width: '100%', maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
        <Link to="/blogs" style={{ fontFamily: 'Lora, serif', color: 'var(--text-color)', textDecoration: 'none', opacity: 0.7, marginBottom: '2rem', display: 'inline-block' }}>
          &larr; Back to all blogs
        </Link>
        <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.2rem', color: 'red', opacity: 0.8 }}>{error || "Post not found."}</p>
      </main>
    );
  }

  const dateStr = new Date(post.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="blog-post-container" style={{ flex: 1, width: '100%', maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
      
      <Link to="/blogs" style={{ fontFamily: 'Lora, serif', color: 'var(--text-color)', textDecoration: 'none', opacity: 0.7, marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Back to all blogs
      </Link>

      <article>
        <h1 style={{ fontFamily: 'TAN Mon Cheri, serif', fontSize: '4.5rem', lineHeight: 1.1, margin: '0 0 1rem 0', fontWeight: 'normal' }}>
          {post.title}
        </h1>
        
        <p style={{ fontFamily: 'EB Garamond, serif', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6, marginBottom: '3rem' }}>
          {dateStr}
        </p>

        <MarkdownRenderer content={post.content} />

      </article>
      
    </main>
  );
}