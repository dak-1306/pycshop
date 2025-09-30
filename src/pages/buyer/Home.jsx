import React from "react";
import Header from "../../components/buyers/Header";
import Banner from "../../components/buyers/Banner";
import Categories from "../../components/buyers/Categories";
import ProductGrid from "../../components/buyers/ProductGrid";
import Footer from "../../components/buyers/Footer";

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
