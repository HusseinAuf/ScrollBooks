import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { booksAPI } from "../../../../services/api/books";
import { reviewService } from "../../../../services/api/reviews";
import { useQuery } from "@tanstack/react-query";
import EditableStarRating from "../../../../components/shared/StartRating/EditableStarRating/EditableStarRating";
import Button from "../../../../components/common/buttons/Button";
import { FaHeartCirclePlus } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import BookReviewList from "./BookReviewList/BookReviewList";
import AddReviewModal from "./AddReviewModal/AddReviewModal";
import useCommonDataContext from "../../../../contexts/CommonDataContext";

interface BookDetailProps {
  bookID: string;
}

const BookDetail: React.FC<BookDetailProps> = ({ bookID }) => {
  const { currenciesMap } = useCommonDataContext();
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const {
    data: book,
    isLoading: isLoadingBook,
    isFetching: isFetchingBook,
    isError: isErrorBook,
    error: errorBook,
    refetch,
  } = useQuery({
    queryKey: ["books", bookID],
    queryFn: () => booksAPI.getBook(bookID),
    select: (data: any) => data?.data?.data || null,
  });

  const handleAddToCart = () => {
    alert(`Added ${book?.title} to cart!`);
  };

  const handleAddToFavorites = () => {
    alert(`Added ${book?.title} to favorites!`);
  };

  const handleSubmitReview = async (data: object) => {
    if (book?.my_review) {
      try {
        await reviewService.updateReview(bookID, book.my_review.id, data);
        refetch();
      } catch {
        /**/
      }
    } else {
      try {
        await reviewService.createReview(book.id, data);
        refetch();
      } catch {
        /**/
      }
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row gap-y-6 gap-x-8">
        {/* Book Cover */}
        <div className="sm:w-[25%]">
          <img
            src={book.cover_image}
            alt={book.title}
            className="w-full rounded-lg shadow-xl border border-4 border-lightBlue"
          />
        </div>

        {/* Book Details */}
        <div className="flex flex-col gap-4 md:w-2/3">
          <h1 className="text-4xl font-bold">{book.title}</h1>
          <p className="text-gray-700">{book.description}</p>
          <div className="flex items-center">
            <span className="text-yellow-500">
              ⭐ {book.average_rating.toFixed(1)}
            </span>
            <span className="ml-2 text-gray-600">({book.published_date})</span>
          </div>
          <p className="text-gray-600">
            Author:{" "}
            <span className="font-semibold text-mediumBlue underline italic">
              {book.user.name}
            </span>
          </p>
          {/* <p className="text-2xl font-bold">${book.price}</p> */}
          <span className="text-lg font-bold text-darkBlue bg-xLightBlue p-3 w-fit rounded-full">
            {currenciesMap[book.currency]} {book.price}
          </span>
          <div className="flex space-x-2 mb-4">
            {book.categories.map((category: any) => (
              <span
                key={category.id}
                className="bg-gray-200 px-2 py-1 rounded-full text-sm"
              >
                {category.display_name}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleAddToCart}>
              Add to Cart <FaShoppingCart className="w-5 h-5" />
            </Button>
            <Button className="bg-pink-600" onClick={handleAddToFavorites}>
              Add to Favorite <FaHeartCirclePlus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* My Review Section */}
      <div className="flex flex-col gap-8 mt-8">
        <div className="flex items-center gap-3">
          <div className="text-yellow-500 text-lg">
            ⭐ {book?.my_review?.rating}
          </div>
          <Button onClick={() => setIsAddReviewModalOpen(true)}>
            {book.my_review ? "Update My Review" : "Add Review"}
          </Button>
        </div>
        <AddReviewModal
          isOpen={isAddReviewModalOpen}
          setIsOpen={setIsAddReviewModalOpen}
          onSubmitReview={handleSubmitReview}
          review={book.my_review}
        />
        {/* Users Reviews Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <BookReviewList bookID={bookID} />
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
