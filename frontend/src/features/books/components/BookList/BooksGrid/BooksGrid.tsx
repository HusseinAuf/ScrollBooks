import React, { useState } from "react";
import { cartAPI } from "../../../../../services/api/cartItems";
import useUserContext from "../../../../../contexts/UserContext";
import { userAPI } from "../../../../../services/api/auth";
import useBookContext from "../../../../../contexts/BookContext";
import BookCard from "../../../../../components/shared/BookCard/BookCard";
import Loading from "../../../../../components/common/Loading/Loading";

interface BooksGridProps {
  isFetching: boolean;
  queryString: string;
}

const BooksGrid: React.FC<BooksGridProps> = ({ isFetching, queryString }) => {
  // const { user, setCartItems } = useUserContext();
  const { books } = useBookContext();

  return (
    <>
      {!isFetching && !books?.length ? (
        <div className="px-4 py-6 text-center align-middle font-semibold text-gray-500">
          No Books
        </div>
      ) : (
        <>
          {isFetching && <Loading className="!fixed !my-20" />}
          <div className="min-h-40 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2 pb-8">
            {books.map((book: any) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default BooksGrid;
