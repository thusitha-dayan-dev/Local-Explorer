import { useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Camera, Save, Mail, AtSign } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { route } from 'ziggy-js';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    admin: any;
}

const AdminProfileModal: React.FC<Props> = ({ isOpen, onClose, admin }) => {
    const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && admin) {
            setData((prevData) => ({
                ...prevData,
                user_name: admin.user_name || '',
                email: admin.email || '',
            }));

            if (admin.profile_image_path) {
                setPreviewUrl(`/storage/${admin.profile_image_path}`);
            } else {
                setPreviewUrl(`https://ui-avatars.com/api/?name=${admin.user_name}&background=6366f1&color=fff`);
            }
        }
    }, [isOpen, admin]);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        user_name: admin.user_name || '',
        email: admin.email || '',
        profile_image: null as File | null,
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    useEffect(() => {
        if (isOpen && admin) {
            setData((prevData) => ({
                ...prevData,
                user_name: admin.user_name || '',
                email: admin.email || '',
            }));
        }
    }, [isOpen, admin]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.update.profile'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                clearErrors();
                onClose();
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    const submitPassword = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.update.password'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('current_password', 'new_password', 'new_password_confirmation');
                alert('Password updated successfully!');
            },
        });
    };

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
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="modal-container admin-profile-modal"
                    >
                        <button className="close-x" onClick={onClose}>
                            <X size={20} />
                        </button>

                        <div className="modal-header">
                            <h2>Admin Settings</h2>
                            <div className="tab-switcher">
                                <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')} type="button">
                                    <User size={16} /> Profile Info
                                </button>
                                <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')} type="button">
                                    <Lock size={16} /> Security
                                </button>
                            </div>
                        </div>

                        {activeTab === 'general' ? (
                            <form onSubmit={submitProfile} className="modal-form">
                                <div className="avatar-section">
                                    <div className="avatar-preview">
                                        <img src={previewUrl || '/assets/images/default-admin.png'} alt="Admin" />
                                        <label htmlFor="admin-photo" className="camera-btn">
                                            <Camera size={18} />
                                            <input type="file" id="admin-photo" hidden onChange={handleImageChange} accept="image/*" />
                                        </label>
                                    </div>
                                    <p>Update Admin Profile Image</p>
                                    {errors.profile_image && <span className="error-text">{errors.profile_image}</span>}
                                </div>

                                <div className="input-group">
                                    <label>
                                        <AtSign size={14} /> Username
                                    </label>
                                    <input
                                        type="text"
                                        value={data.user_name}
                                        readOnly={true}
                                        onChange={(e) => setData('user_name', e.target.value)}
                                        placeholder="Enter username"
                                        className="read-only-input"
                                    />
                                    {errors.user_name && <span className="error-text">{errors.user_name}</span>}
                                </div>

                                <div className="input-group">
                                    <label>
                                        <Mail size={14} /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="admin@example.com"
                                        className="read-only-input"
                                        readOnly={true}
                                    />
                                    {errors.email && <span className="error-text">{errors.email}</span>}
                                </div>

                                <div className="modal-actions">
                                    <button type="button" onClick={onClose} className="cancel-btn">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={processing} className="done-btn">
                                        <Save size={18} /> {processing ? 'Updating...' : 'Update Profile'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={submitPassword} className="modal-form">
                                <div className="input-group">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                    />
                                    {errors.current_password && <span className="error-text">{errors.current_password}</span>}
                                </div>

                                <div className="input-group">
                                    <label>New Password</label>
                                    <input type="password" value={data.new_password} onChange={(e) => setData('new_password', e.target.value)} />
                                    {errors.new_password && <span className="error-text">{errors.new_password}</span>}
                                </div>

                                <div className="input-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={data.new_password_confirmation}
                                        onChange={(e) => setData('new_password_confirmation', e.target.value)}
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button type="button" onClick={onClose} className="cancel-btn">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={processing} className="done-btn">
                                        <Save size={18} /> {processing ? 'Changing...' : 'Change Password'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AdminProfileModal;
