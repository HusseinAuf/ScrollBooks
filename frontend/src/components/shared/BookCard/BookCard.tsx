import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UneditableStarRating from "../StartRating/UneditableStarRating/UneditableStarRating";
import { FaHeart } from "react-icons/fa";
import Button from "../../common/button/Button";
import { BiSolidCartAdd } from "react-icons/bi";
import useBookContext from "../../../contexts/BookContext";
import useUserContext from "../../../contexts/UserContext";
import { userAPI } from "../../../services/api/auth";
import { cartAPI } from "../../../services/api/cartItems";
import { useActionGuard } from "../../../hooks/useActionGuard";

interface BookCardProps {
  book: any;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { user, setCartItems } = useUserContext();
  const actionGuard = useActionGuard();
  const { books, setBooks } = useBookContext();

  const handleAddToCart = async () => {
    try {
      const response = await cartAPI.createCartItem({ book_id: book.id });
      setCartItems((prevCartItems: any) => [...prevCartItems, response.data]);
    } catch {
      /**/
    }
  };

  const handleAddToFavorites = async () => {
    try {
      const data = {
        add_favorite_books: [book.id],
      };
      await userAPI.updateUser(user.id, data);
      setBooks((books: any) =>
        books.map((bookItem: any) =>
          bookItem.id == book.id
            ? { ...bookItem, is_in_my_favorites: true }
            : bookItem
        )
      );
    } catch {
      /**/
    }
  };

  const handleRemoveFromFavorites = async () => {
    try {
      const data = {
        remove_favorite_books: [book.id],
      };
      await userAPI.updateUser(user.id, data);
      setBooks((books: any) =>
        books.map((bookItem: any) =>
          bookItem.id == book.id
            ? { ...bookItem, is_in_my_favorites: false }
            : bookItem
        )
      );
    } catch {
      /**/
    }
  };

  return (
    <div className="relative">
      <Link
        className="flex flex-col items-center gap-y-3 text-sm bg-white shadow-xl text-black p-2 md:p-4 rounded-lg shadow-md w-full h-full"
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
          <h2 className="text-darkBlue text-center">{book.title}</h2>
          <div className="font-semibold text-mediumBlue">
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
            <button
              onClick={(event) => {
                event.preventDefault();
                book.is_in_my_favorites
                  ? actionGuard(handleRemoveFromFavorites)
                  : actionGuard(handleAddToFavorites);
              }}
            >
              <FaHeart
                className={`w-6 h-6 bg-white p-1 z-100 ${
                  book.is_in_my_favorites ? "text-pink-400" : "text-gray-300"
                }
     transition-all duration-100 border border-2 border-pink-400 rounded-full`}
              />
            </button>
          </div>
        </div>
      </Link>
      <div className="absolute -top-1 -right-1">
        {!book.is_in_my_library ? (
          <Button
            onClick={() => actionGuard(handleAddToCart)}
            className={`text-xs !px-4 !py-2  ${
              !book?.is_in_my_cart ? "opacity-100" : "opacity-0"
            }`}
          >
            <BiSolidCartAdd className="w-5 h-5" />
          </Button>
        ) : (
          <div className="text-xs text-white font-bold rounded-full bg-gradient-to-r from-mediumBlue to-lightBlue px-4 py-2">
            Owned
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
