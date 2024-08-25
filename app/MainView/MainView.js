'use client';

import './MainView.css';
import NewEventModal from '../NewEventModal/NewEventModal';

import { db } from '../firebase/firebase-config';
import { collection, onSnapshot, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";

import { useEffect, useState, useContext } from "react";
import { HeaderContext } from '../context/context';

export default function MainView () {
    let { mainViewDisplay } = useContext(HeaderContext);

    const [newEventModalDisplay, setNewEventModalDisplay] = useState({display: 'none'});

    // Get all fields collections from firebase
    const alpufCollection = collection(db, 'alpuf');
    const alturitasCollection = collection(db, 'alturitas');
    const machiquesCollection = collection(db, 'machiques');
    const sanjoseCollection = collection(db, 'sanjose');
    const sanjulianCollection = collection(db, 'sanjulian');

    // Array containing all collections
    const collectionsArrayByField = [alpufCollection, alturitasCollection, machiquesCollection, sanjoseCollection, sanjulianCollection];

    // Function to show new Event Modal
    const showNewEventModal = ()=> {
        setNewEventModalDisplay({display: 'block'});
        // Code to scroll to the position of the modal
        const element = document.querySelector('.new-event__modal');
        const offset = 300;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition + offset;
        
        // A little delay while the section is shown and able to go there
        setTimeout(()=> {
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }, 500);
    }

    useEffect(()=> {
        // Clearing events
        const events_container = document.getElementById('events_container');
        events_container.innerHTML = '';

        // Clearing fields select
        const field_select = document.getElementById('field_select');
        field_select.innerHTML = '';
        const void_option = document.createElement('option');
        void_option.innerText = '--------';
        void_option.value = '--------';
        field_select.appendChild(void_option);

        collectionsArrayByField.forEach(col=> {
            // Pushing field names in array
            if(col.id == 'alturitas') {
                // Adding an option in field select
                const option = document.createElement('option');
                option.innerText = 'Alturitas';
                option.value = col.id;
                field_select.appendChild(option);
            } else if(col.id == 'alpuf') {
                // Adding an option in field select
                const option = document.createElement('option');
                option.innerText = 'Alpuf';
                option.value = col.id;
                field_select.appendChild(option);
            } else if(col.id == 'machiques') {
                // Adding an option in field select
                const option = document.createElement('option');
                option.innerText = 'Machiques';
                option.value = col.id;
                field_select.appendChild(option);
            } else if(col.id == 'sanjose') {
                // Adding an option in field select
                const option = document.createElement('option');
                option.innerText = 'San José';
                option.value = col.id;
                field_select.appendChild(option);
            } else if(col.id == 'sanjulian') {
                // Adding an option in field select
                const option = document.createElement('option');
                option.innerText = 'San Julián';
                option.value = col.id;
                field_select.appendChild(option);
            }

            // Create an article for each field, containing the name of that field
            const article = document.createElement('article');
            const h2 = document.createElement('h2');
            h2.innerText = `${col.id == 'alturitas' ? 'Alturitas' : col.id == 'alpuf' ? 'Alpuf' : col.id == 'machiques' ? 'Machiques' : col.id == 'sanjose' ? 'San José' : col.id == 'sanjulian' ? 'San Julián' : ''}`;
            article.appendChild(h2);
            events_container.appendChild(article);
            
            // div to contain the wells
            const div = document.createElement('div');
            div.style.display = 'block'; // A display has to be declared for the next event to function

            h2.onclick = ()=> {
                if(h2.nextSibling.style.display == 'block') {
                    div.style.display = 'none';
                } else if(div.style.display == 'none') {
                    div.style.display = 'block';
                }
            };

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

                    // Get ordered data by date from database (I'll use this one instead)
                    const q = query(newRef, orderBy("Fecha Inicial"));
                    const orderedEvents = await getDocs(q);

                    // If events exist, show the events by well name and date
                    if(events.docs.length) {
                        //console.log(`Hay eventos en el pozo ${well.id}`);

                        // As there are events in the field, removing the paragrpah that said the oposite
                        noEventsP.remove();

                        // Inserting the name of the well that has events and inserting each event as an item of a list
                        const h3 = document.createElement('h3');
                        h3.innerText = `${well.id}`;
                        const div2 = document.createElement('div');
                        orderedEvents.docs.forEach(event => {
                            const eventInfo = event.data();
                            const dayi = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getDate();
                            const monthi = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getMonth();
                            const yeari = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getFullYear();
                            const eventTitle = `${eventInfo.Tipo} - ${dayi+1}/${monthi+1}/${yeari}`;
                            const p = document.createElement('p');
                            const a = document.createElement('a');
                            a.innerText = eventTitle;
                            a.href = '/EventView';
                            a.onclick = ()=>{
                                localStorage.setItem('currentWell', well.id);
                                localStorage.setItem('eventRef', `${col.id}/${well.id}/eventos/${event.id}`);
                            };
                            const span = document.createElement('span');
                            span.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                </svg>
                            `;
                            span.onclick = async () => {
                                await deleteDoc(doc(db, `${col.id}/${well.id}/eventos/${event.id}`));
                                window.location.reload(); // I can't find a better way to update the list of events at 'events_container'
                            }
                            p.appendChild(a);
                            p.appendChild(span);
                            div2.appendChild(p);
                        });
                        div.appendChild(h3);
                        div.appendChild(div2);
                    } else {
                        //console.log(`No hay eventos en el pozo ${well.id}`);
                    }
                });
            });
            article.appendChild(div);
        });
    }, []);

    return(
        <>
            <main style={mainViewDisplay}>
                <section>
                    <div id="events_container">

                    </div>
                </section>
                <section>
                    <div id='create-event-btn__container'>
                        <button onClick={showNewEventModal} id='create_event_btn'>NUEVO EVENTO</button>
                    </div>
                </section>
                <NewEventModal
                    newEventModalDisplay={newEventModalDisplay}
                    setNewEventModalDisplay={setNewEventModalDisplay}
                />
            </main>
        </>
    );
}