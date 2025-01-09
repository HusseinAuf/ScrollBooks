import React from "react";
import logo from "../../../assets/images/scrollbooks_logo.png";
import { Link } from "react-router-dom";
import Button from "../../common/buttons/Button";
import useUserContext from "../../../contexts/UserContext";

const Navbar: React.FC = () => {
  const { user } = useUserContext();
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/">
            <img
              className="w-8 h-8 hover:filter hover:drop-shadow-lg transition-all duration-300"
              src={logo}
              alt="App Logo"
            />
          </Link>
        </div>
        <div>
          <ul className="flex items-center space-x-4">
            {user ? (
              <>
                <li>
                  <a href="#hero" className="text-gray-600 hover:text-gray-900">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    About
                  </a>
                </li>
              </>
            ) : (
              <li>
                <Button>Sign Up</Button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
