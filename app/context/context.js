import { createContext, useState } from "react";

export const HeaderContext = createContext({display:'block'});

export default function Context({ children }) {
    //const [message, setMessage] = useState();
    const [mainViewDisplay, setMainViewDisplay] = useState({display:'none'});
    const [loggedOutViewDisplay, setLoggedOutViewDisplay] = useState({display:'block'});
  
    const [loginHeaderButton, setLoginHeaderButton] = useState({display:'block'});
    const [logoutHeaderButton, setLogoutHeaderButton] = useState({display:'none'});
  
    return (
      <HeaderContext.Provider value={{ mainViewDisplay, setMainViewDisplay, loggedOutViewDisplay, setLoggedOutViewDisplay, loginHeaderButton, setLoginHeaderButton, logoutHeaderButton, setLogoutHeaderButton }}>
        {children}
      </HeaderContext.Provider>
    );
}