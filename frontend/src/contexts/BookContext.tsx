import { createContext, useContext, useEffect, useState } from "react";
import { bookAPI } from "../services/api/books";
import useUserContext from "./UserContext";
const BookContext = createContext<any>(null);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { cartItems } = useUserContext();
  const [book, setBook] = useState(null);
  const [books, setBooks] = useState([]);
  useEffect(() => {
    if (book) {
      setBook((prevBook: any) =>
        cartItems.some((cartItem: any) => cartItem.book.id === prevBook.id)
          ? { ...prevBook, is_in_my_cart: true }
          : { ...prevBook, is_in_my_cart: false }
      );
    }
    if (books && books.length) {
      setBooks((prevBooks: any) =>
        prevBooks.map((prevBook: any) =>
          cartItems.some((cartItem: any) => cartItem.book.id === prevBook.id)
            ? { ...prevBook, is_in_my_cart: true }
            : { ...prevBook, is_in_my_cart: false }
        )
      );
    }
  }, [cartItems]);
  const contextData = {
    book,
    setBook,
    books,
    setBooks,
  };

  return (
    <BookContext.Provider value={contextData}>{children}</BookContext.Provider>
  );
};

const useBookContext = () => useContext(BookContext);
export default useBookContext;
