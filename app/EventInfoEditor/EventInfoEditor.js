import './EventInfoEditor.css';
import { event_types } from '../NewEventModal/NewEventModal';

import { db } from '../firebase/firebase-config';
import { doc, setDoc } from "firebase/firestore";

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
    const updateEvent = async () => {
        // Getting all values
        const event_type = document.getElementById('event_type_select').value;
        const event_subtype = document.getElementById('event_subtype_select').value;
        const formation_name = document.getElementById('goal_formation').value;
        const rig_name = document.getElementById('rig_name').value;
        const init_date = document.getElementById('init_date').valueAsNumber;
        const estimated_time = document.getElementById('estimated_time').value;

        // Stablishing conditions so the user HAS to fill all the fields.
        if(event_type === '--------' || event_subtype === '--------') {
            alert(`Por favor, seleccione un tipo y subtipo de evento. Esto podrá ser modificado luego en caso de errores.`);
            return;
        }

        if(formation_name === '') {
            alert(`Por favor, ingrese el nombre de la formación objetivo del evento. Esto podrá ser modificado luego en caso de errores.`);
            return;
        }

        if(formation_name === '') {
            alert(`Por favor, ingrese el nombre de la formación objetivo del evento. Esto podrá ser modificado luego en caso de errores.`);
            return;
        }

        if(rig_name === '') {
            alert(`Por favor, ingrese el nombre del equipo / taladro con que se ejecutan las operaciones del evento. Esto podrá ser modificado luego en caso de errores.`);
            return;
        }

        if(document.getElementById('init_date').value == '') {
            alert(`Por favor, ingrese una fecha inicial válida para el evento. Esto podrá ser modificado luego en caso de errores.`);
            return;
        }

        if(Number(estimated_time) === 0) {
            alert(`Por favor, ingrese un tiempo estimado para el evento. Esto podrá ser modificado luego en caso de errores.`);
            return;
        }

        // Get data from localStorage
        let eventRefInStorage = localStorage.getItem('eventRef');

        // Create a ref to the event (doc)
        let eventDoc = doc(db, eventRefInStorage);

        // Update event
        await setDoc(eventDoc, {
            'Tipo': event_type,
            'Subtipo': event_subtype,
            'Objetivo': formation_name,
            'Taladro': rig_name,
            'Fecha Inicial':{
                seconds: init_date/1000
            },
            'Tiempo Estimado': Number(estimated_time)
        });

        window.location.reload(); // I can't find a better way to update the list of events at 'events_container'
    }

    // Function to hide new Event Modal
    const hideEventEditor = ()=> {
        setEventEditorDisplay({display: 'none'});
    }

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