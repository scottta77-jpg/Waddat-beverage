import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <Link to="/products">PRODUCTS</Link>
          <Link to="/#about">ABOUT</Link>
          <Link to="/#benefits">HOW IT WORKS</Link>
          <Link to="/#reviews">REVIEWS</Link>
        </div>
        <div className="footer-col">
          <Link to="/#map">WHERE TO FIND</Link>
          <Link to="/#faq">FAQ</Link>
          <Link to="/articles">ARTICLES</Link>
        </div>
        <div className="footer-social">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Insta</a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">Twitter(X)</a>
        </div>
      </div>
    </footer>
  );
}
