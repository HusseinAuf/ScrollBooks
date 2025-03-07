import React, { useEffect } from "react";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { GrFormNext } from "react-icons/gr";
import { useQuery } from "@tanstack/react-query";
import { bookAPI } from "../../../../../services/api/books";
import BookCard from "../../../../../components/shared/BookCard/BookCard";
import Loading from "../../../../../components/common/Loading/Loading";
import useBookContext from "../../../../../contexts/BookContext";

const BooksPreview: React.FC = () => {
  const { books, setBooks } = useBookContext();
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["books-preview"],
    queryFn: () => bookAPI.getBooks(),
  });

  useEffect(() => {
    if (data?.data.length) {
      setBooks(data?.data);
    }
  }, [data]);

  return (
    <CarouselProvider
      naturalSlideWidth={50}
      naturalSlideHeight={50}
      totalSlides={books.length}
      isIntrinsicHeight
      className="flex justify-center relative"
      visibleSlides={1}
      infinite={false}
    >
      {!isFetching ? (
        <div className="relative">
          <Slider className="flex justify-center">
            {books.map((book: any, index: number) => (
              <Slide index={index} className="text-center flex-grow w-auto">
                <div className="w-[60%] mx-auto mt-3 mb-8">
                  <BookCard book={book} />
                </div>
              </Slide>
            ))}
          </Slider>
          <ButtonBack className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-mediumBlue text-white p-2 rounded-full shadow-lg hover:bg-darkBlue transition">
            <GrFormNext className="text-xl -scale-x-100" />
          </ButtonBack>
          <ButtonNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-mediumBlue text-white p-2 rounded-full shadow-lg hover:bg-darkBlue transition z-10">
            <GrFormNext className="text-xl" />
          </ButtonNext>
        </div>
      ) : (
        <Loading />
      )}
    </CarouselProvider>
  );
};

export default BooksPreview;
