import { motion, AnimatePresence } from 'framer-motion';
import { FilePenLine, PlusCircle, X } from 'lucide-react';
import React, { Key, useEffect, useState } from 'react';

interface EditeCategoryModel {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    errors: any;
    setData: (key: string, value: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    categories: any[];
}

const EditeCategoryModel: React.FC<EditeCategoryModel> = ({ isOpen, onClose, data, setData, onSubmit, categories, errors }) => {
    const [inputData, setInputData] = useState('');
    const [isOpensubCat, setIsOpenSubCat] = useState(false);

    useEffect(() => {
        if (!data.category_id) {
            setInputData('None (Make it Main)');
        } else {
            const selectedCategory = categories.find((cat) => cat.id == data.category_id);
            setInputData(selectedCategory.category_name);
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
                        className="modal-container category-modal"
                    >
                        <button className="close-x" onClick={onClose}>
                            <X size={20} />
                        </button>

                        <div className="icon-wrapper add-icon">
                            <FilePenLine className="success-icon" style={{ color: '#6366f1' }} />
                        </div>

                        <h2>Edite Category</h2>
                        <p>Update the category details and parent settings to keep your places organized.</p>

                        <form onSubmit={onSubmit} className="modal-form">
                            {data.id && <input type="hidden" name="id" value={data.id} />}
                            <div className="input-group">
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Hiking Spots"
                                    value={data.category_name}
                                    onChange={(e) => setData('category_name', e.target.value)}
                                    required
                                />
                                {errors.category_name && <span className="error">{errors.category_name}</span>}
                            </div>

                            <div className="input-group">
                                <label>Parent Category (Optional)</label>
                                <div className="fack_input_box" style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        name="subCategory"
                                        id="subcategory"
                                        readOnly={true}
                                        value={inputData}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            isOpensubCat ? setIsOpenSubCat(false) : setIsOpenSubCat(true);
                                        }}
                                    />
                                    {isOpensubCat && (
                                        <ul className="selector">
                                            {!data.category_id && (
                                                <li
                                                    onClick={() => {
                                                        setInputData('None (Make it Main)');
                                                        setIsOpenSubCat(false);
                                                    }}
                                                >
                                                    None (Make it Main)
                                                </li>
                                            )}
                                            {data.category_id &&
                                                categories.map((cat) => (
                                                    <li
                                                        key={cat.id}
                                                        onClick={() => {
                                                            setData('category_id', cat.id);
                                                            setInputData(cat.category_name);
                                                            setIsOpenSubCat(false);
                                                        }}
                                                    >
                                                        {cat.category_name}
                                                    </li>
                                                ))}
                                        </ul>
                                    )}
                                </div>
                                <small>Leave empty to create a Main Category</small>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={onClose} className="cancel-btn">
                                    Cancel
                                </button>
                                <button type="submit" className="done-btn">
                                    Save Category
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditeCategoryModel;
