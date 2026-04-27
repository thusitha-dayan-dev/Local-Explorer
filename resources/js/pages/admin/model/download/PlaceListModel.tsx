import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, Download, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import type { Category } from '@/types/web';

interface DownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
}

const PlaceListModel: React.FC<DownloadModalProps> = ({ isOpen, onClose, categories }) => {
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        categoryId: '',
        limit: '50',
    });

    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [isLimitOpen, setIsLimitOpen] = useState(false);

    const handleDownload = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams({
            type: 'places',
            search: filters.search,
            category: filters.categoryId,
            limit: filters.limit,
        }).toString();

        window.open(`/admin/download-pdf?${params}`, '_blank');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            onClose();
                            setIsDropDownOpen(false);
                            setIsLimitOpen(false);
                        }}
                        className="overlay-backdrop"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="modal-container category-modal"
                    >
                        <button
                            className="close-x"
                            onClick={() => {
                                onClose();
                                setIsDropDownOpen(false);
                                setIsLimitOpen(false);
                            }}
                        >
                            <X size={20} />
                        </button>

                        <div className="icon-wrapper add-icon" style={{ background: '#fef2f2' }}>
                            <FileText className="success-icon" style={{ color: '#ef4444' }} />
                        </div>

                        <h2>Download Places Report</h2>
                        <p>Customize and filter your document before generating the PDF.</p>

                        <form onSubmit={handleDownload} className="modal-form">

                            <div className="input-group">
                                <label>Filter by Category</label>
                                <div className="fack_input_box" style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        readOnly
                                        placeholder="All Categories"
                                        value={filters.category || 'All Categories'}
                                        onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <ChevronDown
                                        size={18}
                                        className="drop-icon"
                                        style={{ position: 'absolute', right: '12px', top: '12px', color: '#94a3b8' }}
                                    />

                                    {isDropDownOpen && (
                                        <ul className="selector">
                                            <li
                                                onClick={() => {
                                                    setFilters({ ...filters, category: '', categoryId: '' });
                                                    setIsDropDownOpen(false);
                                                }}
                                            >
                                                All Categories
                                            </li>
                                            {categories.map((cat) => (
                                                <li
                                                    key={cat.id}
                                                    onClick={() => {
                                                        setFilters({ ...filters, category: cat.category_name, categoryId: String(cat.id) });
                                                        setIsDropDownOpen(false);
                                                    }}
                                                >
                                                    {cat.category_name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Result Limit</label>
                                <div className="fack_input_box" style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        readOnly
                                        value={filters.limit === 'all' ? 'Download All' : `Top ${filters.limit} Results`}
                                        onClick={() => setIsLimitOpen(!isLimitOpen)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <ChevronDown
                                        size={18}
                                        className="drop-icon"
                                        style={{ position: 'absolute', right: '12px', top: '12px', color: '#94a3b8' }}
                                    />

                                    {isLimitOpen && (
                                        <ul className="selector">
                                            <li
                                                onClick={() => {
                                                    setFilters({ ...filters, limit: '10' });
                                                    setIsLimitOpen(false);
                                                }}
                                            >
                                                Top 10 Results
                                            </li>
                                            <li
                                                onClick={() => {
                                                    setFilters({ ...filters, limit: '50' });
                                                    setIsLimitOpen(false);
                                                }}
                                            >
                                                Top 50 Results
                                            </li>
                                            <li
                                                onClick={() => {
                                                    setFilters({ ...filters, limit: '100' });
                                                    setIsLimitOpen(false);
                                                }}
                                            >
                                                Top 100 Results
                                            </li>
                                            <li
                                                onClick={() => {
                                                    setFilters({ ...filters, limit: 'all' });
                                                    setIsLimitOpen(false);
                                                }}
                                            >
                                                Download All
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={onClose} className="cancel-btn">
                                    Cancel
                                </button>
                                <button type="submit" className="done-btn" style={{ background: '#ef4444' }}>
                                    <Download size={18} style={{ marginRight: '8px' }} />
                                    Generate PDF
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PlaceListModel;
