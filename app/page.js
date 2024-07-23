// 'use client';
// import Image from "next/image";
// import { useState } from "react";
import { getAuth } from "firebase/auth";

import { db } from "./firebase/firebase-config";
import MainView from "./MainView/MainView";
import LoggedOutView from "./LoggedOutView/LoggedOutView";

export default function Home() {
  // const auth = getAuth();
  // if(auth) {
  //   return <MainView></MainView>
  // } else {
  //   return <LoggedOutView></LoggedOutView>
  // }
  return <LoggedOutView></LoggedOutView>
}
