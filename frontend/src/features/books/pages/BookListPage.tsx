import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import BooksGrid from "../components/BookList/BooksGrid/BooksGrid";
import { bookAPI } from "../../../services/api/books";
import Button from "../../../components/common/buttons/Button";
import BookFilterModal from "../components/BookList/BookFiltersModal/BookFiltersModal";
import { useQuery } from "@tanstack/react-query";
import Paginator from "../../../components/common/Paginator/Paginator";
import { createEncodedQueryString } from "../../../utils/queryString";
import useBookContext from "../../../contexts/BookContext";

const BookListPage: React.FC = () => {
  const { setBooks } = useBookContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams?.get("page")) || 1);
  const [pageCount, setPageCount] = useState(1);
  const [queryString, setQueryString] = useState(
    createEncodedQueryString(Object.fromEntries(searchParams.entries()))
  );
  const [isBookFilterModalOpen, setIsBookFilterModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    categories: searchParams.get("categories")?.split(",") || [],
    rating: Number(searchParams.get("rating")) || 0,
    language: searchParams.get("language") || "",
  });

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["books", queryString],
    queryFn: () => bookAPI.getBooks(queryString),
  });

  useEffect(() => {
    setBooks(data?.data || []);
    setPageCount(data?.pagination?.last || 1);
  }, [data]);

  useEffect(() => {
    const query = createEncodedQueryString({ page, ...filters });
    setSearchParams(query);
    setQueryString(query);
  }, [filters, page]);

  const handleApplyFilters = (newFilters: {
    categories: string[];
    rating: number;
    language: string;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col gap-6 ">
      <Button onClick={() => setIsBookFilterModalOpen(!isBookFilterModalOpen)}>
        Filters
      </Button>
      <BookFilterModal
        isOpen={isBookFilterModalOpen}
        onClose={() => setIsBookFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        filters={filters}
      />
      <BooksGrid isFetching={isFetching} queryString={queryString} />
      {pageCount > 1 && (
        <Paginator
          pageCount={pageCount}
          page={page}
          onSet={(p) => setPage(p)}
        />
      )}
    </div>
  );
};

export default BookListPage;
