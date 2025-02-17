import React from "react";
import { useParams } from "react-router-dom";
import BookDetail from "./components/BookDetail/BookDetail";
import BookList from "./components/BookList/BookList";

const BooksPage: React.FC = () => {
  const { id } = useParams();
  return id ? <BookDetail bookID={id} /> : <BookList />;
};

export default BooksPage;
