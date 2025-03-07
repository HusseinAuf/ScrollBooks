import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import BooksGrid from "../components/BookList/BooksGrid/BooksGrid";
import { bookAPI } from "../../../services/api/books";
import Button from "../../../components/common/button/Button";
import { useQuery } from "@tanstack/react-query";
import Paginator from "../../../components/common/Paginator/Paginator";
import { createEncodedQueryString } from "../../../utils/helpers";
import useBookContext from "../../../contexts/BookContext";

const FavoriteBooksPage: React.FC = () => {
  const { setBooks } = useBookContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRender = useRef(true);
  const [page, setPage] = useState(Number(searchParams?.get("page")) || 1);
  const [pageCount, setPageCount] = useState(1);
  const [queryString, setQueryString] = useState(
    createEncodedQueryString(Object.fromEntries(searchParams.entries()))
  );

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["books", queryString],
    queryFn: () => bookAPI.getMyLibrary(queryString),
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

    const query = createEncodedQueryString({ page });
    setSearchParams(query);
    setQueryString(query);
  }, [page]);

  return (
    <div className="flex flex-col gap-6">
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

export default FavoriteBooksPage;
