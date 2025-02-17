import React, { useState } from "react";
import { IoCartSharp } from "react-icons/io5";
import useUserContext from "../../contexts/UserContext";

const Cart: React.FC = () => {
  const { cartItems } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const removeFromCart = (cartItemID: string) => {
    /**/
  };
  const toggleDropdown = () => setIsOpen(!isOpen);

  const totalPrice = cartItems.reduce(
    (total: number, item: any) => total + item.price,
    0
  );

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="text-white hover:shadow-lg p-3 rounded-full bg-mediumBlue relative"
      >
        <IoCartSharp className="w-5 h-5" />
        {cartItems.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {cartItems.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {cartItems.length === 0 ? (
            <p className="p-4 text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <ul className="max-h-64 overflow-y-auto">
                {cartItems.map((item: any) => (
                  <li
                    key={item.id}
                    className="flex items-center p-4 border-b border-gray-200"
                  >
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-12 h-16 object-cover rounded-lg"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="p-4 border-t border-gray-200">
                <p className="text-lg font-semibold text-gray-900">
                  Total: ${totalPrice.toFixed(2)}
                </p>
                <button className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Process to Buy
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
