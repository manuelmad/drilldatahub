'use client';
// import Image from "next/image";
import { getAuth, onAuthStateChanged  } from "firebase/auth";

import { db } from "./firebase/firebase-config";
import Header from "./Header/Header";
import MainView from "./MainView/MainView";
import LoggedOutView from "./LoggedOutView/LoggedOutView";
import { useEffect, useState, createContext, useContext } from "react";
import Footer from "./Footer/Footer";
import Context from "./context/context";

//export const HeaderContext = createContext();

export default function Home() {
  // const auth = getAuth();
  const [mainViewDisplay, setMainViewDisplay] = useState({display:'none'});
  const [loggedOutViewDisplay, setLoggedOutViewDisplay] = useState({display:'block'});

  const [loginHeaderButton, setLoginHeaderButton] = useState({display:'block'});
  const [logoutHeaderButton, setLogoutHeaderButton] = useState({display:'none'});

  useEffect(()=> {
    // Check state of auth and display the correponding view
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setMainViewDisplay({display:"block"});
        setLoggedOutViewDisplay({display:"none"});
        setLoginHeaderButton({display:"none"});
        setLogoutHeaderButton({display:"block"});
      } else {
        setMainViewDisplay({display:"none"});
        setLoggedOutViewDisplay({display:"block"});
        setLoginHeaderButton({display:"block"});
        setLogoutHeaderButton({display:"none"});
      }
    })
  }, []);
  return (
    <>
    <Context>
      <Header />
    </Context>
      {/* <Header
        setMainViewDisplay={setMainViewDisplay}
        setLoggedOutViewDisplay={setLoggedOutViewDisplay}

        loginHeaderButton={loginHeaderButton}
        logoutHeaderButton={logoutHeaderButton}

        setLoginHeaderButton={setLoginHeaderButton}
        setLogoutHeaderButton={setLogoutHeaderButton}
      /> */}
      <MainView
        mainViewDisplay={mainViewDisplay}
        setMainViewDisplay={setMainViewDisplay}
      />
      <LoggedOutView
        loggedOutViewDisplay={loggedOutViewDisplay}
        setLoggedOutViewDisplay={setLoggedOutViewDisplay}

        setMainViewDisplay={setMainViewDisplay}
        setLoginHeaderButton={setLoginHeaderButton}
        setLogoutHeaderButton={setLogoutHeaderButton}
      />
      <Footer />
    </>
  );
}
