import { motion, AnimatePresence } from 'framer-motion';
import { CircleAlert, X, Trash2 } from 'lucide-react';
import React from 'react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    seletedItem: any;
}

const DeletePlaceModel: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, seletedItem }) => {
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
                            You are about to delete <strong>{seletedItem.place_name}</strong>.
                        </p>

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

export default DeletePlaceModel;
