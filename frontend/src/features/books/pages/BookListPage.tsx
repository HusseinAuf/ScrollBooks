import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import BooksGrid from "../components/BookList/BooksGrid/BooksGrid";
import { bookAPI } from "../../../services/api/books";
import Button from "../../../components/common/button/Button";
import BookFilterModal from "../components/BookList/BookFiltersModal/BookFiltersModal";
import { useQuery } from "@tanstack/react-query";
import Paginator from "../../../components/common/Paginator/Paginator";
import { createEncodedQueryString } from "../../../utils/helpers";
import useBookContext from "../../../contexts/BookContext";
import { IoFilterSharp } from "react-icons/io5";

const BookListPage: React.FC = () => {
  const { setBooks } = useBookContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRender = useRef(true);
  const [page, setPage] = useState(Number(searchParams?.get("page")) || 1);
  const [pageCount, setPageCount] = useState(1);
  const [queryString, setQueryString] = useState(
    createEncodedQueryString(Object.fromEntries(searchParams.entries()))
  );
  const [isBookFilterModalOpen, setIsBookFilterModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const query = createEncodedQueryString({ page, ...filters });
    setSearchParams(query);
  }, [filters, page]);

  useEffect(() => {
    setQueryString(
      createEncodedQueryString(Object.fromEntries(searchParams.entries()))
    );
  }, [searchParams]);

  const handleApplyFilters = (newFilters: {
    categories: string[];
    rating: number;
    language: string;
  }) => {
    setFilters((filters) => ({ ...filters, ...newFilters }));
  };

  return (
    <div className="flex flex-col gap-6 ">
      <Button onClick={() => setIsBookFilterModalOpen(!isBookFilterModalOpen)}>
        Filters <IoFilterSharp />
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
