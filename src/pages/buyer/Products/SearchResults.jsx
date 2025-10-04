import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../components/buyers/Header';
import Footer from '../../../components/buyers/Footer';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [rating, setRating] = useState(0);
  const [shipping, setShipping] = useState('all');
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    // Mock data - sẽ thay bằng API call thực tế
    const mockProducts = [
      {
        id: 1,
        name: 'Áo thun nam basic cotton',
        price: 199000,
        originalPrice: 299000,
        image: 'https://via.placeholder.com/200x200',
        rating: 4.5,
        reviews: 1234,
        sold: 5600,
        category: 'fashion',
        brand: 'Brand A',
        freeShipping: true,
        discount: 33
      },
      {
        id: 2,
        name: 'Điện thoại smartphone cao cấp',
        price: 8999000,
        originalPrice: 12999000,
        image: 'https://via.placeholder.com/200x200',
        rating: 4.8,
        reviews: 892,
        sold: 234,
        category: 'electronics',
        brand: 'Brand B',
        freeShipping: true,
        discount: 31
      },
      {
        id: 3,
        name: 'Túi xách nữ thời trang',
        price: 450000,
        originalPrice: 650000,
        image: 'https://via.placeholder.com/200x200',
        rating: 4.2,
        reviews: 567,
        sold: 1234,
        category: 'fashion',
        brand: 'Brand C',
        freeShipping: false,
        discount: 31
      },
      {
        id: 4,
        name: 'Laptop gaming chuyên nghiệp',
        price: 15999000,
        originalPrice: 19999000,
        image: 'https://via.placeholder.com/200x200',
        rating: 4.7,
        reviews: 345,
        sold: 89,
        category: 'electronics',
        brand: 'Brand D',
        freeShipping: true,
        discount: 20
      },
      {
        id: 5,
        name: 'Giày sneaker nam nữ',
        price: 799000,
        originalPrice: 1199000,
        image: 'https://via.placeholder.com/200x200',
        rating: 4.3,
        reviews: 789,
        sold: 2345,
        category: 'fashion',
        brand: 'Brand E',
        freeShipping: true,
        discount: 33
      },
      {
        id: 6,
        name: 'Tai nghe bluetooth không dây',
        price: 299000,
        originalPrice: 499000,
        image: 'https://via.placeholder.com/200x200',
        rating: 4.1,
        reviews: 456,
        sold: 1789,
        category: 'electronics',
        brand: 'Brand F',
        freeShipping: false,
        discount: 40
      }
    ];

    // Tìm kiếm sản phẩm dựa trên keyword
    const searchResults = mockProducts.filter(product =>
      product.name.toLowerCase().includes(keyword.toLowerCase()) ||
      product.category.toLowerCase().includes(keyword.toLowerCase()) ||
      product.brand.toLowerCase().includes(keyword.toLowerCase())
    );
    
    setProducts(searchResults);
    setFilteredProducts(searchResults);

    // Cập nhật categories dựa trên kết quả tìm kiếm
    const categoriesData = [
      { id: 'all', name: 'Tất cả', count: searchResults.length },
      { id: 'fashion', name: 'Thời trang', count: searchResults.filter(p => p.category === 'fashion').length },
      { id: 'electronics', name: 'Điện tử', count: searchResults.filter(p => p.category === 'electronics').length }
    ];
    setCategories(categoriesData);
  }, [keyword]);

  useEffect(() => {
    let filtered = [...products];

    // Lọc theo danh mục
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Lọc theo giá
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Lọc theo đánh giá
    if (rating > 0) {
      filtered = filtered.filter(product => product.rating >= rating);
    }

    // Lọc theo miễn phí ship
    if (shipping === 'free') {
      filtered = filtered.filter(product => product.freeShipping);
    }

    // Sắp xếp
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'sold':
        filtered.sort((a, b) => b.sold - a.sold);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      default:
        // newest - giữ nguyên thứ tự
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange, rating, shipping, sortBy]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 1000000 });
    setRating(0);
    setShipping('all');
    setSortBy('newest');
  };

  const toggleSidebar = () => {
    if (sidebarVisible) {
      // Khi ẩn: animate sidebar trước, sau đó thay đổi grid
      setSidebarVisible(false);
      setTimeout(() => {
        // Grid layout sẽ thay đổi sau khi sidebar animation hoàn thành
      }, 300);
    } else {
      // Khi hiện: thay đổi grid trước, sau đó animate sidebar
      setSidebarVisible(true);
    }
  };

  return (
    <div className="sr-container">
      <Header />
      
      <div className="sr-content">
        <div className="sr-header">
          <div className="sr-breadcrumb">
            <span>Kết quả tìm kiếm cho</span>
            <strong>"{keyword}"</strong>
            <span>({filteredProducts.length} sản phẩm)</span>
          </div>
          
          <button className="sr-filter-toggle" onClick={toggleSidebar}>
            <i className={`fas ${sidebarVisible ? 'fa-times' : 'fa-filter'}`}></i>
            {sidebarVisible ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
        </div>

        <div className={`sr-main ${!sidebarVisible ? 'sidebar-hidden' : ''}`}>
          {/* Sidebar Filters */}
          <div className={`sr-sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
            <div className="sr-filter-section">
              <h3>Bộ lọc tìm kiếm</h3>
              <button className="sr-clear-filters" onClick={clearFilters}>
                Xóa tất cả
              </button>
            </div>

            {/* Categories */}
            <div className="sr-filter-section">
              <h4>Danh mục</h4>
              <div className="sr-category-list">
                {categories.map(category => (
                  <label key={category.id} className="sr-category-item">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span>{category.name} ({category.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="sr-filter-section">
              <h4>Khoảng giá</h4>
              <div className="sr-price-range">
                <input
                  type="number"
                  placeholder="₫ TỪ"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="₫ ĐẾN"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 1000000})}
                />
              </div>
              <div className="sr-price-shortcuts">
                <button onClick={() => setPriceRange({min: 0, max: 100000})}>Dưới 100k</button>
                <button onClick={() => setPriceRange({min: 100000, max: 300000})}>100k - 300k</button>
                <button onClick={() => setPriceRange({min: 300000, max: 500000})}>300k - 500k</button>
                <button onClick={() => setPriceRange({min: 500000, max: 1000000})}>500k - 1tr</button>
                <button onClick={() => setPriceRange({min: 1000000, max: 10000000})}>Trên 1tr</button>
              </div>
            </div>

            {/* Rating */}
            <div className="sr-filter-section">
              <h4>Đánh giá</h4>
              <div className="sr-rating-list">
                {[5, 4, 3].map(star => (
                  <label key={star} className="sr-rating-item">
                    <input
                      type="radio"
                      name="rating"
                      value={star}
                      checked={rating === star}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                    />
                    <div className="sr-stars">
                      {renderStars(star)}
                      <span>từ {star} sao</span>
                    </div>
                  </label>
                ))}
                <label className="sr-rating-item">
                  <input
                    type="radio"
                    name="rating"
                    value={0}
                    checked={rating === 0}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                  />
                  <span>Tất cả</span>
                </label>
              </div>
            </div>

            {/* Shipping */}
            <div className="sr-filter-section">
              <h4>Vận chuyển</h4>
              <div className="sr-shipping-list">
                <label className="sr-shipping-item">
                  <input
                    type="radio"
                    name="shipping"
                    value="all"
                    checked={shipping === 'all'}
                    onChange={(e) => setShipping(e.target.value)}
                  />
                  <span>Tất cả</span>
                </label>
                <label className="sr-shipping-item">
                  <input
                    type="radio"
                    name="shipping"
                    value="free"
                    checked={shipping === 'free'}
                    onChange={(e) => setShipping(e.target.value)}
                  />
                  <span>Miễn phí vận chuyển</span>
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="sr-main-content">
            {/* Sort Bar */}
            <div className="sr-sort-bar">
              <span>Sắp xếp theo</span>
              <div className="sr-sort-options">
                <button 
                  className={sortBy === 'newest' ? 'active' : ''}
                  onClick={() => setSortBy('newest')}
                >
                  Mới nhất
                </button>
                <button 
                  className={sortBy === 'sold' ? 'active' : ''}
                  onClick={() => setSortBy('sold')}
                >
                  Bán chạy
                </button>
                <button 
                  className={sortBy === 'price-asc' ? 'active' : ''}
                  onClick={() => setSortBy('price-asc')}
                >
                  Giá thấp đến cao
                </button>
                <button 
                  className={sortBy === 'price-desc' ? 'active' : ''}
                  onClick={() => setSortBy('price-desc')}
                >
                  Giá cao đến thấp
                </button>
                <button 
                  className={sortBy === 'rating' ? 'active' : ''}
                  onClick={() => setSortBy('rating')}
                >
                  Đánh giá cao
                </button>
                <button 
                  className={sortBy === 'discount' ? 'active' : ''}
                  onClick={() => setSortBy('discount')}
                >
                  Khuyến mãi hot
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="sr-products-grid">
              {filteredProducts.length === 0 ? (
                <div className="sr-no-results">
                  <i className="fas fa-search"></i>
                  <h3>Không tìm thấy sản phẩm</h3>
                  <p>Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc</p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="sr-product-card"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="sr-product-image">
                      <img src={product.image} alt={product.name} />
                      {product.discount > 0 && (
                        <div className="sr-discount-badge">
                          -{product.discount}%
                        </div>
                      )}
                      {product.freeShipping && (
                        <div className="sr-shipping-badge">
                          Freeship
                        </div>
                      )}
                    </div>
                    
                    <div className="sr-product-info">
                      <h3 className="sr-product-name">{product.name}</h3>
                      
                      <div className="sr-product-price">
                        <span className="sr-current-price">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="sr-original-price">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      <div className="sr-product-rating">
                        <div className="sr-stars">
                          {renderStars(product.rating)}
                        </div>
                        <span className="sr-rating-text">
                          ({product.reviews})
                        </span>
                      </div>
                      
                      <div className="sr-product-sold">
                        Đã bán {product.sold}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="sr-pagination">
                <button className="sr-page-btn">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="sr-page-btn active">1</button>
                <button className="sr-page-btn">2</button>
                <button className="sr-page-btn">3</button>
                <span>...</span>
                <button className="sr-page-btn">10</button>
                <button className="sr-page-btn">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;