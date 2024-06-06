// context/userContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
    role: null,
  });
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    const getAuth = localStorage.getItem("ecom-user-auth");
    if (getAuth) {
      const parseUser = JSON.parse(getAuth);
      setAuth({
        user: parseUser?.loginData,
        token: parseUser.token,
        role: parseUser.role,
      });
    }
    setIsAuthInitialized(true);
  }, []);

  return (
    <AppContext.Provider value={{ auth, setAuth, isAuthInitialized }}>
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useGlobalContext };
