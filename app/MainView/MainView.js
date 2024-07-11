'use client';

import './MainView.css';

import { db } from '../firebase/firebase-config';
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

import { useEffect } from "react";

export default function MainView() {

    // Get all fields collections from firebase
    const alpufCollection = collection(db, 'alpuf');
    const alturitasCollection = collection(db, 'alturitas');
    const machiquesCollection = collection(db, 'machiques');
    const sanjoseCollection = collection(db, 'sanjose');
    const sanjulianCollection = collection(db, 'sanjulian');

    const collectionsArrayByField = [alpufCollection, alturitasCollection, machiquesCollection, sanjoseCollection, sanjulianCollection];

    console.log(collectionsArrayByField);

    useEffect(()=> {
        collectionsArrayByField.forEach(col=> {
            // Listen to the current collection and get changes everytime a document is updated, created or deleted to update the trend info
            console.log(col.id);

            onSnapshot(col, (snapshot)=>{
                //Getting all documents in firebasedatabase collection
                const data = snapshot.docs;
                data.forEach(well=> {
                    console.log(well.id);
                    const info = well.data();
                    const a = `${col.id}/${well.id}/eventos`;
                    console.log(a);
                    const newRef = collection(db, a);
                    onSnapshot(newRef, snapshot=>{
                        if(snapshot.docs.length) {
                            console.log('Hay eventos');
                        } else {
                            console.log('No hay eventos');
                        }
                    });

                });
            });
        
        });

    }, []);

    return(
        <main>
            <div id="test">

            </div>
        </main>
    );
}