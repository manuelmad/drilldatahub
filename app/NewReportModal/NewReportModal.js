import './NewReportModal.css';

export default function NewReportModal({
    newReportModalDisplay,
    setNewReportModalDisplay
}) {

    // Function to hide new Event Modal
    const hideNewReportModal = ()=> {
        setNewReportModalDisplay({display: 'none'});
    }

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
                        <tbody>
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