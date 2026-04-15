import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { apiFetch } from '../utils/apiFetch';

interface Diary {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  is_published: boolean;
  created_at: string;
}

export default function SecretDiaryPost() {
  const { slug } = useParams(); 
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Securely fetch the diary entry by its slug
    apiFetch(`/api/diaries/${slug}`)
      .then(res => {
        if (res.status === 404) throw new Error("This entry could not be found in the vault.");
        if (!res.ok) throw new Error("Failed to unlock the entry from the server.");
        return res.json();
      })
      .then(data => {
        setDiary(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <main style={{ flex: 1, width: '100%', maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
        <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.2rem', opacity: 0.7 }}>Turning the pages...</p>
      </main>
    );
  }

  if (error || !diary) {
    return (
      <main style={{ flex: 1, width: '100%', maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
        <Link to="/admin" style={{ fontFamily: 'Lora, serif', color: 'var(--text-color)', textDecoration: 'none', opacity: 0.7, marginBottom: '2rem', display: 'inline-block' }}>
          &larr; Back to Dashboard
        </Link>
        <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.2rem', color: 'red', opacity: 0.8 }}>{error || "Entry not found."}</p>
      </main>
    );
  }

  const dateStr = new Date(diary.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main style={{ flex: 1, width: '100%', maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
      
      {/* Back button that takes you safely to the Master Dashboard */}
      <Link to="/admin" style={{ fontFamily: 'Lora, serif', color: 'var(--text-color)', textDecoration: 'none', opacity: 0.7, marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Back to Dashboard
      </Link>

      <article>
        <h1 style={{ fontFamily: 'TAN Mon Cheri, serif', fontSize: '4.5rem', lineHeight: 1.1, margin: '0 0 1rem 0', fontWeight: 'normal' }}>
          {diary.title}
        </h1>
        
        <p style={{ fontFamily: 'EB Garamond, serif', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6, marginBottom: '3rem' }}>
          {dateStr} | {diary.is_published ? "Locked 🔒" : "Draft 📝"}
        </p>

        <MarkdownRenderer content={diary.content} />

      </article>
      
    </main>
  );
}