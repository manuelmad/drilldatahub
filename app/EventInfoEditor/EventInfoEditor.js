'use client';

import './EventInfoEditor.css';
import { event_types } from '../NewEventModal/NewEventModal';
import { useEffect } from 'react';

import { db } from '../firebase/firebase-config';
import { collection, doc, getDoc, getDocs, updateDoc, query, orderBy, deleteDoc } from "firebase/firestore";

export default function EventInfoEditor({
    eventEditorDisplay,
    setEventEditorDisplay
}) {

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

    // Function to update an event at firebase db
    const updateEvent = () => {
        console.log('event updated');
    }

    // Function to hide new Event Modal
    const hideEventEditor = ()=> {
        setEventEditorDisplay({display: 'none'});
    }

    const getInputsValues = async () => {
        // Get data from localStorage
        let eventRefInStorage = localStorage.getItem('eventRef');

        // Create a ref to the event (doc)
        let eventDoc = doc(db, eventRefInStorage);

        // Get all updated data from the event (doc)
        let eventRef = await getDoc(eventDoc);

        let eventData = eventRef.data();

        document.getElementById('goal_formation').value = eventData.Objetivo;
        document.getElementById('rig_name').value = eventData.Taladro;
        let month = ((new Date ((eventData['Fecha Inicial'].seconds)*1000)).getMonth())+1;
        let day = ((new Date((eventData['Fecha Inicial'].seconds)*1000)).getDate())+1;
        document.getElementById('init_date').value = `${(new Date ((eventData['Fecha Inicial'].seconds)*1000)).getFullYear()}-${month<10 ? '0'+month : month}-${day<10 ? '0'+day : day}`;
        document.getElementById('estimated_time').value = eventData['Tiempo Estimado'];
    }

    useEffect(()=> {
        getInputsValues();
    }, []);

    return(
        <section className='event-editor__container' style={eventEditorDisplay}>
            <div>
                <p>
                    <label htmlFor='event_type_select'>Tipo de evento:</label>
                    <select onChange={showSubtype} id='event_type_select'>
                        {event_types.map(type => {
                            return <option value={type.type} key={type.type}>{type.type}</option>
                        })}
                    </select>
                </p>
                <p>
                    <label htmlFor='event_subtype_select'>Subtipo de evento:</label>
                    <select id='event_subtype_select'>

                    </select>
                </p>
                <p>
                    <label htmlFor='goal_formation'>Objetivo:</label>
                    <input id='goal_formation'>

                    </input>
                </p>
                <p>
                    <label htmlFor='rig_name'>Taladro:</label>
                    <input id='rig_name'>

                    </input>
                </p>
                <p>
                    <label htmlFor='init_date'>Fecha Inicial:</label>
                    <input id='init_date' type='date'>

                    </input>
                </p>
                <p>
                    <label htmlFor='estimated_time'>Tiempo Estimado (días):</label>
                    <input id='estimated_time' type='number'>

                    </input>
                </p>
                <p id='update-event__container'>
                    <button onClick={updateEvent} id='update_event'>ACTUALIZAR EVENTO</button>
                </p>
                <p id='cancel-update-btn__container'>
                    <button onClick={hideEventEditor} id='cancel_update_btn'>CANCELAR</button>
                </p>
            </div>
        </section>
    );
}