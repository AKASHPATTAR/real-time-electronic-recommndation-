import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import ComparisonPage from './components/ComparisonPage';
import ProductCard from './components/ProductCard';
import NotFound from './components/NotFound';
import config from './config';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('mobile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${config.apiBaseUrl}/api/products/${selectedCategory}`);
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleCompareClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseComparison = () => {
    setSelectedProduct(null);
  };

  const handleInfoClick = () => {
    setShowInfo(true);
  };

  const closeInfo = () => {
    setShowInfo(false);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={
            <>
              {selectedProduct ? (
                <ComparisonPage
                  product={selectedProduct}
                  onClose={handleCloseComparison}
                />
              ) : (
                <>
                  <header>
                    <h1>REAL - TIME ELECTRONIC RECOMMENDATION SYSTEM WITH ONLINE AND OFFLINE DATA INTEGRATION</h1>
                    <div className="category-buttons">
                      <button
                        onClick={handleInfoClick}
                        className="info-button"
                        title="System Information"
                      >
                        Information ℹ️
                      </button>
                      {showInfo && (
                        <div className="info-modal">
                          <div className="info-modal-content">
                            <h2>About the System</h2>
                            <div className="info-description">
                              Welcome to our advanced Electronic Recommendation System that seamlessly integrates online and offline data to provide intelligent product recommendations and protect users from fraudulent reviews.
                            </div>

                            <div className="info-section">
                              <h3>Key Features:</h3>

                              <div className="feature-group">
                                <h4>AI-Powered Recommendations</h4>
                                <div className="feature-details">
                                  <p>Powered by Google's Gemini AI technology</p>
                                  <p>Personalized suggestions based on user preferences</p>
                                  <p>Smart learning from user interactions</p>
                                </div>
                              </div>

                              <div className="feature-group">
                                <h4>Fake Review Detection</h4>
                                <div className="feature-details">
                                  <p>Advanced NLP for review authenticity analysis</p>
                                  <p>Sentiment analysis to verify emotional content</p>
                                  <p>Pattern recognition for fake review identification</p>
                                  <p>User behavior analysis for credibility scoring</p>
                                </div>
                              </div>

                              <div className="feature-group">
                                <h4>Product Comparison</h4>
                                <div className="feature-details">
                                  <p>Side-by-side feature comparison</p>
                                  <p>Price history tracking</p>
                                  <p>Specification matching</p>
                                  <p>Real-time availability checks</p>
                                </div>
                              </div>

                              <div className="feature-group">
                                <h4>Data Integration</h4>
                                <div className="feature-details">
                                  <p>Real-time online price tracking</p>
                                  <p>Offline store inventory integration</p>
                                  <p>User review aggregation</p>
                                  <p>Cross-platform data synthesis</p>
                                </div>
                              </div>
                            </div>

                            <div className="info-section">
                              <h3>How It Works</h3>
                              <div className="steps">
                                <p>1. Select your desired product category (Mobiles, Laptops, or Washing Machines)</p>
                                <p>2. Browse through available products with verified reviews</p>
                                <p>3. Use the "Get Recommendation" button for AI-powered suggestions</p>
                                <p>4. Compare products to make informed decisions</p>
                                <p>5. View detailed specifications and authentic reviews</p>
                              </div>
                            </div>

                            <div className="info-section">
                              <h3>Technology Stack</h3>
                              <div className="tech-details">
                                <p>Frontend: React.js with modern UI components</p>
                                <p>AI: Google Gemini for intelligent recommendations</p>
                                <p>NLP: Advanced algorithms for review analysis</p>
                                <p>Data Processing: Real-time integration and analysis</p>
                              </div>
                            </div>

                            <button onClick={closeInfo} className="close-button">Close</button>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          window.open('http://localhost:5174', '_blank', 'noopener,noreferrer');
                        }}
                        className="recommendation-button"
                        title="AI Based Electronic Recommendation"
                      >
                        Get Recommendation 🤖
                      </button>
                      <button
                        onClick={() => setSelectedCategory('laptop')}
                        className={selectedCategory === 'laptop' ? 'active' : ''}
                      >
                        Laptops
                      </button>
                      <button
                        onClick={() => setSelectedCategory('mobile')}
                        className={selectedCategory === 'mobile' ? 'active' : ''}
                      >
                        Mobiles
                      </button>
                      <button
                        onClick={() => setSelectedCategory('washingmachine')}
                        className={selectedCategory === 'washingmachine' ? 'active' : ''}
                      >
                        Washing Machines
                      </button>
                    </div>
                  </header>

                  {loading && <div className="loading">Loading...</div>}
                  {error && <div className="error">Error: {error}</div>}

                  <div className="products-list">
                    {products.map((product, index) => (
                      <ProductCard
                        key={index}
                        product={product}
                        onCompare={handleCompareClick}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
