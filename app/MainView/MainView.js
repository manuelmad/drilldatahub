'use client';

import './MainView.css';

import { db } from '../firebase/firebase-config';
import { collection, onSnapshot, doc, updateDoc, getDocs } from "firebase/firestore";

import { useEffect } from "react";

export default function MainView() {

    // Get all fields collections from firebase
    const alpufCollection = collection(db, 'alpuf');
    const alturitasCollection = collection(db, 'alturitas');
    const machiquesCollection = collection(db, 'machiques');
    const sanjoseCollection = collection(db, 'sanjose');
    const sanjulianCollection = collection(db, 'sanjulian');

    // Array containing all collections
    const collectionsArrayByField = [alpufCollection, alturitasCollection, machiquesCollection, sanjoseCollection, sanjulianCollection];

    // console.log(collectionsArrayByField);

    useEffect(()=> {
        events_container.innerHTML = '';
        collectionsArrayByField.forEach(col=> {
            // Listen to the current collection and get changes everytime a document is updated, created or deleted to update the trend info
            // console.log(col.id);
            // Index to determine if a well has events
            // let index;
            // let wellsWithEvents = 0;
            const events_container = document.getElementById('events_container');
            
            onSnapshot(col, (snapshot)=>{
                let index;
                let wellsWithEvents = 0;
                //Getting all documents (wells) in each firebase database collection
                const data = snapshot.docs;

                data.forEach( async well=> {
                    // console.log(well.id);
                    // const info = well.data();
                    // Getting the ref for the events of a well
                    const newRef = collection(db, `${col.id}/${well.id}/eventos`);

                    const events = await getDocs(newRef);
                    // console.log('events',events.docs.length);

                    if(events.docs.length) {
                        index = true;
                        wellsWithEvents++;
                    //     console.log(`Hay eventos en el pozo ${well.id}`);
                    //     const article = document.createElement('article');
                    //     const h2 = document.createElement('h2');
                    //     h2.innerText = `${col.id == 'alturitas' ? 'Alturitas' : col.id == 'alpuf' ? 'Alpuf' : col.id == 'machiques' ? 'Machiques' : col.id == 'sanjose' ? 'San José' : col.id == 'sanjulian' ? 'San Julián' : ''}`;
                    //     const h3 = document.createElement('h3');
                    //     h3.innerText = `${well.id}`;
                    //     const p = document.createElement('p');
                    //     const ul = document.createElement('ul');
                    //     events.docs.forEach(event => {
                    //         const eventInfo = event.data();
                    //         const dayi = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getDate();
                    //         const monthi = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getMonth();
                    //         const yeari = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getFullYear();
                    //         const eventTitle = `${eventInfo.Tipo} ${dayi}/${monthi}/${yeari}`;
                    //         const li = document.createElement('li');
                    //         li.innerText = eventTitle;
                    //         ul.appendChild(li);
                    //     });
                    //     p.appendChild(ul);
                    //     article.appendChild(h2);
                    //     article.appendChild(h3);
                    //     article.appendChild(p);
                    //     events_container.appendChild(article);
                    // } else {
                    //     index = false;
                    //     console.log(`No hay eventos en el pozo ${well.id}`);
                    } else {
                        index = false;
                    }

                    if (index) {
                        console.log(`Hay eventos en el pozo ${well.id}`);
                        const article = document.createElement('article');
                        const h2 = document.createElement('h2');
                        h2.innerText = `${col.id == 'alturitas' ? 'Alturitas' : col.id == 'alpuf' ? 'Alpuf' : col.id == 'machiques' ? 'Machiques' : col.id == 'sanjose' ? 'San José' : col.id == 'sanjulian' ? 'San Julián' : ''}`;
                        const h3 = document.createElement('h3');
                        h3.innerText = `${well.id}`;
                        const p = document.createElement('p');
                        const ul = document.createElement('ul');
                        events.docs.forEach(event => {
                            const eventInfo = event.data();
                            const dayi = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getDate();
                            const monthi = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getMonth();
                            const yeari = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getFullYear();
                            const eventTitle = `${eventInfo.Tipo} ${dayi}/${monthi}/${yeari}`;
                            const li = document.createElement('li');
                            li.innerText = eventTitle;
                            ul.appendChild(li);
                        });
                        p.appendChild(ul);
                        article.appendChild(h2);
                        article.appendChild(h3);
                        article.appendChild(p);
                        events_container.appendChild(article);
                    } else {
                        console.log(`No hay eventos en el pozo ${well.id}`);
                    }

                    // onSnapshot(newRef, snapshot=>{
                    //     const events = snapshot.docs;
                    //     if(events.length) {
                    //         index = true;
                    //         console.log(`Hay eventos en el pozo ${well.id}`);
                    //         const article = document.createElement('article');
                    //         const h2 = document.createElement('h2');
                    //         h2.innerText = `${col.id == 'alturitas' ? 'Alturitas' : col.id == 'alpuf' ? 'Alpuf' : col.id == 'machiques' ? 'Machiques' : col.id == 'sanjose' ? 'San José' : col.id == 'sanjulian' ? 'San Julián' : ''}`;
                    //         const h3 = document.createElement('h3');
                    //         h3.innerText = `${well.id}`;
                    //         const p = document.createElement('p');
                    //         const ul = document.createElement('ul');
                    //         events.forEach(event => {
                    //             const eventInfo = event.data();
                    //             const dayi = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getDate();
                    //             const monthi = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getMonth();
                    //             const yeari = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getFullYear();
                    //             const eventTitle = `${eventInfo.Tipo} ${dayi}/${monthi}/${yeari}`;
                    //             const li = document.createElement('li');
                    //             li.innerText = eventTitle;
                    //             ul.appendChild(li);
                    //         });
                    //         p.appendChild(ul);
                    //         article.appendChild(h2);
                    //         article.appendChild(h3);
                    //         article.appendChild(p);
                    //         events_container.appendChild(article);
                    //     } else {
                    //         index = false;
                    //         console.log(`No hay eventos en el pozo ${well.id}`);
                    //     }
                    // });

                });
                if(wellsWithEvents == 0) {
                    const article = document.createElement('article');
                    const h2 = document.createElement('h2');
                    h2.innerText = `${col.id == 'alturitas' ? 'Alturitas' : col.id == 'alpuf' ? 'Alpuf' : col.id == 'machiques' ? 'Machiques' : col.id == 'sanjose' ? 'San José' : col.id == 'sanjulian' ? 'San Julián' : ''}`;
                    const p = document.createElement('p');
                    p.innerText = 'No hay eventos en este campo.';
                    article.appendChild(h2);
                    article.appendChild(p);
                    events_container.appendChild(article);
                }
            });
        
        });

    }, []);

    return(
        <main>
            <section id="events_container">

            </section>
        </main>
    );
}