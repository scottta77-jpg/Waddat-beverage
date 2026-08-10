import React from 'react';
import { Link } from 'react-router-dom';
import productsData from '../data/products.json';

export default function Products() {
  return (
    <main className="products-page">
      <h1>All Products</h1>
      <div className="product-grid">
        {productsData.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name} />
            </Link>
            <h3><Link to={`/product/${product.slug}`}>{product.name}</Link></h3>
            <p>${product.price.toFixed(2)} USD</p>
            <div className="size-selector">
              <label htmlFor={`size-${product.id}`}>Size:</label>
              <select id={`size-${product.id}`}>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <Link to={`/product/${product.slug}`} className="btn-secondary">View Product</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
