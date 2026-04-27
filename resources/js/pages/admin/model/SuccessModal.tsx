import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import React from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="modal-container"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                            className="icon-wrapper"
                        >
                            <CheckCircle className="success-icon" />
                        </motion.div>

                        <h2>Success!</h2>
                        <p>Your new place has been added successfully. It is now live in the system.</p>

                        <button onClick={onClose} className="done-btn">
                            Great, Thanks!
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;
