import React from "react";

const TextAnimate = ({
  children,
  animation = "slideUp",
  by = "word",
  className = "",
  delay = 0.1,
}) => {
  // Handle both string and JSX children
  const getTextContent = (element) => {
    if (typeof element === "string") {
      return element;
    }
    if (React.isValidElement(element)) {
      return React.Children.toArray(element.props.children)
        .map((child) =>
          typeof child === "string" ? child : getTextContent(child),
        )
        .join("");
    }
    if (Array.isArray(element)) {
      return element.map((child) => getTextContent(child)).join("");
    }
    return "";
  };

  const text = getTextContent(children);

  if (by === "word" && text) {
    const words = text.split(" ");

    return (
      <span className={`inline-block ${className}`}>
        {words.map((word, index) => (
          <span
            key={index}
            className={`inline-block ${getAnimationClass(animation)}`}
            style={{
              animationDelay: `${index * delay}s`,
              animationFillMode: "both",
            }}
          >
            {word}
            {index < words.length - 1 && "\u00A0"}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span
      className={`inline-block ${getAnimationClass(animation)} ${className}`}
      style={{ animationFillMode: "both" }}
    >
      {children}
    </span>
  );
};

const getAnimationClass = (animation) => {
  switch (animation) {
    case "slideUp":
      return "animate-slide-up";
    case "fadeIn":
      return "animate-fade-in";
    case "slideDown":
      return "animate-slide-down";
    default:
      return "animate-slide-up";
  }
};

export { TextAnimate };
