import React, { memo } from "react";
import ReactPaginate from "react-paginate";
import { GrFormNext } from "react-icons/gr";
import useUIContext from "../../../contexts/UIContext";

interface PaginateReactProps {
  pageCount: number;
  onSet: (page: number) => void;
  page: number;
}

const Paginator: React.FC<PaginateReactProps> = ({
  pageCount,
  onSet,
  page = 1,
}) => {
  const { screenSize } = useUIContext();

  const handlePageClick = (data: any) => {
    onSet(data?.selected + 1);
  };

  return (
    <>
      <ReactPaginate
        breakLabel="..."
        nextLabel={<GrFormNext className="text-xl" />}
        previousLabel={<GrFormNext className="text-xl -scale-x-100" />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={screenSize !== "xs" ? 3 : 1}
        marginPagesDisplayed={screenSize !== "xs" ? 2 : 1}
        pageCount={pageCount}
        forcePage={page - 1}
        disableInitialCallback={true}
        containerClassName={"flex justify-center gap-2"}
        pageClassName={"flex items-center justify-center"}
        pageLinkClassName={
          "flex justify-center items-center p-1 font-semibold text-white bg-mediumBlue hover:bg-darkBlue transition-color duration-300 min-w-8 h-8 rounded-lg border border-gray-500"
        }
        previousClassName={"flex items-center justify-center"}
        previousLinkClassName={`mr-2 text-lg text-white flex items-center justify-center ${
          page === 1
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-mediumBlue hover:bg-darkBlue"
        } transition-color duration-300 text-base shadow-xl w-7 h-7 rounded-lg`}
        nextClassName={"flex items-center justify-center"}
        nextLinkClassName={`ml-2 text-lg text-white flex items-center justify-center ${
          page === pageCount
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-mediumBlue hover:bg-darkBlue"
        } transition-color duration-300 text-base shadow-xl w-7 h-7 rounded-lg`}
        breakClassName={"flex items-center justify-center"}
        breakLinkClassName={"flex items-center justify-center"}
        activeLinkClassName={"!bg-darkBlue"}
      />
    </>
  );
};

export default memo(Paginator);
