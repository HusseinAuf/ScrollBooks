import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/scrollbooks_logo.png";
import useUserContext from "../../../contexts/UserContext";
import SearchBar from "./SearchBar/SearchBar";
import Cart from "../../../features/cart/Cart";

const Navbar: React.FC = () => {
  const { user } = useUserContext();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // State for mobile menu
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false); // State for expanded search bar
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container
  const searchRef = useRef<HTMLDivElement>(null); // Ref for the search container

  const onSearch = (query: string) => {
    // Add your search logic here
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  // Close dropdown and search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-6">
          {/* Logo (Hidden when search is expanded) */}
          <div className="flex items-center">
            <Link to="/">
              <img
                className="w-8 h-8 hover:filter hover:drop-shadow-lg transition-all duration-300"
                src={logo}
                alt="App Logo"
              />
            </Link>
          </div>

          <div className="flex justify-end items-center gap-4 flex-1">
            {/* Search Icon (Visible on Screens less than md) */}
            <div className="md:hidden">
              <button
                onClick={toggleSearch}
                className="text-gray-400 hover:text-mediumBlue focus:outline-none p-3 rounded-full border border-gray-300"
              >
                {!isSearchExpanded ? (
                  <svg
                    className="h-4 w-4"
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
                ) : (
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="24"
                    height="24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.361-4.361a1 1 0 111.414 1.414L13.414 10.586l4.361 4.361a1 1 0 11-1.414 1.414L12 12l-4.361 4.361a1 1 0 11-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Search Bar (Visible on Screens greater than md) */}
            <div className="hidden md:block flex-1">
              <SearchBar onSearch={onSearch} />
            </div>

            {/* Navigation Links (Visible on Screens greater than lg) */}
            <div className="hidden lg:flex items-center space-x-4">
              <a
                href="/home"
                className="text-gray-800 hover:text-mediumBlue px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </a>
              <a
                href="/about"
                className="text-gray-800 hover:text-mediumBlue px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-gray-800 hover:text-mediumBlue px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </a>
            </div>
            <Cart />

            {/* User Profile Dropdown (Visible on All Screens) */}
            <div className="flex items-center">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-sm focus:outline-none text-gray-800 hover:text-mediumBlue"
                >
                  {user?.author?.picture ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://via.placeholder.com/150"
                      alt="User"
                    />
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                  <span className="ml-2 text-gray-800 hidden md:inline">
                    {user?.name}
                  </span>
                  <svg
                    className="ml-2 h-4 w-4 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </a>
                      <a
                        href="/logout"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button (Hamburger Icon) */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-800 hover:text-mediumBlue focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Visible on Small Screens) */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="/home"
                className="block text-gray-800 hover:text-mediumBlue px-3 py-2 rounded-md text-base font-medium"
              >
                Home
              </a>
              <a
                href="/about"
                className="block text-gray-800 hover:text-mediumBlue px-3 py-2 rounded-md text-base font-medium"
              >
                About
              </a>
              <a
                href="/contact"
                className="block text-gray-800 hover:text-mediumBlue px-3 py-2 rounded-md text-base font-medium"
              >
                Contact
              </a>
            </div>
          </div>
        )}
        {isSearchExpanded && (
          <div ref={searchRef} className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <SearchBar onSearch={onSearch} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
