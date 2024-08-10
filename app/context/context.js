'use client';
import { createContext, useState } from "react";

// Create a context
export const HeaderContext = createContext({});

export default function Context({ children }) {
    // Set all states here in this one place to share them in all components of the app
    const [mainViewDisplay, setMainViewDisplay] = useState({display:'none'});
    const [loggedOutViewDisplay, setLoggedOutViewDisplay] = useState({display:'block'});
  
    const [loginHeaderButton, setLoginHeaderButton] = useState({display:'block'});
    const [logoutHeaderButton, setLogoutHeaderButton] = useState({display:'none'});
  
    return (
      // Return the component that will contain the values of the context and pass them to the rest of components from layout
      <HeaderContext.Provider value={{ mainViewDisplay, setMainViewDisplay, loggedOutViewDisplay, setLoggedOutViewDisplay, loginHeaderButton, setLoginHeaderButton, logoutHeaderButton, setLogoutHeaderButton }}>
        {children}
      </HeaderContext.Provider>
    );
}