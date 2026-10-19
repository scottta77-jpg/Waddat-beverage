import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import productsData from '../data/products.json';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = productsData.find((p) => p.slug === slug);
  const [selectedSize, setSelectedSize] = useState(product ? product.sizes[0] : '');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <main className="product-detail-page not-found-state">
        <h1>Product not found</h1>
        <p>Sorry, we couldn't find the product you're looking for.</p>
        <Link to="/products" className="btn-primary">Back to Products</Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <main className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>

          <div className="product-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <a href="/#wholesale" className="btn-primary" style={{ textDecoration: 'none' }}>
              Request Pricing
            </a>
            <a
              href="/Waddat%20Beverage%20Trade%20Brochure%202.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              Trade Brochure
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
