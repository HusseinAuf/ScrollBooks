import React, { useState } from "react";

interface FiveStarRatingProps {
  rating: number; // (0 to 5)
  ratingCount: number;
  size?: "sm" | "md" | "lg";
}

const UneditableStarRating: React.FC<FiveStarRatingProps> = ({
  rating,
  ratingCount,
  size = "md",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getStarSize = () => {
    switch (size) {
      case "sm":
        return "text-xl";
      case "md":
        return "text-3xl";
      case "lg":
        return "text-5xl";
      default:
        return "text-3xl";
    }
  };

  const getStarColor = (starNumber: number) => {
    if (rating >= starNumber) {
      return "text-yellow-400"; // Active star
    } else {
      return "text-gray-300"; // Inactive star
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`flex justify-center cursor-default ${getStarSize()}`}>
        {[1, 2, 3, 4, 5].map((starNumber) => (
          <span key={starNumber} className={`${getStarColor(starNumber)} `}>
            ★
          </span>
        ))}
      </div>
      <div
        className={`absolute bottom-[100%] left-0 ${
          isHovered ? "block" : "hidden"
        } text-yellow-600 font-semibold bg-white shadow-lg rounded-lg px-3 py-2 transform transition-all duration-300`}
      >
        {rating.toFixed(1)}{" "}
        <span className="text-mediumBlue font-medium">({ratingCount})</span>
      </div>
    </div>
  );
};

export default UneditableStarRating;
