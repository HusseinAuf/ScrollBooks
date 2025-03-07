import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import logo from "../../../assets/images/scrollbooks_logo.png";
import useUserContext from "../../../../contexts/UserContext";
import Button from "../../../common/button/Button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUserContext();
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("search") || ""
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-mediumBlue"
        />
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </span>
        <span className="absolute inset-y-0 right-0 pl-3 flex items-center">
          <Button type="submit" className="!text-xs !p-3">
            Search
          </Button>
        </span>
      </div>
    </form>
  );
};

export default SearchBar;
