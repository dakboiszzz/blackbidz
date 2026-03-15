import { Link } from 'react-router-dom';

function Blogs() {
  return (
    <div>
      <h1>My Blogs</h1>
      
      <ul>
        <li>
          <h2>Blog Post 1</h2>
          <p>This is a placeholder for the first blog summary.</p>
          {/* This link doesn't go anywhere yet, but it's ready for the template! */}
          <Link to="/blogs/post-1">Read more</Link> 
        </li>

        <li>
          <h2>Blog Post 2</h2>
          <p>This is a placeholder for the second blog summary.</p>
          <Link to="/blogs/post-2">Read more</Link>
        </li>
      </ul>
    </div>
  );
}

export default Blogs;