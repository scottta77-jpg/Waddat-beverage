import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import productsData from '../data/products.json';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [currentReview, setCurrentReview] = useState(0);
  const [email, setEmail] = useState('');

  const faqs = [
    { question: 'What makes Zoooom special?', answer: 'Zoooom is made with organic ingredients, naturally fermented, and packed with probiotics. No artificial flavors, no compromises—just pure goodness in every sip!' },
    { question: 'Is there caffeine in Zoooom?', answer: 'Since we brew our kombucha with organic tea, it contains a small amount of natural caffeine. It’s just enough to give you a gentle energy boost—without the jitters!' },
    { question: 'How much sugar is in Zoooom?', answer: 'Most of the sugar added during brewing is consumed by healthy bacteria in the fermentation process. The final product has just a touch of natural sweetness.' },
    { question: 'Can kids drink Zoooom?', answer: 'Absolutely! Our kombucha is a great alternative to sugary sodas. However, since it contains a small amount of caffeine and is naturally fermented, we recommend consulting your pediatrician for younger children.' },
    { question: 'How should I store Zoooom?', answer: 'Keep it chilled! Our kombucha is alive with probiotics, so refrigeration helps maintain its freshness and benefits.' },
    { question: 'Can I drink Zoooom every day?', answer: 'Yes! Many of our fans enjoy a bottle daily as part of their healthy routine. Listen to your body and enjoy as much as you like!' }
  ];

  const reviews = [
    { text: 'I love how natural and refreshing it tastes. It’s not too sweet, just perfectly balanced! And I feel the difference in my digestion after just a few days.', author: 'Emma R.', role: 'nutritionist & wellness coach' },
    { text: 'Zoooom gives me the perfect lift in the morning without relying on coffee. I love knowing that it’s packed with probiotics and actually good for me.', author: 'James L.', role: 'fitness trainer & entrepreneur' }
  ];

  const handleFaqToggle = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Subscribed with ${email}`);
    setEmail('');
  };

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <h1>ZOOOOM</h1>
          <p>The energy of nature<br/>in every bottle</p>
          <a href="#products" className="btn-secondary">Buy NOW</a>
        </div>
      </section>

      {/* Popular Products */}
      <section id="products" className="popular-products-section">
        <div className="container">
          <h2><span>POPULAR</span> PRODUCTS</h2>
          <div className="product-grid">
            {productsData.slice(0, 3).map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-card-img-wrapper">
                  <Link to={`/product/${product.slug}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                </div>
                <div className="product-card-content">
                  <h3><Link to={`/product/${product.slug}`}>{product.name}</Link></h3>
                  <p>${product.price.toFixed(2)} USD</p>
                  <Link to={`/product/${product.slug}`} className="btn-secondary">Buy now</Link>
                </div>
              </div>
            ))}
          </div>
          <Link to="/products" className="btn-primary">VIEW ALL PRODUCTS</Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <h2><span>Zoooom</span> is a naturally fermented tea that fills you with energy and health.</h2>
          <div className="about-images" style={{height: '200px'}}>
             {/* Placeholder for floating images */}
          </div>
          <p>Each sip is a combination of ancient traditions and modern technology.</p>
          <a href="#benefits" className="btn-primary">Learn ABOUT benefits</a>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section">
        <div className="container benefits-container">
          <div className="benefits-image" style={{width: '300px', height: '300px', backgroundColor: '#e1f532', border: '2px solid #211509', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
             Image Placeholder
          </div>
          <div className="benefits-content">
            <h2>The incredible<br/><span>benefits</span><br/>of our kombucha</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">🌿</div>
                Improved digestion
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🛡️</div>
                Immunity boosting
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🦠</div>
                Natural probiotics
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section className="ingredients-section">
        <div className="container">
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <h2>Only <span>natural</span><br/>ingredients</h2>
            <p style={{fontFamily: 'Inter', fontSize: '1.5rem', marginBottom: '30px'}}>Our kombucha has a simple and healthy ingredients:</p>
            
            <div style={{display: 'flex', gap: '20px', alignItems: 'center', backgroundColor: '#e1f532', padding: '15px 40px', borderRadius: '50px', border: '2px solid #211509', fontWeight: 'bold', textTransform: 'uppercase'}}>
              <span style={{fontSize: '2rem'}}>🍃</span> Organic tea
            </div>
            
            <div className="ingredients-note">
              <h4>Please note!</h4>
              <p>Sugar added to the drink undergoes a fermentation process and is completely absorbed by healthy bacteria.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tasting Kit Section */}
      <section className="tasting-kit-section">
        <div className="container">
          <h2>Try the entire <span>Zoooom</span> line!</h2>
          <p>Want to experience the variety of flavors and benefits of kombucha? Our tasting kit is the perfect choice for those who want to familiarize themselves with the Zoooom range.</p>
          <div style={{display: 'flex', gap: '40px', justifyContent: 'center'}}>
            {/* Box and bottles mock */}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="reviews-section">
        <div className="container">
          <h2>What people say<br/>about <span>zoooom</span></h2>
          <div className="reviews-carousel">
            {reviews.map((review, i) => (
              <div key={i} className="review-card">
                <h3>{review.text.split('!')[0]}!</h3>
                <p>{review.text}</p>
                <div className="reviewer">
                  <div className="reviewer-avatar"></div>
                  <div>
                    <div className="reviewer-name">{review.author}</div>
                    <div style={{fontSize: '0.9rem', fontStyle: 'italic'}}>{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where to find */}
      <section id="map" className="where-to-find-section">
        <div className="container">
          <h2>Where to find <span>Zoooom</span></h2>
          <div className="find-options">
            <div className="find-option">
              <h3>IN STORES</h3>
              <p>Find Zoooom at selected organic shops, cafes, and supermarkets near you</p>
              <div className="map-placeholder"></div>
            </div>
            <div className="find-option">
              <h3>ORDER ONLINE</h3>
              <p>Shop our full range and enjoy fresh kombucha whenever you want</p>
              <Link to="/products" className="btn-primary" style={{marginTop: '20px'}}>Order now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Order CTA Promo */}
      <section className="order-cta-section">
        <div className="container">
          <div className="order-cta-card">
            <h2>Order now and get a bonus:<br/><span>10% off</span> your next order</h2>
            <Link to="/products" className="btn-primary">Order now</Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="container" style={{display: 'flex', flexDirection: 'row', gap: '40px'}}>
          <div style={{flex: 1}}>
            <h2>You ask,<br/><span>we answer!</span></h2>
          </div>
          <div className="faq-accordion" style={{flex: 2}}>
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button className="faq-question" onClick={() => handleFaqToggle(index)}>
                  {faq.question}
                  <span className="faq-icon" style={{backgroundColor: '#fff', border: '2px solid #211509', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{activeFaq === index ? '-' : '+'}</span>
                </button>
                {activeFaq === index && <div className="faq-answer"><p>{faq.answer}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <h2>TRY <span>zoooom</span></h2>
          <h3 style={{textAlign: 'center'}}>SUBSCRIBE TO NEWSLETTER and get a bonus:<br/><span>10% off</span> your next order!</h3>
          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <input 
              type="text" 
              placeholder="Your Name" 
              required 
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px'}}>
              <input type="radio" id="privacy" required style={{width: 'auto'}} />
              <label htmlFor="privacy">I agree with Privacy Policy</label>
            </div>
            <button type="submit" className="btn-submit" style={{marginTop: '20px'}}>Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  );
}
