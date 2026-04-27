import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Plus } from 'lucide-react'; // Icon එකක් පාවිච්චි කරමු
import noTripImage from '../../../../assect/web/noTripData.svg';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';


const NoTripPlans: React.FC = () => {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            className="no_trip_container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="no_trip_wrapper">
                <motion.div variants={itemVariants} className="image_box">
                    <img src={noTripImage} alt="No trip plans created" />
                </motion.div>

                <motion.div variants={itemVariants} className="text_box">
                    <h3 className="title">Your Travel Map is Empty!</h3>
                    <p className="description">
                        You haven't created any trip plans yet. Start planning your <br />
                        dream journey to Dambulla today!
                    </p>

                    <Link className="create_plan_btn" href={route('trip.plan.create')}>
                        <Plus size={20} />
                        Create Your First Plan
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default NoTripPlans;
