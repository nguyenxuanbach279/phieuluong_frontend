import { appReducer } from "../reducers/app.reducer";
import React, { createContext, useReducer, useEffect, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [appState, dispatch] = useReducer(appReducer, [], () => {
    return JSON.parse(localStorage.getItem("APP_STATE_KEY"));
  });
  const [isLoading, setIsLoading] = useState(false);
  const [noticationIsOpen, setNoticationIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [previousUrl, setPreviousUrl] = useState("/");

  useEffect(() => {
    localStorage.setItem("APP_STATE_KEY", JSON.stringify(appState));
  }, [appState]);
  return (
    <AppContext.Provider
      value={{
        appState,
        dispatch,
        isLoading,
        setIsLoading,
        noticationIsOpen,
        setNoticationIsOpen,
        name,
        setName,
        previousUrl,
        setPreviousUrl
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
