import { faCheckCircle, faExclamationTriangle, faTrashAlt, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    type: 'approve' | 'reject' | 'delete';
    title: string;
    message: string;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, type, title, message }: ModalProps) => {
    if (!isOpen) return null;

    const config = {
        approve: { icon: faCheckCircle, colorClass: 'approve_theme' },
        reject: { icon: faXmarkCircle, colorClass: 'reject_theme' },
        delete: { icon: faTrashAlt, colorClass: 'delete_theme' }
    };

    const currentConfig = config[type];

    return (
        <section className="modal_overlay">
            <div className={`modal_container ${currentConfig.colorClass}`}>
                <div className="modal_icon">
                    <FontAwesomeIcon icon={currentConfig.icon} />
                </div>

                <div className="modal_content">
                    <h2>{title}</h2>
                    <p>{message}</p>
                </div>

                <div className="modal_actions">
                    <button className="cancel_btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="confirm_btn" onClick={onConfirm}>
                        {type === 'delete' ? 'Delete Now' : type === 'approve' ? 'Approve' : 'Reject'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ConfirmationModal;
