import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import BookGridView from "./BookGridView/BookGridView";
import { bookAPI } from "../../../../services/api/books";
import Button from "../../../../components/common/buttons/Button";
import BookFilterModal from "./BookFiltersModal/BookFiltersModal";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Paginator from "../../../../components/common/Paginator/Paginator";
import { createEncodedQueryString } from "../../../../utils/queryString";

const BookList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams?.get("page")) || 1);
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
    select: (data: any) => ({
      data: data?.data || [],
      pageCount: data?.pagination?.last || 1,
    }),
  });

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
      <BookGridView
        isFetching={isFetching}
        books={data?.data}
        queryString={queryString}
      />
      {data?.pageCount > 1 && (
        <Paginator
          pageCount={data?.pageCount}
          page={page}
          onSet={(p) => setPage(p)}
        />
      )}
    </div>
  );
};

export default BookList;
