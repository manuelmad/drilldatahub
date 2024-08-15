'use client';

import './EventView.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ExcelImporter from '../ExcelImporter/ExcelImporter';
import { useEffect } from 'react';
import { useContext } from 'react';
import { HeaderContext } from '../context/context';

import { db } from '../firebase/firebase-config';
import { getAuth, onAuthStateChanged  } from "firebase/auth";
import { collection, doc, getDoc, getDocs, updateDoc, query, orderBy } from "firebase/firestore";

export default function EventView() {

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
        article1.appendChild(h2);
        article1.appendChild(p5);
        article1.appendChild(p3);
        article1.appendChild(p4);
        article1.appendChild(p6);
        article1.appendChild(p7);
        article1.appendChild(p1);
        article1.appendChild(p2);
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
            a.innerHTML = `${reportInfo.Tipo} - ${((new Date ((reportInfo['Fecha'].seconds)*1000)).getDate())+1}/${((new Date ((reportInfo['Fecha'].seconds)*1000)).getMonth())+1}/${(new Date ((reportInfo['Fecha'].seconds)*1000)).getFullYear()}.`;
            article2.appendChild(a);
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
            </main>
            <Footer />
        </>
    );
}