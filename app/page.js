'use client';

import { getAuth, onAuthStateChanged  } from "firebase/auth";

import { db } from "./firebase/firebase-config";
import Header from "./Header/Header";
import MainView from "./MainView/MainView";
import LoggedOutView from "./LoggedOutView/LoggedOutView";
import { useEffect, useContext } from "react";
import Footer from "./Footer/Footer";
import { HeaderContext } from "./context/context";

export default function Home() {
  // Taking the states from de context so the functions within the useEffect don´t cause an error
  let { setMainViewDisplay, setLoggedOutViewDisplay, setLoginHeaderButton, setLogoutHeaderButton } = useContext(HeaderContext);

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
      <Header />
      {/* When using a context, there is no need of props. I'll leave the props commented as an example of the effetc of using a context */}
      {/* <Header
        setMainViewDisplay={setMainViewDisplay}
        setLoggedOutViewDisplay={setLoggedOutViewDisplay}

        loginHeaderButton={loginHeaderButton}
        logoutHeaderButton={logoutHeaderButton}

        setLoginHeaderButton={setLoginHeaderButton}
        setLogoutHeaderButton={setLogoutHeaderButton}
      /> */}
      <MainView
       /* mainViewDisplay={mainViewDisplay}
        setMainViewDisplay={setMainViewDisplay}*/
      />
      <LoggedOutView
        /*loggedOutViewDisplay={loggedOutViewDisplay}
        setLoggedOutViewDisplay={setLoggedOutViewDisplay}

        setMainViewDisplay={setMainViewDisplay}
        setLoginHeaderButton={setLoginHeaderButton}
        setLogoutHeaderButton={setLogoutHeaderButton}*/
      />
      <Footer />
    </>
  );
}
