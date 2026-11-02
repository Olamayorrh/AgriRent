import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ValueProposition from "../components/ValueProposition";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <ValueProposition />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default LandingPage;
