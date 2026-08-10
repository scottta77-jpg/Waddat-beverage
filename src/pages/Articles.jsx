import React from 'react';
import { Link } from 'react-router-dom';
import articlesData from '../data/articles.json';

export default function Articles() {
  return (
    <main className="articles-page">
      <h1>Articles</h1>
      <div className="article-grid">
        {articlesData.map((article) => (
          <article key={article.id} className="article-card">
            <Link to={`/articles/${article.slug}`}>
              <div className="article-thumbnail">
                <img src={article.image} alt={article.title} />
              </div>
            </Link>
            <div className="article-content">
              <h2><Link to={`/articles/${article.slug}`}>{article.title}</Link></h2>
              <p className="article-excerpt">{article.excerpt}</p>
              <Link to={`/articles/${article.slug}`} className="btn-secondary">Read More</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
