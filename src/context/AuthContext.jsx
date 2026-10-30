
import { createContext, useContext, useState } from "react";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
} from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(getCurrentUser);

  const login = (email, password) => {
    const loggedUser = loginUser(email, password);
    setUser(loggedUser);
  };

  const register = (name, email, password) => {
    const newUser = registerUser(name, email, password);
    setUser(newUser);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
