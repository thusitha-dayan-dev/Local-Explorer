import React from 'react';

const TripPlanSkeleton = () => {
  return (
    <div className="trip-skeleton-wrapper">

      <div className="skeleton-header">
        <div className="sk-title"></div>
        <div className="sk-menu"></div>
      </div>


      <div className="sk-meta">
        <div className="sk-small"></div>
        <div className="sk-small" style={{ width: '80px' }}></div>
      </div>


      <div className="sk-stats-grid">
        <div className="sk-stat-item"></div>
        <div className="sk-stat-item"></div>
        <div className="sk-stat-item"></div>
        <div className="sk-stat-item"></div>
        <div className="sk-stat-item"></div>
      </div>


      <div className="sk-footer">
        <div className="sk-badge"></div>
        <div className="sk-link"></div>
      </div>
    </div>
  );
};

export default TripPlanSkeleton;
