import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ErrorToastProps {
    show: boolean;
    message: string;
    onClose: () => void;
}

const ErrorToast = ({ show, message, onClose }: ErrorToastProps) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="error-toast"
                    initial={{ opacity: 0, y: -100, x: '-50%' }}
                    animate={{
                        opacity: 1,
                        y: 20,
                        x: '-50%',
                        transition: { type: 'spring', stiffness: 300, damping: 20 }
                    }}
                    exit={{ opacity: 0, y: -100, x: '-50%' }}
                >
                    <div className="toast-content error">
                        <div className="icon-area">
                            <AlertCircle size={20} />
                        </div>
                        <span className="message">{message}</span>
                        <button className="close-toast" onClick={onClose}>
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ErrorToast;
