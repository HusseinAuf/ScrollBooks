import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import useCommonDataContext from "../../../../../contexts/CommonDataContext";
import Button from "../../../../../components/common/buttons/Button";
import Select from "../../../../../components/common/Select/Select";
import EditableStarRating from "../../../../../components/shared/StartRating/EditableStarRating/EditableStarRating";
import TextArea from "../../../../../components/common/TextArea/TextArea";
import { reviewService } from "../../../../../services/api/reviews";

interface AddReviewModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  review: any;
  onSubmitReview: any;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  setIsOpen,
  review,
  onSubmitReview,
}) => {
  const [comment, setComment] = useState<string>(review?.comment ?? "");
  const [rating, setRating] = useState<number>(review?.rating ?? 0);
  const handleSubmitReview = async () => {
    const newReview = { rating, comment };
    await onSubmitReview(newReview);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 p-2">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-96 overflow-auto border border-4 border-mediumBlue">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-darkBlue font-bold">Add Your Review</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <div className="mt-4">
          {/* Add Comment Form */}
          <div className="mt-8 text-center">
            {/* <h3 className="text-xl font-bold mb-4">Add Your Comment</h3> */}
            {/* <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Write your comment..."
            /> */}
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Write your comment..."
            />
            <div className="flex items-center mb-4">
              <span className="mr-2 text-darkBlue">Rating:</span>
              <EditableStarRating
                rating={rating}
                onRatingChange={(newRating) => setRating(newRating)}
              />
            </div>
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;
