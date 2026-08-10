import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import productsData from '../data/products.json';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = productsData.find((p) => p.slug === slug);
  const [selectedSize, setSelectedSize] = useState(product ? product.sizes[0] : '');

  if (!product) {
    return (
      <main className="product-detail-page not-found-state">
        <h1>Product not found</h1>
        <p>Sorry, we couldn't find the product you're looking for.</p>
        <Link to="/products" className="btn-primary">Back to Products</Link>
      </main>
    );
  }

  return (
    <main className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="price">${product.price.toFixed(2)} USD</p>
          <p className="description">{product.description}</p>
          
          <div className="size-selector">
            <label htmlFor="size">Size:</label>
            <select 
              id="size" 
              value={selectedSize} 
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {product.sizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          
          <button className="btn-primary add-to-cart">Add to Cart</button>
        </div>
      </div>
    </main>
  );
}
