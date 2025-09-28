import React from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import Categories from "../components/Categories";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <Banner />
      <Categories />
      <ProductGrid />
      <Footer />
    </div>
  );
};

export default HomePage;
