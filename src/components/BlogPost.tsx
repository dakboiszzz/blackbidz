import { useParams, Link } from 'react-router-dom';

function BlogPost() {
  // This grabs the dynamic part of the URL (e.g., "my-first-post")
  const { slug } = useParams(); 

  // MOCK DATA: Later, we will delete this and ask FastAPI for the real text!
  const post = {
    title: `Reading: ${slug}`,
    date: "March 17, 2026",
    content: `This is the empty picture frame! Once your Python backend is up and running, the real paragraphs for "${slug}" will be injected right here from your database. For now, we just want to make sure the layout looks elegant.`
  };

  return (
    <main className="blog-post-container" style={{ flex: 1, width: '100%', maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
      
      {/* A nice button to go back to the list */}
      <Link to="/blogs" style={{ fontFamily: 'Lora, serif', color: 'var(--text-color)', textDecoration: 'none', opacity: 0.7, marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Back to all blogs
      </Link>

      <article>
        {/* The Title using your premium font */}
        <h1 style={{ fontFamily: 'TAN Mon Cheri, serif', fontSize: '4.5rem', lineHeight: 1.1, margin: '0 0 1rem 0', fontWeight: 'normal' }}>
          {post.title}
        </h1>
        
        {/* The Date using the clean Garamond font */}
        <p style={{ fontFamily: 'EB Garamond, serif', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6, marginBottom: '3rem' }}>
          {post.date}
        </p>

        {/* The actual blog text */}
        <div style={{ fontFamily: 'Lora, serif', fontSize: '1.2rem', lineHeight: 1.8 }}>
          <p>{post.content}</p>
        </div>
      </article>
      
    </main>
  );
}

export default BlogPost;