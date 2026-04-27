import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenNib } from '@fortawesome/free-solid-svg-icons';
import image from '../../../../assect/web/noReview.svg';



const NoReviewYey = () => {
    return (
        <div className="no_reviews_container">
            <div className="image_wrapper">
                <img src={image} alt="No reviews yet" />
            </div>

            <div className="content">
                <h2>No reviews have been submitted yet.</h2>
        <p >Your feedback management section will populate once travelers start sharing their experiences in Dambulla.</p>
            </div>
        </div>
    );
};

export default NoReviewYey;
