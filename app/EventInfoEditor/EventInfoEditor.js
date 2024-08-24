import './EventInfoEditor.css';
import { event_types } from '../NewEventModal/NewEventModal';

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
    return(
        <section style={eventEditorDisplay}>
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
                <p id='new-event__container'>
                    <button onClick={updateEvent} id='new_event'>ACTUALIZAR EVENTO</button>
                </p>
                <p id='cancel-event-btn__container'>
                    <button onClick={hideEventEditor} id='cancel_event_btn'>CANCELAR</button>
                </p>
            </div>
        </section>
    );
}