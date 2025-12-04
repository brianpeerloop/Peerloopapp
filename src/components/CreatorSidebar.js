import React from 'react';
import PropTypes from 'prop-types';
import './CreatorSidebar.css';
import { 
  FaPlus,
  FaEdit,
  FaEye,
  FaChartLine,
  FaUsers,
  FaCog,
  FaArrowLeft,
  FaGraduationCap,
  FaBook,
  FaVideo,
  FaFileAlt,
  FaComments,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { UserPropType } from './PropTypes';

/**
 * CreatorSidebar Component
 * 
 * This component renders the left navigation sidebar specifically for course creators.
 * It provides numbered menu items 1-5 for different course creation and management tasks.
 * 
 * @param {Function} onMenuChange - Callback function to handle menu item clicks
 * @param {string} activeMenu - The currently active menu item
 * @param {Object} currentUser - The current user object
 * @param {Function} onBackToMain - Callback to return to main app
 */
const CreatorSidebar = ({ onMenuChange, activeMenu, currentUser, onBackToMain, isDarkMode, toggleDarkMode }) => {

  /**
   * Creator menu items numbered 1-5
   * Each item has a number, icon, label, and description
   */
  const creatorMenuItems = [
    { 
      number: 1,
      icon: <FaPlus />, 
      label: 'Create Course', 
      description: 'Start building a new course',
      action: 'create-course'
    },
    { 
      number: 2,
      icon: <FaEdit />, 
      label: 'Edit Courses', 
      description: 'Modify existing courses',
      action: 'edit-courses'
    },
    { 
      number: 3,
      icon: <FaEye />, 
      label: 'Preview & Test', 
      description: 'Review and test your courses',
      action: 'preview-courses'
    },
    { 
      number: 4,
      icon: <FaChartLine />, 
      label: 'Analytics', 
      description: 'View course performance data',
      action: 'analytics'
    },
    { 
      number: 5,
      icon: <FaUsers />, 
      label: 'Student Management', 
      description: 'Manage enrolled students',
      action: 'student-management'
    }
  ];

  /**
   * Handles clicks on creator menu items
   * @param {string} action - The action to perform
   */
  const handleCreatorMenuClick = (action) => {
    onMenuChange(action);
  };

  /**
   * Handles the back to main app button
   */
  const handleBackToMain = () => {
    onBackToMain();
  };

  return (
    <div className="creator-sidebar">
      {/* Header section with logo and back button */}
      <div className="creator-sidebar-header">
        <div className="creator-logo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Custom SVG logo for creator mode */}
          <svg viewBox="0 0 64 64" width="38" height="38" style={{ display: 'inline-block' }}>
            <path d="M32 10
              C16 10, 10 32, 32 32
              S54 10, 32 10
              M32 32
              C58 32, 58 54, 32 54
              S6 32, 32 32
              M32 32
              C32 24, 40 24, 40 32
              S32 40, 32 32
              C32 40, 24 40, 24 32
              S32 24, 32 32" 
              fill="none" stroke="#4A90E2" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="32" cy="32" r="4" fill="#4A90E2"/>
          </svg>
          <span className="creator-title">Creator Studio</span>
        </div>
        <button className="back-to-main-btn" onClick={handleBackToMain}>
          <FaArrowLeft />
          <span>Back to Main</span>
        </button>
      </div>
      
      {/* Creator navigation menu with numbered items */}
      <nav className="creator-sidebar-nav">
        <div className="creator-menu-title">Course Creation</div>
        {creatorMenuItems.map((item) => (
          <div 
            key={item.number} 
            className={`creator-nav-item ${activeMenu === item.action ? 'active' : ''}`}
            onClick={() => handleCreatorMenuClick(item.action)}
          >
            <div className="creator-nav-number">{item.number}</div>
            <div className="creator-nav-icon">{item.icon}</div>
            <div className="creator-nav-content">
              <div className="creator-nav-label">{item.label}</div>
              <div className="creator-nav-description">{item.description}</div>
            </div>
          </div>
        ))}
      </nav>

      {/* Quick actions section */}
      <div className="creator-quick-actions">
        <div className="quick-actions-title">Quick Actions</div>
        <div className="quick-action-item">
          <FaBook />
          <span>Add Content</span>
        </div>
        <div className="quick-action-item">
          <FaVideo />
          <span>Upload Video</span>
        </div>
        <div className="quick-action-item">
          <FaFileAlt />
          <span>Create Quiz</span>
        </div>
        <div className="quick-action-item">
          <FaComments />
          <span>Student Feedback</span>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="creator-dark-mode-toggle-container">
        <button 
          className="creator-dark-mode-toggle"
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <div className="creator-toggle-icon">
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </div>
          <span className="creator-toggle-label">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>

      {/* Creator profile section at the bottom */}
      <div className="creator-sidebar-profile-container">
        <div className="creator-sidebar-profile">
          <div className="creator-profile-info">
            {/* Creator avatar */}
            <div className="creator-profile-avatar">
              <img src="https://via.placeholder.com/40x40/4A90E2/FFFFFF?text=SC" alt="Creator Profile" />
            </div>
            {/* Creator details */}
            <div className="creator-profile-details">
              <div className="creator-profile-name">{currentUser?.name || 'Creator'}</div>
              <div className="creator-profile-role">Course Creator</div>
            </div>
          </div>
          {/* Creator badge */}
          <div className="creator-badge">
            <FaGraduationCap />
          </div>
        </div>
      </div>
    </div>
  );
};

CreatorSidebar.propTypes = {
  onMenuChange: PropTypes.func.isRequired,
  activeMenu: PropTypes.string.isRequired,
  currentUser: UserPropType,
  onBackToMain: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool,
  toggleDarkMode: PropTypes.func
};

CreatorSidebar.defaultProps = {
  currentUser: null,
  isDarkMode: false,
  toggleDarkMode: () => {}
};

export default CreatorSidebar; 