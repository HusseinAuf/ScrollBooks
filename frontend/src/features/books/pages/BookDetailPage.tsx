import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bookAPI } from "../../../services/api/books";
import { reviewService } from "../../../services/api/reviews";
import { useQuery } from "@tanstack/react-query";
import Button from "../../../components/common/buttons/Button";
import { FaHeartCirclePlus } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import BookReviewList from "../components/BookDetail/BookReviewList/BookReviewList";
import AddReviewModal from "../components/BookDetail/AddReviewModal/AddReviewModal";
import useCommonDataContext from "../../../contexts/CommonDataContext";
import { cartAPI } from "../../../services/api/cartItems";
import useUserContext from "../../../contexts/UserContext";
import { useQueryClient } from "@tanstack/react-query";
import useBookContext from "../../../contexts/BookContext";
import Loading from "../../../components/common/Loading/Loading";
import { userService } from "../../../services/api/auth";
import { FaHeart } from "react-icons/fa";

const BookDetailPage: React.FC = () => {
  const { id } = useParams();
  const bookID = Number(id);
  const queryClient = useQueryClient();
  const { book, setBook } = useBookContext();
  const { currenciesMap } = useCommonDataContext();
  const { user, cartItems, setCartItems, fetchCartItems } = useUserContext();
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["books", bookID],
    queryFn: () => bookAPI.getBook(bookID),
  });

  useEffect(() => {
    if (data) {
      setBook(data);
    }
  }, [data]);

  const handleAddToCart = async (bookID: number) => {
    try {
      const response = await cartAPI.createCartItem({ book_id: bookID });
      setCartItems((prevCartItems: any) => [...prevCartItems, response.data]);
    } catch {
      /**/
    }
  };

  const handleRemoveFromCart = async (bookID: number) => {
    try {
      const cartItem = cartItems.filter(
        (item: any) => item.book.id === bookID
      )[0];
      await cartAPI.deleteCartItem(cartItem.id);
      setCartItems((prevCartItems: any) =>
        prevCartItems.filter(
          (prevCartItem: any) => prevCartItem.id !== cartItem.id
        )
      );
    } catch {
      /**/
    }
  };

  const handleAddToFavorites = async () => {
    try {
      const data = {
        add_favorite_book: [book.id],
      };
      const response = await userService.updateUser(user.id, data);
      setBook((book: any) => ({ ...book, is_in_my_favorites: true }));
    } catch {
      /**/
    }
  };

  const handleRemoveFromFavorites = async () => {
    try {
      const data = {
        remove_favorite_book: [book.id],
      };
      const response = await userService.updateUser(user.id, data);
      setBook((book: any) => ({ ...book, is_in_my_favorites: false }));
    } catch {
      /**/
    }
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

  if (!book || isFetching) {
    return (
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  console.log(book);
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
          <div className="flex gap-4">
            <span className="text-lg font-bold text-darkBlue bg-xLightBlue p-3 w-fit rounded-full">
              {currenciesMap[book.currency]} {book.price}
            </span>
            <button
              onClick={() =>
                book.is_in_my_favorites
                  ? handleRemoveFromFavorites()
                  : handleAddToFavorites()
              }
            >
              <FaHeart
                className={`w-10 h-10 p-2 ${
                  book.is_in_my_favorites ? "text-pink-400" : "text-gray-300"
                }
                 transition-all duration-100 border border-2 border-pink-400 rounded-full`}
              />
            </button>
          </div>
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
            <Button
              className={`${book.is_in_my_cart ? " !bg-darkBlue " : ""}`}
              onClick={() =>
                !book.is_in_my_cart
                  ? handleAddToCart(book.id)
                  : handleRemoveFromCart(book.id)
              }
            >
              {book.is_in_my_cart ? "Remove from Cart" : "Add to Cart"}
              <FaShoppingCart className="w-5 h-5" />
            </Button>
            {/* <Button
              className="bg-pink-600"
              onClick={() =>
                book.is_in_my_favorites
                  ? handleRemoveFromFavorites()
                  : handleAddToFavorites()
              }
            >
              {book.is_in_my_favorites
                ? "Remove From Favorites"
                : "Add to Favorites"}
              <FaHeartCirclePlus className="w-5 h-5" />
            </Button> */}
          </div>
        </div>
      </div>

      {/* My Review Section */}
      <div className="flex flex-col gap-8 mt-8">
        <div className="flex items-center gap-3">
          {book.my_review && (
            <div className="text-yellow-500 text-lg">
              ⭐ {book?.my_review?.rating}
            </div>
          )}
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

export default BookDetailPage;
