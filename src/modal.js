import React from 'react';
import './modal.css';


    const Modal = ({ handleClose, showModal, children }) => {
        const showHideClassName = showModal ? "modal display-block" : "modal display-none";

        return (
            <div className={showHideClassName}>
                <section className="modal-main">
                    {children}
                    <button onClick={handleClose} className="closeBtn">Close</button>
                </section>
            </div>
        );
    };

    export default Modal;
