import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">Back to home</Link>
      </div>
    </main>
  );
}
