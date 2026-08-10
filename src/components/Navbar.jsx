import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  const handleHashLink = (hash) => {
    if (location.pathname === '/') {
      return hash;
    }
    return `/${hash}`;
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">ZOOOOM</Link>
        
        <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/products" style={{color: 'var(--color-orange)'}}>PRODUCTS</Link>
          <Link to={handleHashLink('#about')}>About</Link>
          <Link to={handleHashLink('#reviews')}>reviews</Link>
          <Link to="/articles">Articles</Link>
          <Link to={handleHashLink('#faq')}>faq</Link>
        </nav>
        
        <div className="nav-actions">
          <Link to="/products" className="btn-primary">TRY ZOOOOM</Link>
          <button className="cart-toggle" onClick={() => setIsCartOpen(!isCartOpen)}>
            🛒 0
          </button>
          <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </button>
        </div>
      </div>
      
      {/* Sidebar Cart placeholder */}
      {isCartOpen && (
        <div style={{position: 'fixed', right: 0, top: 0, bottom: 0, width: '300px', backgroundColor: '#fff', borderLeft: '2px solid var(--color-dark)', zIndex: 1000, padding: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2>Cart</h2>
            <button onClick={() => setIsCartOpen(false)} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>✖</button>
          </div>
          <p>Your cart is empty.</p>
        </div>
      )}
    </header>
  );
}
