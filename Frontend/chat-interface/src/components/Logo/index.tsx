import React from "react";
import "./Logo.css";

interface LogoProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "medium" }) => {
  const sizeClasses = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-4xl",
  };

  return (
    <div className={`logo logo-glitch ${sizeClasses[size]} ${className}`}>
      <span style={{ color: "#00ff9d", textShadow: "0 0 10px rgba(0, 255, 157, 0.7)" }}>≥</span> n.e.x.u.s
    </div>
  );
};

export default Logo;
