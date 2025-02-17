import React, { useState } from "react";

interface FiveStarRatingProps {
  rating: number; // (0 to 5)
  onRatingChange: (newRating: number) => void;
  size?: "sm" | "md" | "lg";
}

const EditableStarRating: React.FC<FiveStarRatingProps> = ({
  rating,
  onRatingChange,
  size = "md",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (newRating: number) => {
    onRatingChange(newRating);
  };

  const handleMouseEnter = (newRating: number) => {
    setHoverRating(newRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
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

  // Determine star color based on rating and hover state
  const getStarColor = (starNumber: number) => {
    if (hoverRating >= starNumber) {
      return "text-yellow-400"; // Hovered star
    } else if (!hoverRating && rating >= starNumber) {
      return "text-yellow-400"; // Active star
    } else {
      return "text-gray-300"; // Inactive star
    }
  };

  return (
    <div className={`flex justify-center ${getStarSize()} `}>
      {[1, 2, 3, 4, 5].map((starNumber) => (
        <span
          key={starNumber}
          className={`cursor-pointer transition-all duration-200 hover:scale-110 ${getStarColor(
            starNumber
          )} `}
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

export default EditableStarRating;
