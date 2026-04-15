import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

export default function SecretDiaryList() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 🔒 We MUST use apiFetch here so the backend lets us in
    apiFetch('/api/diaries')
      .then(res => {
        if (!res.ok) throw new Error("Failed to unlock the vault from the server");
        return res.json();
      })
      .then(data => {
        setDiaries(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ flex: 1, width: '100%', maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
      
      {/* Back button to return to the management dashboard */}
      <Link to="/admin" style={{ fontFamily: 'Lora, serif', color: 'var(--text-color)', textDecoration: 'none', opacity: 0.7, marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Back to Dashboard
      </Link>

      <h1 style={{ fontFamily: 'TAN Mon Cheri, serif', fontSize: '4.5rem', lineHeight: 1.1, margin: '0 0 4rem 0', fontWeight: 'normal' }}>
        My Secret Vault
      </h1>
      
      {loading && <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.2rem', opacity: 0.7 }}>Unlocking the latest entries...</p>}
      {error && <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.2rem', color: 'red', opacity: 0.8 }}>Oops! {error}</p>}

      {!loading && !error && diaries.length === 0 && (
        <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.2rem', opacity: 0.7 }}>No thoughts have been locked in the vault yet.</p>
      )}

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {diaries.map(diary => (
          <li key={diary.id} style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: '2.5rem', margin: '0 0 1rem 0' }}>
              {diary.title} {diary.is_published ? "🔒" : "📝"}
            </h2>
            <p style={{ fontFamily: 'Lora, serif', fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.8, marginBottom: '1rem' }}>
              {diary.summary}
            </p>
            {/* Link points to the secure reading room */}
            <Link to={`/admin/diaries/${diary.slug}`} style={{ fontFamily: 'EB Garamond, serif', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', color: 'var(--text-color)', textDecoration: 'none', borderBottom: '1px solid var(--text-color)', paddingBottom: '2px' }}>
              Read entry
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}