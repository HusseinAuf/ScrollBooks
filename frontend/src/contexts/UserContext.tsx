import { createContext, useContext, useEffect, useState } from "react";
import { userService } from "../services/api/auth";
import { cartAPI } from "../services/api/cartItems";

const UserContext = createContext<any>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token") || ""
  );
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [cartItems, setCartItems] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await userService.getMe();
      setUser(response.data);
    } catch {
      /**/
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await cartAPI.getMyCart();
      setCartItems(response.data);
    } catch {
      /**/
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCartItems();
  }, []);

  const contextData = {
    user,
    setUser,
    fetchUser,
    cartItems,
    setCartItems,
    fetchCartItems,
    accessToken,
    setAccessToken,
  };

  return (
    <UserContext.Provider value={contextData}>{children}</UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);
export default useUserContext;
