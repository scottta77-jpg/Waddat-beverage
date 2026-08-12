import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { items, removeFromCart, updateQuantity, cartCount, cartTotal, isCartOpen, openCart, closeCart } = useCart();

  const handleHashLink = (hash) => {
    if (location.pathname === '/') return hash;
    return `/${hash}`;
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">WADDAT</Link>

        <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/products" style={{ color: 'var(--color-orange)' }}>PRODUCTS</Link>
          <Link to={handleHashLink('#about')}>About</Link>
          <Link to={handleHashLink('#reviews')}>Reviews</Link>
          <Link to="/articles">Articles</Link>
          <Link to={handleHashLink('#faq')}>FAQ</Link>
        </nav>

        <div className="nav-actions">
          <Link to="/products" className="btn-primary">SHOP NOW</Link>
          <button type="button" className="cart-toggle" onClick={() => isCartOpen ? closeCart() : openCart()}>
            🛒 {cartCount}
          </button>
          <button type="button" className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </button>
        </div>
      </div>

      {isCartOpen && (
        <div className="cart-sidebar">
          <div className="cart-sidebar-header">
            <h2>Your Cart</h2>
            <button type="button" onClick={closeCart} className="cart-close">✖</button>
          </div>

          {items.length === 0 ? (
            <p className="cart-empty">Your cart is empty.</p>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-size">{item.size}</p>
                      <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                      <div className="cart-item-qty">
                        <button type="button" onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <button type="button" className="cart-item-remove" onClick={() => removeFromCart(item.id, item.size)}>✖</button>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button type="button" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>Checkout</button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
