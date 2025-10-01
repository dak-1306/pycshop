import React, { useState, useEffect } from "react";
import "./Banner.css";
import newAccountSaleIMG from "../../images/banners/new_account_sale.png";
import superSale1010 from "../../images/banners/sale_10_10.png";
import sundaySale from "../../images/banners/sunday_sale.png";
import extraVoucherWeekend from "../../images/banners/extra_voucher_weekend.png";
import bannerSide from "../../images/banners/1010_banner_side.png";
import bannerSide2 from "../../images/banners/1010_banner_side_2.png";
const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      image: newAccountSaleIMG,
      alt: "Sale 50%",
    },
    {
      id: 2,
      image: superSale1010,
      alt: "Free Shipping",
    },
    {
      id: 3,
      image: sundaySale,
      alt: "New Arrivals",
    },
    {
      id: 4,
      image: extraVoucherWeekend,
      alt: "Best Deals",
    },
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
                  className={`banner-slide ${
                    index === currentSlide ? "active" : ""
                  }`}
                >
                  <img src={banner.image} alt={banner.alt} />
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button className="banner-nav prev" onClick={goToPrevSlide}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button className="banner-nav next" onClick={goToNextSlide}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="banner-dots">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>

          {/* Side Banners */}
          <div className="side-banners">
            <div className="side-banner">
              <img src={bannerSide} alt="Flash Sale" />
            </div>
            <div className="side-banner">
              <img src={bannerSide2} alt="Voucher" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
