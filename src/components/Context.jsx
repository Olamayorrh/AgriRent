import React, { createContext, useState } from "react";

export const userContext = createContext();

const Context = ({ children }) => {
  const [page, setPage] = useState("Login");

  const handleSignUpToggle = () => {
    setPage("Sign Up");
  };

  const handleLoginToggle = () => {
    setPage("Login");
  };

  return (
    <userContext.Provider
      value={{ page, handleLoginToggle, handleSignUpToggle }}
    >
      {children}
    </userContext.Provider>
  );
};

export default Context;
