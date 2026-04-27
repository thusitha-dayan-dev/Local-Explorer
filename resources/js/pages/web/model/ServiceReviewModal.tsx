import React, { useEffect, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Camera, X, Send, Loader2 } from 'lucide-react';

import { route } from 'ziggy-js';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceId: number;
    serviceName: string;
    success:() => void;
}

const ServiceReviewModal = ({ isOpen, onClose, serviceId, serviceName, success }: ReviewModalProps) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        service_id: serviceId || 0,
        title: '',
        message: '',
        rating: 0,
        images: [] as File[],
    });

    useEffect(() => {
    if (serviceId) {
        setData('service_id', serviceId);
    }
}, [serviceId]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hover, setHover] = useState(0);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (data.images.length + files.length > 4) {
            alert('Maximum 5 images allowed');
            return;
        }
        setData('images', [...data.images, ...files]);
    };

    const removeImage = (index: number) => {
        setData(
            'images',
            data.images.filter((_, i) => i !== index),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('service.review.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
                success();
            },
        });
    };

    console.log(errors);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="review-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="review-modal" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                        <form onSubmit={handleSubmit}>
                            <header className="modal-header">
                                <div>
                                    <h2>Write a Review</h2>
                                    <p>
                                        Experience at <span>{serviceName}</span>
                                    </p>
                                </div>
                                <button type="button" className="close-btn" onClick={onClose}>
                                    <X size={20} />
                                </button>
                            </header>

                            <div className="modal-body">
                                <div className="rating-section">
                                    <div className="stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <motion.button
                                                key={star}
                                                type="button"
                                                whileHover={{ scale: 1.2 }}
                                                onClick={() => setData('rating', star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                                className={(hover || data.rating) >= star ? 'active' : ''}
                                            >
                                                <Star fill={(hover || data.rating) >= star ? '#ffc107' : 'none'} />
                                            </motion.button>
                                        ))}
                                    </div>
                                    {errors.rating && <span className="error-text">{errors.rating}</span>}
                                </div>

                                <div className="input-fields">
                                    <div className="field">
                                        <label>Title</label>
                                        <input
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            type="text"
                                            placeholder="Summarize your visit"
                                        />
                                        {errors.title && <span className="error-text">{errors.title}</span>}
                                    </div>
                                    <div className="field">
                                        <label>Message</label>
                                        <textarea
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            rows={4}
                                            placeholder="Share your thoughts..."
                                        />
                                        {errors.message && <span className="error-text">{errors.message}</span>}
                                    </div>
                                </div>

                                <div className="upload-section">
                                    <div className="image-grid">
                                        {data.images.map((file, index) => (
                                            <div key={index} className="preview-box">
                                                <img src={URL.createObjectURL(file)} alt="preview" />
                                                <button type="button" onClick={() => removeImage(index)} className="remove-img">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {data.images.length < 5 && (
                                            <button type="button" className="add-img-btn" onClick={() => fileInputRef.current?.click()}>
                                                <Camera size={24} />
                                                <span>{data.images.length}/4</span>
                                            </button>
                                        )}
                                    </div>
                                    <input type="file" hidden multiple accept="image/*" ref={fileInputRef} onChange={handleImageChange} />
                                </div>
                                {Object.keys(errors).map(
                                    (key) =>
                                        key.startsWith('images') && (
                                            <span key={key} className="error-text">
                                                {errors[key as keyof typeof errors]}
                                            </span>
                                        ),
                                )}
                            </div>

                            <footer className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={onClose} disabled={processing}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit" disabled={processing || data.rating === 0}>
                                    {processing ? <Loader2 className="spinner" size={18} /> : <Send size={18} />}
                                    {processing ? 'Submitting...' : 'Post Review'}
                                </button>
                            </footer>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ServiceReviewModal;

