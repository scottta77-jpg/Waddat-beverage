import { useState } from 'react';
import { Link } from 'react-router-dom';
import productsData from '../data/products.json';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} alt={product.name} />
      </Link>
      <h3><Link to={`/product/${product.slug}`}>{product.name}</Link></h3>
      <p>${product.price.toFixed(2)} USD</p>
      <div className="size-selector">
        <label htmlFor={`size-${product.id}`}>Size:</label>
        <select
          id={`size-${product.id}`}
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          {product.sizes.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      <button type="button" className="btn-secondary" onClick={handleAddToCart}>
        {added ? '✓ Added!' : 'Add to Cart'}
      </button>
    </div>
  );
}

export default function Products() {
  return (
    <main className="products-page">
      <h1>All Products</h1>
      <div className="product-grid">
        {productsData.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
