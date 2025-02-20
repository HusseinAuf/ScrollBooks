import React, { useState, useRef, useEffect } from "react";
import { IoCartSharp } from "react-icons/io5";
import useUserContext from "../../contexts/UserContext";
import Button from "../../components/common/buttons/Button";
import { Link } from "react-router-dom";
import { cartAPI } from "../../services/api/cartItems";
import { useQueryClient } from "@tanstack/react-query";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import { orderAPI } from "../../services/api/orders";

const Cart: React.FC = () => {
  const queryClient = useQueryClient();
  const { cartItems, setCartItems, fetchCartItems } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRemoveFromCart = async (cartItem: any) => {
    try {
      const response = await cartAPI.deleteCartItem(cartItem.id);
      setCartItems((prev: any) =>
        prev.filter((item: any) => item.id !== cartItem.id)
      );
      queryClient.setQueriesData(
        { queryKey: ["books"], exact: false },
        (data: any) => {
          if (!data?.data) return;
          return {
            ...data,
            data: data.data.map((book: any) =>
              book.id === cartItem.book.id
                ? { ...book, is_in_my_cart: false }
                : book
            ),
          };
        }
      );
    } catch {
      /**/
    }
  };
  const handleProcessToBuy = async () => {
    const bookIDs = cartItems.map((cartItem: any) => cartItem.id);
    try {
      const response = await orderAPI.createOrder({ bookIDs });
      window.location.replace(response.data.stripe_session_url);
    } catch {
      /* */
    }
  };
  const toggleDropdown = () => setIsOpen(!isOpen);

  const totalPrice = cartItems.reduce(
    (total: number, item: any) => total + Number(item.book.price),
    0
  );

  return (
    <div className="relative" ref={cartRef}>
      <button
        onClick={toggleDropdown}
        className="text-white hover:shadow-lg p-3 rounded-full bg-mediumBlue relative"
      >
        <IoCartSharp className="w-4 h-4" />
        {cartItems.length > 0 && (
          <span className="absolute top-0 right-0 bg-darkBlue text-white text-xs rounded-full px-1.5 py-0.5">
            {cartItems.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute transform sm:transform-none translate-x-1/2 right-1/2 sm:right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {cartItems.length === 0 ? (
            <p className="p-4 text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <ul className="max-h-64 overflow-y-auto">
                {cartItems.map((item: any) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-100"
                  >
                    <Link to={`/books/${item.book.id}`}>
                      <div className="flex items-center">
                        <img
                          src={item.book.cover_image}
                          alt={item.book.title}
                          className="w-12 h-16 object-cover rounded-lg"
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {item.book.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            ${Number(item.book.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleRemoveFromCart(item)}
                      className="flex items-center justify-center text-red-500 hover:text-red-700"
                    >
                      <HiArchiveBoxXMark />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 p-4 border-t border-gray-200">
                <p className="text-lg font-semibold text-gray-900">
                  Total: ${totalPrice.toFixed(2)}
                </p>
                <Button className="self-center" onClick={handleProcessToBuy}>
                  Process to Buy
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
