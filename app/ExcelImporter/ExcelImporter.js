import './ExcelImporter.css';

export default function ExcelImporter() {

    const sendReport = () => {
        const reportDate = document.getElementById('new_report_date').value;
        const reportType = document.getElementById('report_type_select').value;
        const excelFile = document.getElementById('file_report').value;

        console.log(reportDate, reportType, excelFile);
    }

    const hideImportDiv = () => {
        const div = document.querySelector('.import-container');
        div.style.display = 'none';
    }

    return (
        <div className='import-container'>
            <p>Fecha: <input type='datetime-local' id='new_report_date' /> </p>
            <p>
                <span>Tipo de reporte:</span>
                <select id='report_type_select'>
                <option value={'--------'}>--------</option>
                    <option value={'Mudanza'}>Mudanza</option>
                    <option value={'Operaciones'}>Operaciones</option>
                    <option value={'Mantenimiento'}>Mantenimiento</option>
                </select>
            </p>
            <p><input id='file_report' accept='.xls, .xlsx' type='file' /></p>
            <p>
                <button onClick={sendReport} id='send_new_report_btn'>ENVIAR REPORTE</button>
            </p>
            <p>
                <button id='new_report_cancel' onClick={hideImportDiv}>CANCELAR</button>
            </p>
        </div>
    );
}