import React from "react";
import Home from "../Components/Home";
import About from "../Components/About";
import Contact from "../Components/Contact";
import Services from "../Components/Services";
import WebDevelopment from "../Components/WebDevelopment";
import UiUxDesign from "../Components/UiUxDesign";
import DigitalMarketing from "../Components/DigitalMarketing";
import EcommerceSolutions from "../Components/EcommerceSolutions";
import SEOOptimization from "../Components/SEOOptimization";
import CloudSolutions from "../Components/CloudSolutions";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/web-development" element={<WebDevelopment />} />
        <Route path="/services/ui-ux-design" element={<UiUxDesign />} />
        <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
        <Route path="/services/ecommerce-solutions" element={<EcommerceSolutions />} />
        <Route path="/services/seo-optimization" element={<SEOOptimization />} />
        <Route path="/services/cloud-solutions" element={<CloudSolutions />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
