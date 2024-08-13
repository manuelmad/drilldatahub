import './NewEventModal.css';
import { db } from '../firebase/firebase-config';
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";

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

export default function NewEventModal ({
    newEventModalDisplay,
    setNewEventModalDisplay
}) {

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
        const wells = ref.docs;

        const well_deafult_option = document.createElement('option');
        well_deafult_option.innerText = '--------';
        well_deafult_option.value = '--------';
        well_select.appendChild(well_deafult_option);

        // Adding an option in the wells select for each well in the collection
        wells.forEach(well => {
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

    // Function to create a new event at firebase db
    const createEvent = async () => {
        // Getting all values
        const field_name = document.getElementById('field_select').value;
        const well_name = document.getElementById('well_select').value;
        const event_type = document.getElementById('event_type_select').value;
        const event_subtype = document.getElementById('event_subtype_select').value;
        const formation_name = document.getElementById('goal_formation').value;
        const rig_name = document.getElementById('rig_name').value;
        const init_date = document.getElementById('init_date').valueAsNumber;
        //const final_date = document.getElementById('final_date').value;
        const estimated_time = document.getElementById('estimated_time').value;

        // Stablishing conditions so the user HAS to fill all the fields.
        if(field_name === '--------') {
            alert('Por favor, seleccione un campo del bloque DZO.');
            return;
        }

        if(well_name === '--------') {
            alert(`Por favor, seleccione un pozo del campo ${document.getElementById('field_select').value}.`);
            return;
        }

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

        //console.log(field_name, well_name, event_type, event_subtype, formation_name, rig_name, init_date, estimated_time);
        // Creating the 'eventos' collection and its reference
        const eventsCollectionRef = collection(db, `${field_name}/${well_name}/eventos`);

        // Creating a new Doc in the eventos collection, with an automatic id (addDoc)
        await addDoc(eventsCollectionRef, {
            'Tipo': event_type,
            'Subtipo': event_subtype,
            'Objetivo': formation_name,
            'Taladro': rig_name,
            'Fecha Inicial':{
                seconds: init_date/1000
            },
            'Fecha Final':{
                seconds: NaN /*(new Date(final_date).getTime())/1000*/
            },
            'Tiempo Estimado': Number(estimated_time)
        });
        window.location.reload(); // I can't find a better way to update the list of events at 'events_container'
    }

    return(
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
                <input id='init_date' type='date'>

                </input>
            </p>
            {/* <p>
                <label htmlFor='init_date'>Indique la FECHA FINAL del evento:</label>
                <input id='final_date' type='datetime-local'>

                </input>
            </p> */}
            <p>
                <label htmlFor='estimated_time'>Indique el TIEMPO ESTIMADO del evento (días):</label>
                <input id='estimated_time' type='number'>

                </input>
            </p>
            <p id='new-event__container'>
                <button onClick={createEvent} id='new_event'>CREAR EVENTO</button>
            </p>
            <p id='cancel-event-btn__container'>
                <button onClick={hideNewEventModal} id='cancel_event_btn'>CANCELAR</button>
            </p>
        </div>
    </section>
    );
}