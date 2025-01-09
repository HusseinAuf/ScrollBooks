import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<any>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState("");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const refreshAccessToken = () => {
    /**/
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
    } else {
      refreshAccessToken();
    }
  }, []);

  const contextData = {
    user,
    accessToken,
    setAccessToken,
  };

  return (
    <UserContext.Provider value={contextData}>{children}</UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);
export default useUserContext;
