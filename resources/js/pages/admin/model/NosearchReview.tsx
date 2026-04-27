import React from 'react';
import { motion, Variants } from 'framer-motion';
import { SearchX } from 'lucide-react';
import noSearchImage from '../../../../assect/web/searchResult.svg';

interface Props {
    onClear: () => void;
}

const NosearchReview: React.FC<Props> = ({ onClear }) => {
    const variants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            className="search_empty_container"
            variants={variants}
            initial="hidden"
            animate="visible"
        >
            <div className="content_wrapper">
                <div className="image_holder">
                    <img src={noSearchImage} alt="No results found" />
                </div>

                <div className="text_holder">
                    <h3>No matches for yor filter</h3>
                    <p>We couldn't find any review that name. Check your spelling or try a different keyword.</p>

                    <button className="clear_search_btn" onClick={onClear}>
                        Clear Search
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default NosearchReview;
