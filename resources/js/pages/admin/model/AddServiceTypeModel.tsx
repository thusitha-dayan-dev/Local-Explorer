import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, X } from 'lucide-react';
import React, { Key, useEffect, useState } from 'react';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    errors: any;
    setData: (key: string, value: any) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const AddServiceTypeModel: React.FC<CategoryModalProps> = ({ isOpen, onClose, data, setData, onSubmit, errors }) => {
    const [inputData, setInputData] = useState('None (Make it Main)');
    const [isOpensubCat, setIsOpenSubCat] = useState(false);

    useEffect(() => {
        if (!data.category_id) {
            setInputData('None (Make it Main)');
        }
    }, [data]);
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
                        className="modal-container category-modal sub"
                    >
                        <button className="close-x" onClick={onClose}>
                            <X size={20} />
                        </button>

                        <div className="icon-wrapper add-icon">
                            <PlusCircle className="success-icon" style={{ color: '#6366f1' }} />
                        </div>

                        <h2>Add Service Type</h2>
                        <p>Create a new Service Type to organize your Nearby Service.</p>

                        <form onSubmit={onSubmit} className="modal-form">
                            {data.id && <input type="hidden" name="id" value={data.id} />}
                            <div className="input-group">
                                <label>Service Type Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Banking Restaurants"
                                    value={data.service_type_name}
                                    onChange={(e) => setData('service_type_name', e.target.value)}
                                    required
                                />
                                {errors.service_type_name && <span className="error">{errors.service_type_name}</span>}
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={onClose} className="cancel-btn">
                                    Cancel
                                </button>
                                <button type="submit" className="done-btn">
                                    Save Service Type
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddServiceTypeModel;
