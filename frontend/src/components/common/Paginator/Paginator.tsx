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
        pageClassName={
          "font-semibold flex items-center justify-center bg-darkBlue hover:bg-mediumBlue transition-color duration-300 text-white w-8 h-8 rounded-full border border-gray-500"
        }
        pageLinkClassName={"flex items-center justify-center p-1"}
        previousClassName={"flex items-center justify-center"}
        nextClassName={"flex items-center justify-center"}
        previousLinkClassName={
          "mr-2 text-lg text-white flex items-center justify-center bg-mediumBlue hover:bg-darkBlue transition-color duration-300 text-base shadow-xl w-7 h-7 rounded-lg"
        }
        nextLinkClassName={
          "ml-2 text-lg text-white flex items-center justify-center bg-mediumBlue hover:bg-darkBlue transition-color duration-300 text-base shadow-xl w-7 h-7 rounded-lg"
        }
        breakClassName={"flex items-center justify-center"}
        breakLinkClassName={"flex items-center justify-center"}
        activeClassName={
          "bg-mediumBlue transition-color duration-300 text-white"
        }
        activeLinkClassName={
          "bg-mediumBlue transition-color duration-300 text-white w-full h-full rounded-full"
        }
      />
    </>
  );
};

export default memo(Paginator);
