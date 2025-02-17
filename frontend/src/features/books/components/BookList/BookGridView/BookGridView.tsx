import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { format, parseISO } from "date-fns";
import { IoPersonCircleOutline } from "react-icons/io5";
import UneditableStarRating from "../../../../../components/shared/StartRating/UneditableStarRating/UneditableStarRating";
import Button from "../../../../../components/common/buttons/Button";
import { FaShoppingCart } from "react-icons/fa";

interface BookGridViewProps {
  books: any[];
  isFetching: boolean;
}

const BookGridView: React.FC<BookGridViewProps> = ({ isFetching, books }) => {
  const navigate = useNavigate();
  return (
    <>
      {!books || isFetching ? (
        <div className="w-16 h-16 self-center border-4 border-darkBlue border-t-transparent border-solid rounded-full animate-spin"></div>
      ) : !books.length ? (
        <div className="px-4 py-6 text-center align-middle font-semibold text-gray-500">
          No Books
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2 pb-8">
          {books.map((book) => (
            <div
              key={book.id}
              className="relative flex flex-col items-center gap-y-3 text-sm bg-white shadow-xl text-black p-2 md:p-4 rounded-lg shadow-md w-full"
              onClick={() => {
                navigate(`/books/${book.id}`);
              }}
            >
              <div className="relative w-full pt-[150%] bg-gray-200">
                <img
                  src={book.cover_image}
                  alt="Image"
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1 items-center font-semibold">
                {/* <div className=""> */}
                <h2 className="text-darkBlue text-center">{book.title}</h2>
                {/* </div> */}
                <div className="font-semibold text-mediumBlue">
                  {/* Author:{" "} */}
                  <span className="underline italic">{book.user.name}</span>
                </div>
                <UneditableStarRating
                  rating={book.average_rating}
                  ratingCount={book.review_count}
                  size="sm"
                />
                <div className="flex gap-x-2">
                  <div className="bg-xLightBlue p-2 rounded-full text-xs truncate text-darkBlue">
                    {book.price} {book.currency}
                  </div>
                  {/* <div className="bg-darkBlue px-3 py-2 rounded-full text-xs truncate text-xLightBlue">
                    Add to Cart
                  </div> */}
                </div>
                <div className="absolute -top-1 -right-4">
                  <Button className="text-xs !px-4 !py-2">
                    Add to Cart <FaShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {/* <div className="flex flex-col">
                <p className="truncate">
                Published Date:{" "}
                {book.published_date
                  ? format(parseISO(book.published_date), "dd.MM.yyyy")
                  : ""}
              </p>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BookGridView;
