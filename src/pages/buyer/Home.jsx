import React, { useState } from "react";
import Header from "../../components/buyers/Header";
import Banner from "../../components/buyers/Banner";
import Categories from "../../components/buyers/Categories";
import ProductGrid from "../../components/buyers/ProductGrid";
import Footer from "../../components/buyers/Footer";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSearch = (query) => {
    console.log("🔍 [HOME] handleSearch called with:", query);
    setSearchQuery(query);
    setSelectedCategory(null); // Clear category filter when searching
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
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      <Footer />
    </div>
  );
};

export default HomePage;
