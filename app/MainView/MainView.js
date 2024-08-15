'use client';

import './MainView.css';
import NewEventModal from '../NewEventModal/NewEventModal';

import { db } from '../firebase/firebase-config';
import { collection, onSnapshot, getDocs, query, orderBy } from "firebase/firestore";

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
        // console.log(bodyRect);
        const elementRect = element.getBoundingClientRect().top;
        // console.log(elementRect);
        const elementPosition = elementRect - bodyRect;
        // console.log(elementPosition);
        const offsetPosition = elementPosition + offset;
        // console.log(offsetPosition);
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
                        const p = document.createElement('p');
                        orderedEvents.docs.forEach(event => {
                            const eventInfo = event.data();
                            const dayi = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getDate();
                            const monthi = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getMonth();
                            const yeari = (new Date ((eventInfo['Fecha Inicial'].seconds)*1000)).getFullYear();
                            const eventTitle = `${eventInfo.Tipo} - ${dayi+1}/${monthi+1}/${yeari}`;
                            const a = document.createElement('a');
                            a.innerText = eventTitle;
                            a.href = '/EventView';
                            a.onclick = ()=>{
                                localStorage.setItem('currentWell', well.id);
                                localStorage.setItem('eventRef', `${col.id}/${well.id}/eventos/${event.id}`);
                            };
                            p.appendChild(a);
                        });
                        div.appendChild(h3);
                        div.appendChild(p);
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