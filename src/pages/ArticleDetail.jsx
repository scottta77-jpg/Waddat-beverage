import React from 'react';
import { useParams, Link } from 'react-router-dom';
import articlesData from '../data/articles.json';

export default function ArticleDetail() {
  const { slug } = useParams();
  const article = articlesData.find((a) => a.slug === slug);

  if (!article) {
    return (
      <main className="article-detail-page not-found-state">
        <h1>Article not found</h1>
        <p>Sorry, we couldn't find the article you're looking for.</p>
        <Link to="/articles" className="btn-primary">Back to Articles</Link>
      </main>
    );
  }

  return (
    <main className="article-detail-page">
      <article className="article-full">
        <header className="article-header">
          <h1>{article.title}</h1>
          <div className="article-meta">
            <span className="date">{article.date}</span>
            <span className="separator">|</span>
            <span className="author">By {article.author}</span>
          </div>
        </header>
        <div className="article-featured-image">
          <img src={article.image} alt={article.title} />
        </div>
        <div className="article-body">
          <p>{article.body}</p>
        </div>
      </article>
    </main>
  );
}
