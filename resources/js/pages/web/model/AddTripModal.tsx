import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Calendar, ArrowRight, CheckCircle2, Loader2, X } from 'lucide-react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface AddTripModalProps {
    isOpen: boolean;
    onClose: () => void;
    place: any;
}

interface QuickAddForm {
    placeId: number | null;
    tripPlanId: number | null;
}

const AddTripModal = ({ isOpen, onClose, place }: AddTripModalProps) => {
    const { auth_trips } = usePage<any>().props;
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const quickAdd = useForm<QuickAddForm>({
        placeId: null,
        tripPlanId: null,
    });

    const handelSubmit = (placeIds: number, planId: number) => {
        setLoadingId(planId);

        quickAdd.transform((data) => ({
            ...data,
            placeId: placeIds,
            tripPlanId: planId,
        }));

        quickAdd.post(route('quick.add.trip'), {
            forceFormData: true,
            preserveState: true,
            onSuccess: () => {
                setLoadingId(null);
                onClose();
            },
            onError: () => {
                setLoadingId(null);
            },
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="trip-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div
                        className="trip-modal-container"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                    >
                        <header className="trip-modal-header">
                            <div className="place-preview">
                                <img src={`/storage/${place.main_image_path}`} alt={place.place_name} />
                                <div>
                                    <h3>Add to Trip</h3>
                                    <p>
                                        <MapPin size={14} /> {place.place_name}
                                    </p>
                                </div>
                            </div>
                            <button className="close-x" onClick={onClose}>
                                <X size={20} />
                            </button>
                        </header>

                        <div className="trip-modal-body">
                            <div className="section-title">Select an existing trip</div>

                            <div className="plans-list">
                                {auth_trips && auth_trips.length > 0 ? (
                                    auth_trips.map((plan: any) => {
                                        const isAdded = plan.added_place_ids?.includes(place.id);

                                        return (
                                            <motion.div
                                                key={plan.id}
                                                className={`plan-card ${isAdded ? 'added' : ''}`}
                                                whileHover={!isAdded ? { x: 5 } : {}}
                                                onClick={() => {
                                                    if (!isAdded && !loadingId) {
                                                        handelSubmit(place.id, plan.id);
                                                    }
                                                }}
                                            >
                                                <div className="plan-info">
                                                    <div className="plan-icon">{isAdded ? <CheckCircle2 size={18} /> : <Calendar size={18} />}</div>
                                                    <div>
                                                        <h4>{plan.title}</h4>
                                                        <span>
                                                            {isAdded
                                                                ? 'Already in this trip'
                                                                : `${plan.travel_date} • ${plan.selected_places_count || 0} places`}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="plan-action">
                                                    {loadingId === plan.id ? (
                                                        <Loader2 className="spin" size={20} />
                                                    ) : isAdded ? (
                                                        <div className="added-badge">Added</div>
                                                    ) : (
                                                        <ArrowRight size={20} />
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="empty-plans">No active trips found</div>
                                )}
                            </div>

                            <div className="divider">
                                <span>OR</span>
                            </div>

                            <Link href={route('trip.plan.create')} className="create-new-btn">
                                <div className="plus-icon">
                                    <Plus size={20} />
                                </div>
                                <span>Create a New Trip Plan</span>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddTripModal;
