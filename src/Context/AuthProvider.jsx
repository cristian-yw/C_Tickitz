import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("activeUser");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("activeUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("activeUser");
    }
  }, [user]);

  const registerUser = (email, password) => {
    localStorage.setItem("registeredUser", JSON.stringify({ email, password }));
  };

  const loginUser = (email, password) => {
    const registered = JSON.parse(localStorage.getItem("registeredUser"));
    if (
      registered &&
      registered.email === email &&
      registered.password === password
    ) {
      const active = { email };
      setUser(active);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, registerUser, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
