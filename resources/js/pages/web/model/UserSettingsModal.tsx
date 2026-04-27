import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Mail, User, Loader2, Check } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    handelSuccess: () => void;
}

const UserSettingsModal = ({ isOpen, onClose, handelSuccess }: Props) => {
    const { userInfore } = usePage<any>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: userInfore.full_name || '',
        profile_image: null as File | null,
        _method: 'PUT',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('profile.update'), {
            onSuccess: () => {
                onClose();
                reset('profile_image');
                handelSuccess();
            },
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="settings-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div
                        className="settings-modal-container"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <div className="settings-header">
                            <h3>Profile Settings</h3>
                            <button className="close-btn" onClick={onClose}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="settings-form">
                            <div className="profile-upload-section">
                                <div className="image-preview-wrapper" onClick={() => fileInputRef.current?.click()}>
                                    <img
                                        src={
                                            previewUrl ||
                                            (userInfore.profile_image_path
                                                ? `/storage/${userInfore.profile_image_path}`
                                                : '/images/default-avatar.png')
                                        }
                                        alt="Profile"
                                    />
                                    <div className="camera-overlay">
                                        <Camera size={20} />
                                    </div>
                                </div>
                                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                                <p>Tap to change profile picture</p>
                                {errors.profile_image && <span className="error">{errors.profile_image}</span>}
                            </div>

                            <div className="inputs-group">
                                <div className="input-box">
                                    <label>Full Name</label>
                                    <div className="input-wrapper">
                                        <User size={18} className="icon" />
                                        <input
                                            type="text"
                                            value={data.full_name}
                                            onChange={(e) => setData('full_name', e.target.value)}
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    {errors.full_name && <span className="error">{errors.full_name}</span>}
                                </div>

                                <div className="input-box disabled">
                                    <label>Email Address (Read Only)</label>
                                    <div className="input-wrapper">
                                        <Mail size={18} className="icon" />
                                        <input type="email" value={userInfore.email} readOnly />
                                    </div>
                                </div>
                            </div>

                            <div className="settings-actions">
                                <button type="button" className="cancel-btn" onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn" disabled={processing}>
                                    {processing ? (
                                        <Loader2 className="spin" size={18} />
                                    ) : (
                                        <>
                                            <Check size={18} /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UserSettingsModal;
