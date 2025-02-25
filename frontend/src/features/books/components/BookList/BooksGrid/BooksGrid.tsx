import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { format, parseISO } from "date-fns";
import { IoPersonCircleOutline } from "react-icons/io5";
import UneditableStarRating from "../../../../../components/shared/StartRating/UneditableStarRating/UneditableStarRating";
import Button from "../../../../../components/common/buttons/Button";
import { FaShoppingCart } from "react-icons/fa";
import { cartAPI } from "../../../../../services/api/cartItems";
import useUserContext from "../../../../../contexts/UserContext";
import { useQueryClient } from "@tanstack/react-query";
import { FaHeart } from "react-icons/fa";
import { userService } from "../../../../../services/api/auth";
import useBookContext from "../../../../../contexts/BookContext";
import { BiSolidCartAdd } from "react-icons/bi";

interface BooksGridProps {
  isFetching: boolean;
  queryString: string;
}

const BooksGrid: React.FC<BooksGridProps> = ({ isFetching, queryString }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, fetchCartItems } = useUserContext();
  const { books, setBooks } = useBookContext();

  const handleAddToCart = async (bookID: number) => {
    try {
      await cartAPI.createCartItem({ book_id: bookID });
      queryClient.setQueriesData(
        { queryKey: ["books"], exact: false },
        (data: any) => {
          if (!data?.data) return;
          return {
            ...data,
            data: data.data.map((book: any) =>
              book.id === bookID ? { ...book, is_in_my_cart: true } : book
            ),
          };
        }
      );
      await fetchCartItems();
    } catch {
      /**/
    }
  };

  const handleAddToFavorites = async (bookID: number) => {
    try {
      const data = {
        add_favorite_book: [bookID],
      };
      const response = await userService.updateUser(user.id, data);
      setBooks((books: any) =>
        books.map((book: any) =>
          book.id == bookID ? { ...book, is_in_my_favorites: true } : book
        )
      );
    } catch {
      /**/
    }
  };

  const handleRemoveFromFavorites = async (bookID: number) => {
    try {
      const data = {
        remove_favorite_book: [bookID],
      };
      const response = await userService.updateUser(user.id, data);
      setBooks((books: any) =>
        books.map((book: any) =>
          book.id == bookID ? { ...book, is_in_my_favorites: false } : book
        )
      );
    } catch {
      /**/
    }
  };

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
          {books.map((book: any) => (
            <div key={book.id} className="relative">
              <Link
                key={book.id}
                className="flex flex-col items-center gap-y-3 text-sm bg-white shadow-xl text-black p-2 md:p-4 rounded-lg shadow-md w-full h-full"
                // onClick={() => {
                //   navigate(`/books/${book.id}`);
                // }}
                to={`/books/${book.id}`}
              >
                <div className="relative w-full pt-[150%] bg-gray-200 rounded-md border border-4 border-mediumBlue">
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
                  </div>
                </div>
              </Link>
              <div className="absolute -top-1 -left-1">
                <button
                  onClick={() =>
                    book.is_in_my_favorites
                      ? handleRemoveFromFavorites(book.id)
                      : handleAddToFavorites(book.id)
                  }
                >
                  <FaHeart
                    className={`w-10 h-10 bg-white p-2 ${
                      book.is_in_my_favorites
                        ? "text-pink-400"
                        : "text-gray-300"
                    }
                 transition-all duration-100 border border-2 border-pink-400 rounded-full`}
                  />
                </button>
              </div>
              <div className="absolute -top-1 -right-1">
                <Button
                  onClick={() => handleAddToCart(book.id)}
                  className={`text-xs !px-4 !py-2  ${
                    !book?.is_in_my_cart ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {/* Add to Cart */}
                  <BiSolidCartAdd className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BooksGrid;
