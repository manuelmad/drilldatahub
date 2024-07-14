'use client';

import './MainView.css';

import { db } from '../firebase/firebase-config';
import { collection, onSnapshot, getDocs } from "firebase/firestore";

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

    useEffect(()=> {
        const events_container = document.getElementById('events_container');
        events_container.innerHTML = '';

        collectionsArrayByField.forEach(col=> {
            
            // Variable to determine if a field has events in some well
            let wellsWithEvents = 0;

            // Variable to count the wells checked in a field
            let wellsChecked = 0;
            
            // Create an article for each field, containing the name of that field
            const article = document.createElement('article');
            const h2 = document.createElement('h2');
            h2.innerText = `${col.id == 'alturitas' ? 'Alturitas' : col.id == 'alpuf' ? 'Alpuf' : col.id == 'machiques' ? 'Machiques' : col.id == 'sanjose' ? 'San José' : col.id == 'sanjulian' ? 'San Julián' : ''}`;
            article.appendChild(h2);
            events_container.appendChild(article);
            
            // Create by default a paragraph saying there are no events
            const noEventsP = document.createElement('p');
            // noEventsP.className = `no-events-${col.id}`;
            noEventsP.innerText = 'No hay eventos en este campo.';
            article.appendChild(noEventsP);

            // Listen to the current collection (field) and get changes everytime a document is updated, created or deleted
            onSnapshot(col, (snapshot)=>{
                //Getting all documents (wells) in each firebase database collection (field)
                const data = snapshot.docs;

                // Checking if a well has events
                data.forEach( async well=> {
                    // Adding a well checked
                    wellsChecked++;
                    console.log(wellsChecked, data.length);
                    
                    // Getting the ref for the events of a well
                    const newRef = collection(db, `${col.id}/${well.id}/eventos`);

                    // Getting the events of a well
                    const events = await getDocs(newRef);

                    // If events exist, show the events by well name and date
                    if(events.docs.length) {
                        //console.log(`Hay eventos en el pozo ${well.id}`);

                        // As there are events in the field, removing the paragrpah that said the oposite
                        noEventsP.remove();

                        // Adding a well with events
                        wellsWithEvents++;
                        console.log(wellsWithEvents);

                        // Inserting the name of the well that has events and inserting each event as a item of a list
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
                        article.appendChild(h3);
                        article.appendChild(p);
                    } else {
                        //console.log(`No hay eventos en el pozo ${well.id}`);
                    }
                });
            });
        });
    }, []);

    return(
        <main>
            <section>
                <div id="events_container">

                </div>
            </section>
        </main>
    );
}