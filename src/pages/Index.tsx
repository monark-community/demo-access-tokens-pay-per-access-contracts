
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
// import AssetMarketplace from '../components/AssetMarketplace';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <Hero />
      <Features />
      {/* <AssetMarketplace /> */}
      <Footer />
    </div>
  );
};

export default Index;
