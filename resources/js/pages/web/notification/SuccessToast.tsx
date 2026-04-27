import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessToastProps {
    show: boolean;
    message: string;
    onClose: () => void;
}

const SuccessToast = ({ show, message, onClose }: SuccessToastProps) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="success-toast"
                    initial={{ opacity: 0, y: -100, x: '-50%' }}
                    animate={{ opacity: 1, y: 20, x: '-50%' }}
                    exit={{ opacity: 0, y: -100, x: '-50%' }}
                >
                    <div className="toast-content">
                        <div className="icon-area">
                            <CheckCircle2 size={20} />
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

export default SuccessToast;
