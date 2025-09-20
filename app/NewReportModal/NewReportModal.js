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
        <section style={newReportModalDisplay}>
            <div className='new-report__modal'>
                <p id='cancel-event-btn__container'>
                    <button onClick={hideNewReportModal} id='cancel_event_btn'>CANCELAR</button>
                </p>
            </div>
        </section>
    );
}