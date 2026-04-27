import React from 'react';

const PlaceSkeleton = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="sk-title"></div>
        <div className="sk-small"></div>
        <div className="sk-text"></div>
        <div className="sk-text" style={{ width: '90%' }}></div>
        <div className="sk-footer">
          <div className="sk-btn"></div>
          <div className="sk-btn"></div>
        </div>
      </div>
    </div>
  );
};

export default PlaceSkeleton;
