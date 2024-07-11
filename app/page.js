'use client';
import Image from "next/image";
import styles from "./page.module.css";

import MainView from "./MainView/MainView";

import { useEffect } from "react";

import { db } from "./firebase/firebase-config";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
// import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

export default function Home() {

  // Get the collection 'alturitas' from firebase
  // const ref = 'alturitas/ALT0053/eventos';
  // const ALT53EventsCollection = collection(db, ref);

  // useEffect(()=> {
  //   // Listen to the current collection and get changes everytime a document is updated, created or deleted to update the trend info
  //   onSnapshot(ALT53EventsCollection, (snapshot)=>{
  //     //Getting all documents in firebasedatabase collection
  //     const data = snapshot.docs;

  //     data.forEach(event => {
  //       console.log(event.id);
  //       const eventInfo = event.data();
  //       const dayi = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getDate();
  //       const monthi = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getMonth();
  //       const yeari = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getFullYear();
    
  //       const dayf = (new Date((eventInfo['Fecha Final'].seconds)*1000)).getDate();
  //       const monthf = (new Date((eventInfo['Fecha Final'].seconds)*1000)).getMonth();
  //       const yearf = (new Date((eventInfo['Fecha Final'].seconds)*1000)).getFullYear();

  //       const p1 = document.createElement('p');
  //       p1.innerHTML = `Fecha Inicial: ${dayi}/ ${monthi+1}/ ${yeari}`;

  //       const p2 = document.createElement('p');
  //       p2.innerHTML = `Fecha Final: ${dayf}/ ${monthf+1}/ ${yearf}`;

  //       const ul = document.createElement('ul');

  //       const ref2 = `${ref}/${event.id}/reportes`;
  //       const ALT53ReportsCollection = collection(db, ref2);
  //       onSnapshot(ALT53ReportsCollection, snapshot => {
  //         const data2 = snapshot.docs;
  //         data2.forEach(report => {
  //           const activities = report.data().Actividades;
  //           activities.forEach(activity => {
  //             const li = document.createElement('li');
  //             li.innerHTML = activity.Actividad;
  //             ul.appendChild(li);
  //           });
            
  //         });
  //       });
       
  //       const div = document.getElementById('test');
  //       div.innerHTML = '';
  //       div.appendChild(p1);
  //       div.appendChild(p2);
  //       div.appendChild(ul);
  //     });

  //   });
  // }, []);

  return (
    <MainView></MainView>
  );
}
