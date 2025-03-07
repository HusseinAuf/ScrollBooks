import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import Paginator from "../../../../../components/common/Paginator/Paginator";
import { useQuery } from "@tanstack/react-query";
import { reviewAPI } from "../../../../../services/api/reviews";
import Loading from "../../../../../components/common/Loading/Loading";
import { keepPreviousData } from "@tanstack/react-query";
interface ReviewProps {
  bookID: number;
}

const BookReviewList: React.FC<ReviewProps> = ({ bookID }) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["reviews", bookID, page],
    queryFn: () => reviewAPI.getReviews(bookID, page),
    select: (data: any) => ({
      data: data?.data || [],
      pageCount: data?.pagination?.last || 1,
    }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="relative flex flex-col gap-6">
      {data?.data && !data.data?.length ? (
        <div className="px-4 py-6 text-center align-middle font-semibold text-gray-500">
          No Reviews
        </div>
      ) : (
        <>
          {(!data?.data || isFetching) && (
            <div className="absolute right-1/2 top-0">
              <Loading />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data?.data.map((review: any) => (
              <div
                key={review.id}
                className="border border-1 border-darkBlue p-4 rounded-xl"
              >
                <div className="flex items-center mb-2">
                  {/* Profile Image */}
                  {review.user.author?.picture ? (
                    <img
                      src={review.user.author?.picture}
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  ) : (
                    <CgProfile className="w-10 h-10 rounded-full mr-4" />
                  )}
                  {/* User Name and Rating */}
                  <div>
                    <p className="font-bold">{review.user.name}</p>
                    <div className="flex items-center">
                      <span className="text-yellow-500">
                        ⭐ {review.rating}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Comment */}
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {data?.pageCount && data?.pageCount > 1 && (
        <Paginator
          pageCount={data?.pageCount}
          page={page}
          onSet={(p) => setPage(p)}
        />
      )}
    </div>
  );
};

export default BookReviewList;
