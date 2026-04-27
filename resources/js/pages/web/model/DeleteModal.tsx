import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }: DeleteModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="premium-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="premium-modal-card"
                        initial={{ scale: 0.9, opacity: 0, y: 30, rotateX: -10 }}
                        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="close-x" onClick={onClose}>
                            <X size={18} />
                        </button>

                        <div className="modal-body">
                            <div className="icon-wrapper">
                                <motion.div
                                    className="icon-bg"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: 'spring' }}
                                >
                                    <Trash2 size={28} strokeWidth={2.5} />
                                </motion.div>
                                <div className="icon-ring"></div>
                            </div>

                            <div className="text-content">
                                <h3>{title || 'Are you sure?'}</h3>
                                <p>{message || 'This action cannot be undone. All data associated with this record will be permanently removed.'}</p>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={onClose}>
                                Keep it
                            </button>
                            <button
                                className="btn-danger"
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                            >
                                <span>Delete Forever</span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DeleteModal;
