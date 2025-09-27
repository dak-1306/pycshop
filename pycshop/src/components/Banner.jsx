import React, { useState, useEffect } from 'react';
import './Banner.css';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      id: 1,
      image: 'https://via.placeholder.com/800x300/ee4d2d/ffffff?text=Sale+50%25+All+Items',
      alt: 'Sale 50%'
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/800x300/ff6b35/ffffff?text=Free+Shipping',
      alt: 'Free Shipping'
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/800x300/f7931e/ffffff?text=New+Arrivals',
      alt: 'New Arrivals'
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/800x300/28a745/ffffff?text=Best+Deals',
      alt: 'Best Deals'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="banner-section">
      <div className="container">
        <div className="banner-wrapper">
          {/* Main Banner Slider */}
          <div className="banner-slider">
            <div className="banner-container">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
                >
                  <img src={banner.image} alt={banner.alt} />
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button className="banner-nav prev" onClick={goToPrevSlide}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            <button className="banner-nav next" onClick={goToNextSlide}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="banner-dots">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>

          {/* Side Banners */}
          <div className="side-banners">
            <div className="side-banner">
              <img 
                src="https://via.placeholder.com/200x145/6c5ce7/ffffff?text=Flash+Sale" 
                alt="Flash Sale"
              />
            </div>
            <div className="side-banner">
              <img 
                src="https://via.placeholder.com/200x145/a29bfe/ffffff?text=Voucher" 
                alt="Voucher"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;