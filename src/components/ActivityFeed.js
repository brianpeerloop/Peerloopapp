import React, { useState, useEffect } from 'react';
import { getMockActivities, formatActivity, timeAgo, ActivityTypes, initGetStream, getActivities, isConnected } from '../services/getstream';
import './ActivityFeed.css';

/**
 * ActivityFeed Component
 * Displays a feed of activities from GetStream (real or mock data)
 */
const ActivityFeed = ({ currentUser, feedType = 'all', title = 'Activity Feed' }) => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      
      try {
        // Try to connect to GetStream
        if (currentUser?.id) {
          await initGetStream(currentUser.id);
          
          if (isConnected()) {
            setConnectionStatus('connected');
            // Get real activities from GetStream
            const response = await getActivities('user', currentUser.id);
            if (response.results && response.results.length > 0) {
              setActivities(response.results.map(formatActivity));
            } else {
              // No real activities yet, use mock data
              const mockData = getMockActivities(currentUser.id, feedType);
              setActivities(mockData.map(formatActivity));
            }
          } else {
            throw new Error('Not connected');
          }
        }
      } catch (error) {
        console.log('Using mock data:', error.message);
        setConnectionStatus('demo');
        // Fallback to mock data
        const mockData = getMockActivities(currentUser?.id, feedType);
        setActivities(mockData.map(formatActivity));
      }
      
      setLoading(false);
    };

    loadActivities();
  }, [currentUser, feedType]);

  // Filter activities by type
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => {
        if (filter === 'courses') {
          return [ActivityTypes.COURSE_CREATED, ActivityTypes.COURSE_PUBLISHED, 
                  ActivityTypes.COURSE_ENROLLED, ActivityTypes.COURSE_COMPLETED].includes(a.verb);
        }
        if (filter === 'social') {
          return [ActivityTypes.FOLLOW_USER, ActivityTypes.LIKE_ADDED, 
                  ActivityTypes.COMMENT_ADDED, ActivityTypes.POST_CREATED].includes(a.verb);
        }
        if (filter === 'achievements') {
          return [ActivityTypes.BADGE_EARNED, ActivityTypes.CERTIFICATION_EARNED, 
                  ActivityTypes.MILESTONE_REACHED].includes(a.verb);
        }
        return true;
      });

  // Get icon for activity type
  const getActivityIcon = (verb) => {
    const icons = {
      [ActivityTypes.COURSE_CREATED]: '📚',
      [ActivityTypes.COURSE_PUBLISHED]: '🎉',
      [ActivityTypes.COURSE_ENROLLED]: '✏️',
      [ActivityTypes.COURSE_COMPLETED]: '🎓',
      [ActivityTypes.LESSON_COMPLETED]: '✅',
      [ActivityTypes.POST_CREATED]: '💬',
      [ActivityTypes.COMMENT_ADDED]: '💭',
      [ActivityTypes.LIKE_ADDED]: '❤️',
      [ActivityTypes.FOLLOW_USER]: '👥',
      [ActivityTypes.BADGE_EARNED]: '🏆',
      [ActivityTypes.CERTIFICATION_EARNED]: '📜',
      [ActivityTypes.MILESTONE_REACHED]: '🌟',
      [ActivityTypes.SESSION_SCHEDULED]: '📅',
      [ActivityTypes.SESSION_COMPLETED]: '✨',
      [ActivityTypes.STUDENT_HELPED]: '🤝',
      [ActivityTypes.REVIEW_RECEIVED]: '⭐'
    };
    return icons[verb] || '📌';
  };

  if (loading) {
    return (
      <div className="activity-feed">
        <h3 className="feed-title">{title}</h3>
        <div className="feed-loading">
          <div className="loading-spinner"></div>
          <p>Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <div className="feed-header">
        <div className="feed-title-row">
          <h3 className="feed-title">{title}</h3>
          <span className={`connection-badge ${connectionStatus}`}>
            {connectionStatus === 'connected' ? '🟢 Live' : 
             connectionStatus === 'connecting' ? '🟡 Connecting...' : '🔵 Demo'}
          </span>
        </div>
        <div className="feed-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'courses' ? 'active' : ''}`}
            onClick={() => setFilter('courses')}
          >
            Courses
          </button>
          <button 
            className={`filter-btn ${filter === 'social' ? 'active' : ''}`}
            onClick={() => setFilter('social')}
          >
            Social
          </button>
          <button 
            className={`filter-btn ${filter === 'achievements' ? 'active' : ''}`}
            onClick={() => setFilter('achievements')}
          >
            Achievements
          </button>
        </div>
      </div>

      <div className="feed-list">
        {filteredActivities.length === 0 ? (
          <div className="feed-empty">
            <p>No activities to show</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {getActivityIcon(activity.verb)}
              </div>
              
              <div className="activity-avatar">
                {activity.actor.avatar ? (
                  <img src={activity.actor.avatar} alt={activity.actor.name} />
                ) : (
                  <div className="avatar-initials">
                    {activity.actor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              
              <div className="activity-content">
                <div className="activity-text">
                  <span className="actor-name">{activity.actor.name}</span>
                  {' '}{activity.displayMessage}{' '}
                  <span className="object-name">{activity.object.name}</span>
                  {activity.object.icon && ` ${activity.object.icon}`}
                </div>
                <div className="activity-time">{timeAgo(activity.time)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="feed-footer">
        <button className="load-more-btn">Load More</button>
      </div>
    </div>
  );
};

export default ActivityFeed;
