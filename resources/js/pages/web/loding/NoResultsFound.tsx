import React from 'react';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import noResultsImage from '../../../../assect/web/searchResult.svg';

const NoResultsFound = ({onClear}: {onClear: () => void;}) => {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            className="no_results_container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="no_results_wrapper">
                <motion.div variants={itemVariants} className="no_results_image_wrapper">
                    <img src={noResultsImage} alt="No matching results found" />
                </motion.div>

                <motion.div variants={itemVariants} className="no_results_text_content">
                    <h3 className="no_results_title">No Destinations Matched!</h3>
                    <p className="no_results_para">
                        Oops! We couldn't find any destinations matching your filters. <br />
                        Try adjusting your search criteria or categories to find similar places in Dambulla.
                    </p>

                   <button className="clear_filters_btn" onClick={onClear}>Clear All Filters</button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default NoResultsFound;
