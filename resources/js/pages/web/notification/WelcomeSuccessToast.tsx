import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

const WelcomeSuccessToast = ({ message, isVisible, onClose }: ToastProps) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: '-50%', scale: 0.9 }}
                    animate={{ opacity: 1, y: 20, x: '-50%', scale: 1 }}
                    exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.9 }}
                    className="success_toast_wrapper"
                >
                    <div className="toast_content">
                        <div className="icon_area">
                            <CheckCircle2 size={24} color="#fff" />
                        </div>
                        <div className="text_area">
                            <span className="status_label">Success</span>
                            <p className="toast_msg">{message}</p>
                        </div>
                        <button className="close_btn" onClick={onClose}>
                            <X size={18} />
                        </button>
                    </div>
                    <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: 0 }}
                        transition={{ duration: 4 }}
                        className="progress_bar"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeSuccessToast;
