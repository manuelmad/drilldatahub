'use client';

import './EventView.css';
import Header from '../Header/Header';
import { useEffect } from 'react';

import { db } from '../firebase/firebase-config';
import { collection, onSnapshot, getDocs } from "firebase/firestore";

export default function EventView() {

    // const event_info_container = document.getElementById('event-info_container');

    const getEventInfo = async () => {
        const event_info_container = document.getElementById('event-info_container');
        let eventData = localStorage.getItem('eventData');
        let eventInStorage = JSON.parse(eventData);

        let reportsRef = localStorage.getItem('reportsRef');
        const newRef = collection(db, `${reportsRef}/reportes`);
        const reports = await getDocs(newRef);

        const article1 = document.createElement('article');
        const p1 = document.createElement('p');
        p1.innerHTML = `Fecha inicial: ${eventInStorage['Fecha Inicial']}.`;
        const p2 = document.createElement('p');
        p2.innerHTML = `Fecha final: ${eventInStorage['Fecha Final']}.`;
        const p3 = document.createElement('p');
        p3.innerHTML = `Tipo de evento: ${eventInStorage.Tipo}.`;
        const p4 = document.createElement('p');
        p4.innerHTML = `Subtipo de evento: ${eventInStorage.Subtipo}.`;
        article1.appendChild(p1);
        article1.appendChild(p2);
        article1.appendChild(p3);
        article1.appendChild(p4);
        event_info_container.appendChild(article1);

        const article2 = document.createElement('article');
        const p5 = document.createElement('p');
        p5.innerHTML = `Reportes:`;
        article2.appendChild(p5);

        reports.docs.forEach(report => {
            const reportInfo = report.data();
            const a = document.createElement('a');
            a.innerHTML = `${reportInfo.Tipo} - ${(new Date ((reportInfo['Fecha'].seconds)*1000)).getDate()}/${(new Date ((reportInfo['Fecha'].seconds)*1000)).getMonth()}/${(new Date ((reportInfo['Fecha'].seconds)*1000)).getFullYear()}.`;
            article2.appendChild(a);
        });
        event_info_container.appendChild(article2);
    }

    useEffect(()=> {
        const event_info_container = document.getElementById('event-info_container');
        event_info_container.innerHTML = '';
        getEventInfo();
    }, []);
    
    return(
        <>
            <Header></Header>
            <main>
                <section id='event-info_container'>
                    {/* <article>
                        <p>Fecha inicial: {eventData['Fecha Inicial']}</p>
                        <p>Fecha final: {eventData['Fecha Final']}</p>
                        <p>Tipo de evento: {eventData.Tipo}</p>
                        <p>Subtipo de evento: {eventData.Subtipo}</p>
                    </article> */}
                </section>
            </main>
        </>
    );
}