import React from 'react';

const ProductCard = ({ product, onCompare }) => {
  const renderSpecs = () => {
    if (!product) return null;

    // Filter out fields we don't want to display
    const excludeFields = [
      'Image', 
      'Title', 
      'nx9bqj', 
      'yray8j', 
      'exchange', 
      'offers',
      'url',
      'URL',
      'link',
      'Link',
      'Add to Compare',
      'Save extra with combo offers',
      'Bank Offer'
    ];

    // Get all fields from the product object
    return Object.entries(product).map(([key, value]) => {
      // Skip excluded fields and non-string/number values
      if (excludeFields.includes(key) || 
          typeof value === 'object' || 
          typeof value === 'boolean' || 
          value === null ||
          (typeof value === 'string' && value.startsWith('http'))) {
        return null;
      }

      // If the value includes "Free delivery", stop here
      if (typeof value === 'string' && 
          value.toLowerCase().includes('free delivery')) {
        return null;
      }

      return (
        <div key={key} className="feature-item">
          {value}
        </div>
      );
    }).filter(Boolean); // Remove null values
  };

  return (
    <div className="product-card">
      <img src={product.Image} alt={product.Title} />
      <div className="product-info">
        <h3>{product.Title?.split('Ratings')[0].trim()}</h3>
        
        <div className="rating">
          <span>4.6</span>
          <span>★</span>
        </div>

        <div className="price-section">
          <span className="current-price">{product.nx9bqj}</span>
          {product.yray8j && (
            <>
              <span className="original-price">{product.yray8j}</span>
              <span className="discount">16% off</span>
            </>
          )}
        </div>
        
        <div className="offers-section">
          <div className="offer-item">
            <span>
              <span role="img" aria-label="exchange">↔️</span>
              Upto ₹32,950 Off on Exchange
            </span>
          </div>
          <div className="offer-item">
            <span>
              <span role="img" aria-label="gift">🎁</span>
              Save extra with combo offers
            </span>
          </div>
        </div>

        <div className="features-section">
          {renderSpecs()}
        </div>

        <button className="compare-button" onClick={() => onCompare(product)}>
          Compare Prices
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
