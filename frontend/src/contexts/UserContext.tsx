import { createContext, useContext, useEffect, useState } from "react";
import { userAPI } from "../services/api/auth";
import { cartAPI } from "../services/api/cartItems";
import { accessSync } from "fs";

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
  const [isVerifiedUser, setisVerifiedUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser).is_verified : false;
  });

  const fetchUser = async () => {
    try {
      const response = await userAPI.getMe();
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
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
    if (accessToken) {
      fetchUser();
      fetchCartItems();
    }
  }, []);

  const contextData = {
    user,
    setUser,
    isVerifiedUser,
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
