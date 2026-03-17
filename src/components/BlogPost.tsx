import { useParams, Link } from 'react-router-dom';
import MarkdownRenderer from './MarkdownRenderer';

export default function BlogPost() {
  const { slug } = useParams(); 

  // MOCK MARKDOWN DATA: This is exactly what FastAPI will eventually send you from the database
  const mockMarkdownText = `
This is a demonstration of **react-markdown** combined with our beautiful custom typography. 

## Why Markdown?
Writing raw HTML inside a database is tedious. Markdown allows you to write naturally:
* It is easy to read
* It converts safely to HTML
* It supports plugins like \`remark-gfm\`
* Code

\`\`\`python
def greet_user(name):
    print(f"Hello, {name}! Welcome to the blog.")

greet_user("Hung")
\`\`\`

\`\`\`javascript
function greetUser(name) {
    console.log(\`Hello, \${name}! Welcome to the blog.\`);
}

greetUser("Hung");
\`\`\`

> "Simplicity is the soul of efficiency." 

You can even add links easily, like this link to [blackbidz.com](https://blackbidz.com), and the renderer handles it automatically.
  `;

  const post = {
    title: `Reading: ${slug}`,
    date: "March 17, 2026",
    content: mockMarkdownText // Using our new mock Markdown string
  };

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
          {post.date}
        </p>

        {/* WE INJECT THE RENDERER HERE */}
        <MarkdownRenderer content={post.content} />

      </article>
      
    </main>
  );
}