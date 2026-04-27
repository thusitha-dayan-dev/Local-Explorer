import { motion, AnimatePresence } from 'framer-motion';
import { CircleAlert, X, Trash2 } from 'lucide-react';
import React from 'react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    item: any;
    type: 'main' | 'sub' | 'service';
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, item, type }) => {
    if (!item) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="overlay-backdrop"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="modal-container delete-modal"
                    >
                        <button className="close-x" onClick={onClose}>
                            <X size={20} />
                        </button>

                        <div className="icon-wrapper delete-icon-bg">
                            <CircleAlert size={40} color="#ef4444" />
                        </div>

                        <h2>Are you sure?</h2>
                        <p>
                            You are about to delete <strong>{type === 'main' ? item.category_name : item.sub_category_name}</strong>.
                        </p>

                        {(type === 'main' || (type === 'sub' && item.place_count > 0)) && (
                            <div className="warning-box">
                                <p className="warning-title">Everything below will be lost:</p>
                                <ul>
                                    {type === 'main' ? (
                                        <>
                                            <li>
                                                <Trash2 size={14} /> <b>{item.sub_category?.length || 0}</b> Sub Categories
                                            </li>
                                            <li>
                                                <Trash2 size={14} /> <b>{item.place_count || 0}</b> Total Places
                                            </li>
                                        </>
                                    ) : (
                                        <li>
                                            <Trash2 size={14} /> <b>{item.place_count || 0}</b> Associated Places
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                        {type === 'service' && (
                            <div className="warning-box">
                                <p className="warning-title">Everything below will be lost:</p>
                                <ul>
                                    <li>
                                        <Trash2 size={14} /> <b>{item.nearby_service_count || 0}</b> Nearby services
                                    </li>
                                </ul>
                            </div>
                        )}

                        <div className="modal-actions mt-6">
                            <button onClick={onClose} className="cancel-btn">
                                No, Keep it
                            </button>
                            <button onClick={onConfirm} className="delete-confirm-btn">
                                Yes, Delete it
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmationModal;
