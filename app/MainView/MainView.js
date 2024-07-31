'use client';

import './MainView.css';
//import Header from '../Header/Header';

import { db } from '../firebase/firebase-config';
import { collection, onSnapshot, getDocs } from "firebase/firestore";

import { useEffect, useState } from "react";

export default function MainView({
    mainViewDisplay
}) {

    const [newEventModalDisplay, setNewEventModalDisplay] = useState({display: 'none'});

    // Get all fields collections from firebase
    const alpufCollection = collection(db, 'alpuf');
    const alturitasCollection = collection(db, 'alturitas');
    const machiquesCollection = collection(db, 'machiques');
    const sanjoseCollection = collection(db, 'sanjose');
    const sanjulianCollection = collection(db, 'sanjulian');

    // Array containing all collections
    const collectionsArrayByField = [alpufCollection, alturitasCollection, machiquesCollection, sanjoseCollection, sanjulianCollection];

    // Array containing all event types
    const event_types = [
        {
            type: '--------',
            subtypes: ['--------']
        },
        {
            type: 'Perforación',
            subtypes: ['Original', 'Side Track', 'Re Entry', 'Grass Root']
        },
        {
            type: 'Servicio',
            subtypes: ['RIBES', 'Conexión Superficial']
        },
        {
            type: 'RA/RC',
            subtypes: ['Cambio de método', 'Limpieza de fondo', 'Pesca']   
        }
    ];

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

    // Function to hide new Event Modal
    const hideNewEventModal = ()=> {
        setNewEventModalDisplay({display: 'none'});
    }

    // Function to add options in the wells select, corresponding to the selected field
    const showWellsField = async (e) => {
        // Clearing wells select
        const well_select = document.getElementById('well_select');
        well_select.innerHTML = '';
        // Getting the corresponding collection id
        const col_id = e.target.value
        if(col_id === '--------') {
            return;
        }
        const col = collection(db, col_id);

        // Getting the docs of the collection
        const ref = await getDocs(col);
        const well = ref.docs;

        const well_deafult_option = document.createElement('option');
        well_deafult_option.innerText = '--------';
        well_deafult_option.value = '--------';
        well_select.appendChild(well_deafult_option);

        // Adding an option in the wells select for each well in the collection
        well.forEach(well => {
            const well_option = document.createElement('option');
            well_option.innerText = well.id;
            well_option.value = well.id;
            well_select.appendChild(well_option);
        })
    }

    // function to add options in the subtype select, corrsponding to the selected type event
    const showSubtype = (e) => {
        const event_subtype_select = document.getElementById('event_subtype_select');
        event_subtype_select.innerHTML = '';
        const typeValue = e.target.value;
        const typeMatch = event_types.find(type => type.type === typeValue);
        typeMatch.subtypes.forEach(subtype => {
            const subtype_option = document.createElement('option');
            subtype_option.innerText = subtype;
            subtype_option.value = subtype;
            event_subtype_select.appendChild(subtype_option);
        });

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
    }, []);

    return(
        <>
            {/* <Header></Header> */}
            <main style={mainViewDisplay}>
                <section>
                    <div id="events_container">

                    </div>
                </section>
                <section>
                    <div id='create-event-btn__container'>
                        <button onClick={showNewEventModal} id='create_event_btn'>CREAR NUEVO EVENTO</button>
                    </div>
                </section>
                <section style={newEventModalDisplay}>
                    <div className='new-event__modal'>
                        <p>
                            <label htmlFor='field_select'>Seleccione el CAMPO donde se ejecutará el evento:</label>
                            <select onChange={showWellsField} id='field_select'>

                            </select>
                        </p>
                        <p>
                            <label htmlFor='well_select'>Seleccione un POZO del campo seleccionado anteriormente:</label>
                            <select id='well_select'>

                            </select>
                        </p>
                        <p>
                            <label htmlFor='event_type_select'>Seleccione el TIPO del evento a ejecutar en el pozo:</label>
                            <select onChange={showSubtype} id='event_type_select'>
                                {event_types.map(type => {
                                    return <option value={type.type} key={type.type}>{type.type}</option>
                                })}
                            </select>
                        </p>
                        <p>
                            <label htmlFor='event_subtype_select'>Seleccione el SUBTIPO del evento a ejecutar en el pozo:</label>
                            <select id='event_subtype_select'>

                            </select>
                        </p>
                        <p>
                            <label htmlFor='goal_formation'>Indique la formación OBJETIVO en el pozo:</label>
                            <input id='goal_formation'>

                            </input>
                        </p>
                        <p>
                            <label htmlFor='rig_name'>Indique el EQUIPO / TALADRO con que se ejecutarán las actividades:</label>
                            <input id='rig_name'>

                            </input>
                        </p>
                        <p>
                            <label htmlFor='init_date'>Indique la FECHA DE INICIO del evento:</label>
                            <input id='init_date'>

                            </input>
                        </p>
                        <p>
                            <label htmlFor='estimated_time'>Indique el TIEMPO ESTIMADO del evento:</label>
                            <input id='estimated_time' type='number'>

                            </input>
                        </p>
                        <p id='cancel-event-btn__container'>
                            <button onClick={hideNewEventModal} id='cancel_event_btn'>CANCELAR</button>
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}