import { useEffect, useState } from 'react';
import './NewReportModal.css';

export default function NewReportModal({
    newReportModalDisplay,
    setNewReportModalDisplay
}) {
    const [totalHours, setTotalHours] = useState(0);

    // Function to calculate total hours in reporte
    function calculateTotalDailyHours() {
        const report_table_body = document.getElementById('report_table_body');
        let array = report_table_body.getElementsByClassName("activity-hours");

        let i = 0;

        Array.prototype.forEach.call(
            array, (item)=> {
                i=i+Number(item.innerText);
            }
        );

        //report_total_hours = i;
        setTotalHours(i);
    }

    // Function to hide new Event Modal
    const hideNewReportModal = ()=> {
        setNewReportModalDisplay({display: 'none'});
    }

    // Function to add rows to the table
    const addRow = () => {
        //Create new row
        let new_row = document.createElement("tr");
        new_row.classList.add("tbody-data");

        // Create cells for the new row
        let new_cell = document.createElement("td");
        let new_cell2 = document.createElement("td");
        let new_cell3 = document.createElement("td");
        let new_cell4 = document.createElement("td");
        let new_cell5 = document.createElement("td");

        // Insert all cells into the row
        new_row.appendChild(new_cell);
        new_row.appendChild(new_cell2);
        new_row.appendChild(new_cell3);
        new_row.appendChild(new_cell4);
        new_row.appendChild(new_cell5);

        // Create 2 inputs with their attributes
        let new_input = document.createElement("input");
        new_input.setAttribute("type", "time");
        new_input.setAttribute("min", "00:00");
        new_input.setAttribute("max", "24:00");

        let new_input2 = document.createElement("input");
        new_input2.setAttribute("type", "time");
        new_input2.setAttribute("min", "00:00");
        new_input2.setAttribute("max", "24:00");

        // Insert the 2 inputs into their cells
        new_cell.appendChild(new_input);
        new_cell2.appendChild(new_input2);

        // Create a span
        let new_span = document.createElement("span");
        new_span.classList.add("activity-hours");
        // Insert the span into its cells
        new_cell3.appendChild(new_span);

        // Add event to the inputs to calculate the time of the activity
        new_input.addEventListener('input', (e)=> {
            let i_time_minutes = Number(e.target.value.slice(0,2))*60 + Number(e.target.value.slice(3));
            let f_time_minutes = Number(new_input2.value.slice(0,2))*60 + Number(new_input2.value.slice(3));
            let time = (f_time_minutes - i_time_minutes)/60;
            new_span.innerText = `${time}`;
            calculateTotalDailyHours();
        });

        new_input2.addEventListener('input', (e)=> {
            let i_time_minutes = Number(new_input.value.slice(0,2))*60 + Number(new_input.value.slice(3));
            let f_time_minutes = Number(e.target.value.slice(0,2))*60 + Number(e.target.value.slice(3));
            let time = (f_time_minutes - i_time_minutes)/60;
            new_span.innerText = `${time}`;
            calculateTotalDailyHours();
        });


        // Create 1 select with 2 options
        let new_select = document.createElement("select");
        new_select.classList.add("code"); // code

        let new_option = document.createElement("option");
        new_option.innerText = "P";

        let new_option2 = document.createElement("option");
        new_option2.innerText = "NP";
        // Insert the options into the select
        new_select.appendChild(new_option);
        new_select.appendChild(new_option2);
        // Insert the select into the cell
        new_cell4.appendChild(new_select);

        // Create 1 text area
        let new_textarea = document.createElement("textarea");
        new_textarea.classList.add("activity");
        // Insert the textarea into the cell
        new_cell5.appendChild(new_textarea);

        // Inster the row in the tbody, before the last row
        const report_table_body = document.getElementById('report_table_body');
        let last_row = report_table_body.lastElementChild;
        report_table_body.insertBefore(new_row, last_row);
        //report_table_body.appendChild(new_row);
    }

    function deleteRow() {
        // Counting rows in tbody
        let report_table_body = document.getElementById("report_table_body");
        let rows_qty = report_table_body.getElementsByTagName("tr").length;

        //Condition so the button doesn't work when there is only the default row
        if(rows_qty > 2) {
            // let last_row = report_table_body.lastElementChild;
            // report_table_body.removeChild(last_row);
            report_table_body.deleteRow(rows_qty-2)
        }

        // Actualizo las horas totales del reporte
        //calculateTotalDailyHours();
    }

    useEffect(()=> {
        // Handling the inputs od the 1st row and show the hours in the span
        let activity_hours_span = document.getElementById("activity_hours");
        let initial_time_input = document.getElementById("initial_time");
        let final_time_input = document.getElementById("final_time");

        initial_time_input.addEventListener('input', (e)=> {
            let i_time_minutes = Number(e.target.value.slice(0,2))*60 + Number(e.target.value.slice(3));
            let f_time_minutes = Number(final_time_input.value.slice(0,2))*60 + Number(final_time_input.value.slice(3));
            let time = (f_time_minutes - i_time_minutes)/60;
            activity_hours_span.innerText = `${time}`;
            calculateTotalDailyHours()
        });

        final_time_input.addEventListener('input', (e)=> {
            let i_time_minutes = Number(initial_time_input.value.slice(0,2))*60 + Number(initial_time_input.value.slice(3));
            let f_time_minutes = Number(e.target.value.slice(0,2))*60 + Number(e.target.value.slice(3));
            let time = (f_time_minutes - i_time_minutes)/60;
            activity_hours_span.innerText = `${time}`;
            calculateTotalDailyHours()
        });
    },[]);

    return(
        <section style={newReportModalDisplay} className='new-report__section'>
            <div className='new-report__modal'>
                <p>Fecha: <input type='date' id='new_report_date_forTable' /> </p>
                <p>
                    <span>Tipo de reporte: </span>
                    <select id='report_type_select_forTable'>
                    <option value={'--------'}>--------</option>
                        <option value={'Mudanza'}>Mudanza</option>
                        <option value={'Operaciones'}>Operaciones</option>
                        <option value={'Mantenimiento'}>Mantenimiento</option>
                    </select>
                </p>
                <p className='rows-btns__container'>
                    <button onClick={addRow} id="add_row">+</button>
                    <button onClick={deleteRow} id="delete_row">-</button>
                </p>
                <div className='new-report-table__container'>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="5">PETROPERIJÁ S.A.</th>
                            </tr>
                            <tr>
                                <th colSpan="5">Reporte Diario de Operaciones</th>
                            </tr>
                            <tr>
                                <th>Desde</th>
                                <th>Hasta</th>
                                <th>Total</th>
                                <th>Código</th>
                                <th>Operaciones</th>
                            </tr>
                        </thead>
                        <tbody id='report_table_body'>
                            <tr>
                                <td>
                                    <input id="initial_time" type='time' min="00:00" max="24:00"/>
                                </td>
                                <td>
                                    <input id="final_time" type='time' min="00:00" max="24:00"/>
                                </td>
                                <td><span className="activity-hours" id="activity_hours"></span></td>
                                <td>
                                    <select>
                                        <option>P</option>
                                        <option>NP</option>
                                    </select>
                                </td>
                                <td><textarea></textarea></td>
                            </tr>
                            <tr id='last_row'>
                                <td colSpan="2"></td>
                                <td>
                                    <span id='totalHours_container'>{totalHours}</span>
                                </td>
                                <td colSpan="2"></td>
                            </tr>
                        </tbody>

                    </table>

                </div>
                <p>
                    <button id='send_new_report_btn'>ENVIAR REPORTE</button>
                </p>
                <p id='cancel-event-btn__container'>
                    <button onClick={hideNewReportModal} id='cancel_event_btn'>CANCELAR</button>
                </p>
            </div>
        </section>
    );
}