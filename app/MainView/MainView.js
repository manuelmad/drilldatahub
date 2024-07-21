'use client';

import './MainView.css';
import Header from '../Header/Header';

import { db } from '../firebase/firebase-config';
import { collection, onSnapshot, getDocs } from "firebase/firestore";

import { useEffect, useState } from "react";

// import NewEventModal from '../NewEventModal/NewEventModal';

export default function MainView() {

    const [fieldNames, setFieldNames] = useState([]);

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
        setFieldNames([]);

        collectionsArrayByField.forEach(col=> {
            // Pushing field names in array
            if(col.id == 'alturitas') {
                fieldNames.push('Alturitas');
            } else if(col.id == 'alpuf') {
                fieldNames.push('Alpuf');
            } else if(col.id == 'machiques') {
                fieldNames.push('Machiques');
            } else if(col.id == 'sanjose') {
                fieldNames.push('San José');
            } else if(col.id == 'sanjulian') {
                fieldNames.push('San Julián');
            }

            console.log(fieldNames);
            
            // Create an article for each field, containing the name of that field
            const article = document.createElement('article');
            const h2 = document.createElement('h2');
            h2.innerText = `${col.id == 'alturitas' ? 'Alturitas' : col.id == 'alpuf' ? 'Alpuf' : col.id == 'machiques' ? 'Machiques' : col.id == 'sanjose' ? 'San José' : col.id == 'sanjulian' ? 'San Julián' : ''}`;
            article.appendChild(h2);
            events_container.appendChild(article);
            
            // Create by default a paragraph saying there are no events
            const noEventsP = document.createElement('p');
            noEventsP.innerText = 'No hay eventos en este campo.';
            article.appendChild(noEventsP);

            // Listen to the current collection (field) and get changes everytime a document is updated, created or deleted
            onSnapshot(col, (snapshot)=>{
                //Getting all documents (wells) in each firebase database collection (field)
                const data = snapshot.docs;

                // Checking if a well has events
                data.forEach( async well=> {                  
                    // Getting the ref for the events of a well
                    const newRef = collection(db, `${col.id}/${well.id}/eventos`);

                    // Getting the events of a well
                    const events = await getDocs(newRef);

                    // If events exist, show the events by well name and date
                    if(events.docs.length) {
                        //console.log(`Hay eventos en el pozo ${well.id}`);

                        // As there are events in the field, removing the paragrpah that said the oposite
                        noEventsP.remove();

                        // Inserting the name of the well that has events and inserting each event as a item of a list
                        const h3 = document.createElement('h3');
                        h3.innerText = `${well.id}`;
                        const p = document.createElement('p');
                        events.docs.forEach(event => {
                            const eventInfo = event.data();
                            const dayi = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getDate();
                            const monthi = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getMonth();
                            const yeari = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getFullYear();
                            const eventTitle = `${eventInfo.Tipo} ${dayi}/${monthi+1}/${yeari}`;
                            const a = document.createElement('a');
                            a.innerText = eventTitle;
                            a.href = '/EventView';
                            let eventData = {
                                'Pozo': `${well.id}`,
                                'Taladro': `${eventInfo['Taladro']}`,
                                'Objetivo': `${eventInfo['Objetivo']}`,
                                'Tiempo Estimado': `${eventInfo['Tiempo Estimado']}`,
                                'Fecha Inicial': `${dayi}/${monthi+1}/${yeari}`,
                                'Fecha Final': `${(new Date ((eventInfo['Fecha Final'].seconds)*1000)).getDate()}/${((new Date ((eventInfo['Fecha Final'].seconds)*1000)).getMonth())+1}/${(new Date ((eventInfo['Fecha Final'].seconds)*1000)).getFullYear()}`,
                                'Tipo': `${eventInfo.Tipo}`,
                                'Subtipo': `${eventInfo.Subtipo}`
                            }
                            a.onclick = ()=>{
                                localStorage.setItem('eventData', JSON.stringify(eventData));
                                localStorage.setItem('reportsRef', `${col.id}/${well.id}/eventos/${event.id}`);
                            };
                            p.appendChild(a);
                            
                        });
                        article.appendChild(h3);
                        article.appendChild(p);
                    } else {
                        //console.log(`No hay eventos en el pozo ${well.id}`);
                    }
                });
            });
        });
        const field_select = document.getElementById('field_select');
        field_select.innerHTML = '';
        fieldNames.forEach(field => {
            const option = document.createElement('option');
            option.innerText = field;
            field_select.appendChild(option);
        })
    }, []);

    return(
        <>
            <Header></Header>
            <main>
                <section>
                    <div id="events_container">

                    </div>
                </section>
                <section>
                    <div id='create-event-btn__container'>
                        <button id='create_event_btn'>CREAR NUEVO EVENTO</button>
                    </div>
                </section>
                <section className='new-event__modal'>
                    <div>
                        <p>
                            <label>Elija el campo:</label>
                            <select id='field_select'>

                            </select>
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}