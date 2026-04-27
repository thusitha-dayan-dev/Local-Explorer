import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenNib } from '@fortawesome/free-solid-svg-icons';
import image from '../../../../assect/web/noReview.svg';

interface NoReviewsProps {
    onWriteReview: () => void;
}

const NoReviews = ({ onWriteReview }: NoReviewsProps) => {
    return (
        <div className="no_reviews_container">
            <div className="image_wrapper">
                <img src={image} alt="No reviews yet" />
            </div>

            <div className="content">
                <h2>No Reviews Yet</h2>
                <p>Be the first to share your experience! Your feedback helps other travelers explore Dambulla better.</p>

                <button className="write_first_btn" onClick={onWriteReview}>
                    <FontAwesomeIcon icon={faPenNib} />
                    Write the First Review
                </button>
            </div>
        </div>
    );
};

export default NoReviews;
