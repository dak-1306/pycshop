import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/buyers/Header";
import Banner from "../../components/buyers/Banner";
import Categories from "../../components/buyers/Categories";
import ProductGrid from "../../components/buyers/ProductGrid";
import Footer from "../../components/buyers/Footer";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    console.log("🔍 [HOME] handleSearch called with:", query);
    // Navigate to search results page instead of updating local state
    if (query.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="home-page">
      <Header onSearch={handleSearch} />
      <Banner />
      <Categories />
      <ProductGrid />
      <Footer />
    </div>
  );
};

export default HomePage;
