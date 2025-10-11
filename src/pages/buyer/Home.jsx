import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/buyers/Header";
import Banner from "../../components/buyers/Banner";
import Categories from "../../components/buyers/Categories";
import ProductGrid from "../../components/buyers/ProductGrid";
import Footer from "../../components/buyers/Footer";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSearch = (query) => {
    console.log("🔍 [HOME] handleSearch called with:", query);
    // Navigate to search results page instead of updating local state
    if (query.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCategorySelect = (categoryId) => {
    console.log("🏷️ [HOME] handleCategorySelect called with:", categoryId);
    setSelectedCategory(categoryId);
    setSearchQuery(""); // Clear search when selecting category
  };

  return (
    <div className="home-page">
      <Header onSearch={handleSearch} />
      <Banner />
      <Categories
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      <ProductGrid
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      <Footer />
    </div>
  );
};

export default HomePage;
