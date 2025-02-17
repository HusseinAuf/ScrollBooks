import { createContext, useContext, useEffect, useState } from "react";
import { userService } from "../services/api/auth";
import { cartAPI } from "../services/api/cartItems";

const UserContext = createContext<any>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState("");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [cartItems, setCartItems] = useState([]);

  const refreshAccessToken = () => {
    /**/
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getMyProfile();
        setUser(response.data.data);
      } catch {
        /**/
      }
    };
    const fetchCartItems = async () => {
      try {
        const response = await cartAPI.getMyCart();
        setCartItems(response.data.data);
      } catch {
        /**/
      }
    };
    fetchUser();
    fetchCartItems();
  }, []);

  const contextData = {
    user,
    setUser,
    cartItems,
    setCartItems,
    accessToken,
    setAccessToken,
  };

  return (
    <UserContext.Provider value={contextData}>{children}</UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);
export default useUserContext;
