'use client';

import './EventView.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ExcelImporter from '../ExcelImporter/ExcelImporter';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { HeaderContext } from '../context/context';

import { db } from '../firebase/firebase-config';
import { getAuth, onAuthStateChanged  } from "firebase/auth";
import { collection, doc, getDoc, getDocs, updateDoc, query, orderBy, deleteDoc } from "firebase/firestore";
import EventInfoEditor from '../EventInfoEditor/EventInfoEditor';

import { event_types } from '../NewEventModal/NewEventModal';

export default function EventView() {

    const [eventEditorDisplay, setEventEditorDisplay] = useState({display: 'none'});

    const getEventInfo = async () => {
        const event_info_container = document.getElementById('event-info_container');

        // Get data from localStorage
        let wellName = localStorage.getItem('currentWell');
        let eventRefInStorage = localStorage.getItem('eventRef');

        // Setting data in localStorage for later use
        const reportsInEvent = `${eventRefInStorage}/reportes`;
        const reportsInEventRef = collection(db, reportsInEvent);
        localStorage.setItem('reportsInEvent', reportsInEvent); // Setting a value used later in ExcelImporter component

        // Create a ref to the event (doc)
        let eventDoc = doc(db, eventRefInStorage);
        
        // Get ordered data by date from database (I'll use this one instead)
        const q = query(reportsInEventRef, orderBy("Fecha"));
        const orderedReports = await getDocs(q);

        // If there is at least 1 report, get the last report's date and stablishes it as the final event's date
        let orderedReportsLenght =  orderedReports.docs.length;
        if(orderedReportsLenght > 0) {
            let finalDate = orderedReports.docs[orderedReportsLenght-1].data()['Fecha'].seconds;
            // Establish the event's final date
            await updateDoc(eventDoc, {
                'Fecha Final':{
                    seconds: finalDate
                }
            });
        } else {
            // Establish the event's final date as NaN
            await updateDoc(eventDoc, {
                'Fecha Final':{
                    seconds: NaN
                }
            });
        }

        // Get all updated data from the event (doc)
        let eventRef = await getDoc(eventDoc);
        let eventData = eventRef.data();

        // Create article to show general info about the event
        const article1 = document.createElement('article');
        const h2 = document.createElement('h2');
        h2.innerHTML = `${wellName}`;
        const p1 = document.createElement('p');
        p1.innerHTML = `Fecha inicial: ${((new Date((eventData['Fecha Inicial'].seconds)*1000)).getDate())+1}/${((new Date ((eventData['Fecha Inicial'].seconds)*1000)).getMonth())+1}/${(new Date ((eventData['Fecha Inicial'].seconds)*1000)).getFullYear()}.`;
        const p2 = document.createElement('p');
        const validFinalDate = `${((new Date((eventData['Fecha Final'].seconds)*1000)).getDate())+1}/${((new Date ((eventData['Fecha Final'].seconds)*1000)).getMonth())+1}/${(new Date ((eventData['Fecha Final'].seconds)*1000)).getFullYear()}`;
        p2.innerHTML = `Fecha final: ${isNaN(eventData['Fecha Final'].seconds) ? 'No Disponible' : validFinalDate}.`;
        const p3 = document.createElement('p');
        p3.innerHTML = `Tipo de evento: ${eventData.Tipo}.`;
        const p4 = document.createElement('p');
        p4.innerHTML = `Subtipo de evento: ${eventData.Subtipo}.`;
        const p5 = document.createElement('p');
        p5.innerHTML = `Taladro: ${eventData.Taladro}.`;
        const p6 = document.createElement('p');
        p6.innerHTML = `Objetivo: ${eventData.Objetivo}.`;
        const p7 = document.createElement('p');
        p7.innerHTML = `Tiempo Estimado: ${eventData['Tiempo Estimado']} días.`;
        const p8 = document.createElement('p');
        const eventInfoEditButton = document.createElement('button');
        eventInfoEditButton.innerText = 'Editar';
        eventInfoEditButton.onclick = () => {
            // Setting values for selects
            // Setting as selected the option of type equal to the existing in the db
            let options = document.getElementById('event_type_select').children;
            [...options].forEach(option => {
                if(option.value === eventData.Tipo) {
                    option.selected = true;
                }
            });

            // Adding suptypes into the corresponding select abd setting as selected the option of subtype equal to the existing in the db
            const event_subtype_select = document.getElementById('event_subtype_select');
            event_subtype_select.innerHTML = '';
            const typeValue = document.getElementById('event_type_select').value;
            const typeMatch = event_types.find(type => type.type === typeValue);
            typeMatch.subtypes.forEach(subtype => {
                const subtype_option = document.createElement('option');
                subtype_option.innerText = subtype;
                subtype_option.value = subtype;
                event_subtype_select.appendChild(subtype_option);
            });
            let subOptions = document.getElementById('event_subtype_select').children;
            console.log(subOptions);
            [...subOptions].forEach(option => {
                if(option.value === eventData.subOptions) {
                    option.selected = true;
                }
            });
        
            // Setting the values for inputs
            document.getElementById('goal_formation').value = eventData.Objetivo;
            document.getElementById('rig_name').value = eventData.Taladro;
            let month = ((new Date ((eventData['Fecha Inicial'].seconds)*1000)).getMonth())+1;
            let day = ((new Date((eventData['Fecha Inicial'].seconds)*1000)).getDate())+1;
            document.getElementById('init_date').value = `${(new Date ((eventData['Fecha Inicial'].seconds)*1000)).getFullYear()}-${month<10 ? '0'+month : month}-${day<10 ? '0'+day : day}`;
            document.getElementById('estimated_time').value = eventData['Tiempo Estimado'];
            setEventEditorDisplay({display: 'block'});
        }
        
        p8.appendChild(eventInfoEditButton);
        article1.appendChild(h2);
        article1.appendChild(p5);
        article1.appendChild(p3);
        article1.appendChild(p4);
        article1.appendChild(p6);
        article1.appendChild(p7);
        article1.appendChild(p1);
        article1.appendChild(p2);
        article1.appendChild(p8);
        event_info_container.appendChild(article1);

        // Create article to show a list of existing reports
        const article2 = document.createElement('article');
        const h4Reports = document.createElement('h4');
        h4Reports.innerHTML = `Reportes:`;
        article2.appendChild(h4Reports);

        const reportViewer = document.getElementById('current-report__container');

        orderedReports.docs.forEach(report => {
            const reportInfo = report.data();
            const a = document.createElement('a');
            const p = document.createElement('p');
            a.innerHTML = `${reportInfo.Tipo} - ${((new Date ((reportInfo['Fecha'].seconds)*1000)).getDate())+1}/${((new Date ((reportInfo['Fecha'].seconds)*1000)).getMonth())+1}/${(new Date ((reportInfo['Fecha'].seconds)*1000)).getFullYear()}.`;
            const span = document.createElement('span');
            span.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
            `;
            span.onclick = async () => {
                await deleteDoc(doc(db, `${reportsInEvent}/${report.id}`));
                window.location.reload(); // I can't find a better way to update the list of events at 'events_container'
            }
            p.appendChild(a);
            p.appendChild(span);
            article2.appendChild(p);
            // Event to create a table when a report in the list is clicked
            a.addEventListener('click', ()=> {
                reportViewer.innerHTML = '';
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                table.appendChild(thead);
                table.appendChild(tbody);

                const trhead1 = document.createElement('tr');
                const tdhead1 = document.createElement('th');
                tdhead1.setAttribute('colspan', 5);
                tdhead1.innerHTML = 'PETROPERIJÁ S.A';
                trhead1.appendChild(tdhead1);

                const trhead2 = document.createElement('tr');
                const tdhead2 = document.createElement('th');
                tdhead2.setAttribute('colspan', 5);
                tdhead2.innerHTML = 'Reporte Diario de Operaciones';
                trhead2.appendChild(tdhead2);

                const trhead3 = document.createElement('tr');
                const tdhead3 = document.createElement('th');
                tdhead3.setAttribute('colspan', 5);
                tdhead3.innerHTML = `Fecha: ${((new Date ((reportInfo['Fecha'].seconds)*1000)).getDate())+1}/${((new Date ((reportInfo['Fecha'].seconds)*1000)).getMonth())+1}/${(new Date ((reportInfo['Fecha'].seconds)*1000)).getFullYear()}`;
                trhead3.appendChild(tdhead3);

                const trhead4 = document.createElement('tr');
                const tdhead4_1 = document.createElement('th');
                tdhead4_1.innerHTML = 'Desde';
                const tdhead4_2 = document.createElement('th');
                tdhead4_2.innerHTML = 'Hasta';
                const tdhead4_3 = document.createElement('th');
                tdhead4_3.innerHTML = 'Total';
                const tdhead4_4 = document.createElement('th');
                tdhead4_4.innerHTML = 'Código';
                const tdhead4_5 = document.createElement('th');
                tdhead4_5.innerHTML = 'Operaciones';
                trhead4.appendChild(tdhead4_1);
                trhead4.appendChild(tdhead4_2);
                trhead4.appendChild(tdhead4_3);
                trhead4.appendChild(tdhead4_4);
                trhead4.appendChild(tdhead4_5);

                thead.appendChild(trhead1);
                thead.appendChild(trhead2);
                thead.appendChild(trhead3);
                thead.appendChild(trhead4);

                let hoursInDay = 0;

                reportInfo.Actividades.forEach(activity => {
                    const trbody = document.createElement('tr');
                    const td1 = document.createElement('td');
                    let a = (((activity.Desde)/60)-Math.floor((activity.Desde)/60))*60;
                    td1.innerHTML = `${Math.floor((activity.Desde)/60)}:${a === 0 ? '00' : a.toFixed(0)}`;
                    const td2 = document.createElement('td');
                    let b = (((activity.Hasta)/60)-Math.floor((activity.Hasta)/60))*60;
                    td2.innerHTML = `${Math.floor((activity.Hasta)/60)}:${b === 0 ? '00' : b.toFixed(0)}`;
                    const td3 = document.createElement('td');
                    let c = (((activity.Total)/60)-Math.floor((activity.Total)/60))*60;
                    td3.innerHTML = `${Math.floor((activity.Total)/60)}:${c === 0 ? '00' : c.toFixed(0)}`;
                    const td4 = document.createElement('td');
                    td4.innerHTML = `${activity.Código}`;
                    td4.setAttribute('class', 'code-column')
                    const td5 = document.createElement('td');
                    td5.innerHTML = `${activity.Actividad}`;
                    trbody.appendChild(td1);
                    trbody.appendChild(td2);
                    trbody.appendChild(td3);
                    trbody.appendChild(td4);
                    trbody.appendChild(td5);
                    tbody.appendChild(trbody);

                    hoursInDay = hoursInDay + (activity.Total)/60;
                });
                const trbody2 = document.createElement('tr');
                trbody2.setAttribute('class', 'last-row')
                const td6 = document.createElement('td');
                td6.setAttribute('colspan', 2);
                // td6.innerHTML = 'Horas totales:';
                const td7 = document.createElement('td');
                td7.innerHTML = `${hoursInDay.toFixed(0)}`;
                const td8 = document.createElement('td');
                const td9 = document.createElement('td');
                trbody2.appendChild(td6);
                trbody2.appendChild(td7);
                trbody2.appendChild(td8);
                trbody2.appendChild(td9);
                tbody.appendChild(trbody2);
                reportViewer.appendChild(table);
            });
        });
        event_info_container.appendChild(article2);
    }

    const showImportDiv = () => {
        const div = document.querySelector('.import-container');
        div.style.display = 'block';
    }

    // Getting the states from de context so the function onAuthStateChanged doesn´t cause an error
    let { setLoginHeaderButton, setLogoutHeaderButton } = useContext(HeaderContext);

    useEffect(()=> {
        // Check state of auth and display the correponding view in Header
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
            setLoginHeaderButton({display:"none"});
            setLogoutHeaderButton({display:"block"});
            } else {
            setLoginHeaderButton({display:"block"});
            setLogoutHeaderButton({display:"none"});
            }
        })

        // Cleaning the event container and adding the new information
        const event_info_container = document.getElementById('event-info_container');
        event_info_container.innerHTML = '';
        getEventInfo();
    }, []);
    
    return(
        <>
            <Header></Header>
            <main>
                <section id='event-info_container'>

                </section>
                <section className='new-report-btn__container'>
                    <p>
                        <button id='create_new_report_btn' onClick={showImportDiv}>Importar nuevo reporte</button>
                    </p>
                    <ExcelImporter></ExcelImporter>
                </section>
                <section id='current-report__container'></section>
                <EventInfoEditor
                    eventEditorDisplay={eventEditorDisplay}
                    setEventEditorDisplay={setEventEditorDisplay}
                />
            </main>
            <Footer />
        </>
    );
}