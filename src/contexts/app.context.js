import { appReducer } from '../reducers/app.reducer';
import React, { createContext, useReducer, useEffect } from 'react';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [appState, dispatch] = useReducer(appReducer, [], () => {
      return JSON.parse(localStorage.getItem("APP_STATE_KEY"))
    });
    useEffect(() => {
      localStorage.setItem("APP_STATE_KEY", JSON.stringify(appState));
    }, [appState]);
    return (
      <AppContext.Provider value={{ appState, dispatch }}>
        {props.children}
      </AppContext.Provider>
    );
  }
   
  export default AppContextProvider;
