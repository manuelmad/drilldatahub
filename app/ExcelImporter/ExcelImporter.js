import './ExcelImporter.css';
import * as XLS from 'xlsx'; // Importing the library to import excel files
import { db } from '../firebase/firebase-config';
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";

export default function ExcelImporter() {
    // Variable to save all the rows of the excel file
    let result = [];

    // Function to transform all the rows of the excel file into objects
    const jsonFromExcel = () => {
        // Getting the excel file from input
        let file = document.querySelector("#file_report").files[0];

        // Getting the file type
        let type = file.name.split('.');

        // Show an alert in case a non-excel file is selected (maybe is not necessary because I used the 'accept' attribute in the input)
        if (type[type.length - 1] !== 'xlsx' && type[type.length - 1] !== 'xls') {
            alert ('Seleccione solo el archivo de Excel para importar');
            return false;
        }

        // Calling the library to import an excel file
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (e) => {
            const data = e.target.result;
            const zzexcel = XLS.read(data, {
                type: 'binary'
            });

            result = []; // Cleaning the array before adding elements

            // Code to go through all sheets in the excel file, creating an object for every row and adding it as a new element in the "result" array
            for (let i = 0; i < zzexcel.SheetNames.length; i++) {
                const newData = XLS.utils.sheet_to_json(zzexcel.Sheets[zzexcel.SheetNames[i]]);
                result.push(...newData)
            }
            console.log('result', result);
        }
    }

    // Function to send the imported report to firebase database
    const sendReport = async () => {
        // Getting the value saved from EventView component
        let reportsInEvent = localStorage.getItem('reportsInEvent');
        // Creating a ref with that value
        const reportsInEventRef = collection(db, reportsInEvent);

        // Getting values from HTML
        const reportDate = document.getElementById('new_report_date').valueAsNumber;
        const reportType = document.getElementById('report_type_select').value;
        console.log(reportDate, document.getElementById('new_report_date').value, document.getElementById('new_report_date').value);

        // Variable to save the objects created from the excel file
        let activities = [];

        // Function to push in the array an object for every row in the excel
        result.forEach(row => {
            let object = {
                Código: row.CODIGO,
                Desde: Number(row.DESDE*24*60).toFixed(0),
                Hasta: Number(row.HASTA*24*60).toFixed(0),
                Actividad: row.OPERACIONES,
                Total: Number(row.TOTAL*24*60).toFixed(0),
            }
            activities.push(object);
        });

        // Creating a new Doc in the eventos collection, with an automatic id (addDoc)
        await addDoc(reportsInEventRef, {
            'Fecha':{
                seconds: (reportDate)/1000
            },
            'Tipo': reportType,
            'Actividades': activities // Sending an array of objects to firebase
        });
        window.location.reload(); // I can't find a better way to update the list of events at 'events_container'
    }

    const hideImportDiv = () => {
        const div = document.querySelector('.import-container');
        div.style.display = 'none';
    }

    return (
        <div className='import-container'>
            <p>Fecha: <input type='date' id='new_report_date' /> </p>
            <p>
                <span>Tipo de reporte:</span>
                <select id='report_type_select'>
                <option value={'--------'}>--------</option>
                    <option value={'Mudanza'}>Mudanza</option>
                    <option value={'Operaciones'}>Operaciones</option>
                    <option value={'Mantenimiento'}>Mantenimiento</option>
                </select>
            </p>
            <p><input id='file_report' accept='.xls, .xlsx' type='file' onChange={jsonFromExcel}/></p>
            <p>
                <button onClick={sendReport} id='send_new_report_btn'>ENVIAR REPORTE</button>
            </p>
            <p>
                <button id='new_report_cancel' onClick={hideImportDiv}>CANCELAR</button>
            </p>
        </div>
    );
}