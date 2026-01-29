import { useEffect } from "react";

const MetaTags = ({ 
  title = "CodeSunny - Digital Solutions & Web Development",
  description = "Transform your business with modern web development, stunning design, and strategic digital marketing solutions.",
  keywords = "web development, UI/UX design, digital marketing, e-commerce, SEO, cloud solutions",
  image = "https://codesunny.com/og-image.png",
  url = "https://codesunny.com",
  type = "website"
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMeta = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const updateProperty = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard meta tags
    updateMeta("description", description);
    updateMeta("keywords", keywords);

    // Open Graph tags
    updateProperty("og:type", type);
    updateProperty("og:title", title);
    updateProperty("og:description", description);
    updateProperty("og:url", url);
    updateProperty("og:image", image);

    // Twitter Card tags
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", image);

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);
  }, [title, description, keywords, image, url, type]);

  return null;
};

export default MetaTags;
