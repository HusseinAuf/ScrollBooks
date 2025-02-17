import React, { useState } from "react";

interface FiveStarRatingProps {
  rating: number; // (0 to 5)
  editable?: boolean;
  onRatingChange?: (newRating: number) => void;
  handleMouseEnter?: () => void;
  handleMouseLeave?: () => void;
  size?: "sm" | "md" | "lg"; // Size prop for controlling star size
}

const StarRating: React.FC<FiveStarRatingProps> = ({
  rating,
  onRatingChange,
  editable = false,
  size = "md",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  // Handle star click
  const handleClick = (newRating: number) => {
    if (editable && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  // Handle hover over stars
  const handleMouseEnter = (newRating: number) => {
    setHoverRating(newRating);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  // Determine star size based on the `size` prop
  const getStarSize = () => {
    switch (size) {
      case "sm":
        return "text-xl"; // Small size
      case "md":
        return "text-3xl"; // Medium size
      case "lg":
        return "text-5xl"; // Large size
      default:
        return "text-3xl"; // Default to medium
    }
  };

  // Determine star color based on rating and hover state
  const getStarColor = (starNumber: number) => {
    if (editable) {
      if (hoverRating >= starNumber) {
        return "text-yellow-400"; // Hovered star
      } else if (!hoverRating && rating >= starNumber) {
        return "text-yellow-400"; // Active star
      } else {
        return "text-gray-300"; // Inactive star
      }
    } else {
      if (rating >= starNumber) {
        return "text-yellow-400"; // Active star
      } else {
        return "text-gray-300"; // Inactive star
      }
    }
  };

  return (
    <div className={`flex justify-center ${getStarSize()} `}>
      {[1, 2, 3, 4, 5].map((starNumber) => (
        <span
          key={starNumber}
          className={`${
            editable
              ? "cursor-pointer transition-all duration-200 hover:scale-110"
              : ""
          } ${getStarColor(starNumber)} `}
          onClick={() => handleClick(starNumber)}
          onMouseEnter={() => handleMouseEnter(starNumber)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
