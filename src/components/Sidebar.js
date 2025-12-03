import React from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';
import { 
  FaHome, 
  FaSearch, 
  FaBell, 
  FaEnvelope, 
  FaUser, 
  FaEllipsisH,
  FaFeatherAlt,
  FaCog,
  FaSignOutAlt,
  FaUserEdit,
  FaShieldAlt,
  FaBookmark,
  FaHeart,
  FaHistory,
  FaQuestionCircle,
  FaBriefcase
} from 'react-icons/fa';
import { UserPropType } from './PropTypes';

/**
 * Sidebar Component
 * 
 * This component renders the left navigation sidebar with menu items and user profile.
 * It handles navigation between different sections of the application and displays
 * the current user's profile information.
 * 
 * @param {Function} onMenuChange - Callback function to handle menu item clicks
 * @param {string} activeMenu - The currently active menu item
 */
const Sidebar = ({ onMenuChange, activeMenu, currentUser }) => {

  /**
   * Main navigation menu items
   * Each item has an icon, label (for internal logic), and optional displayLabel (for UI)
   */
  const menuItems = [
    { icon: <FaBell />, label: 'My Community', displayLabel: 'My Community' }, // Community features
    { icon: <FaHome />, label: 'Browse', displayLabel: 'Browse Courses' }, // Browse courses and instructors
    { icon: <FaBell />, label: 'Notifications', displayLabel: 'Notifications' }, // Notification center
    { icon: <FaSearch />, label: 'Dashboard' }, // User's learning dashboard
    { icon: <FaUser />, label: 'Messages' }, // Messaging system
    { icon: <FaBriefcase />, label: 'Job Exchange' }, // Job exchange system
  ];

  /**
   * Profile dropdown menu items
   * These appear when the user profile is clicked
   */
  const profileMenuItems = [
    { icon: <FaUserEdit />, label: 'Edit Profile', action: 'edit-profile' },
    { icon: <FaBookmark />, label: 'Bookmarks', action: 'bookmarks' },
    { icon: <FaHistory />, label: 'History', action: 'history' },
    { icon: <FaCog />, label: 'Settings', action: 'settings' },
    { icon: <FaShieldAlt />, label: 'Privacy & Security', action: 'privacy' },
    { icon: <FaQuestionCircle />, label: 'Help & Support', action: 'help' },
    { icon: <FaSignOutAlt />, label: 'Sign Out', action: 'signout' },
  ];

  /**
   * Handles clicks on the user profile section
   * Navigates to the Profile page
   */
  const handleProfileClick = () => {
    onMenuChange('Profile');
  };

  /**
   * Handles actions from the profile dropdown menu
   * @param {string} action - The action to perform
   */
  const handleProfileMenuAction = (action) => {
    onMenuChange('Profile');
    // Here you can add specific actions for each menu item
  };

  /**
   * Handles clicks on main navigation menu items
   * @param {string} label - The label of the clicked menu item
   */
  const handleMenuClick = (label) => {
    if (label === 'Browse' && activeMenu === 'Browse') {
      // If already on Browse page, pass a special signal to reset the view
      onMenuChange('Browse_Reset');
    } else {
      onMenuChange(label);
    }
  };

  return (
    <div className="sidebar">
      {/* Header section with logo */}
      <div className="sidebar-header">
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
          <img src="/assets/alphapeer-logo.svg" alt="AlphaPeer" style={{ width: '160px', height: 'auto', maxHeight: '70px' }} />
        </div>
      </div>
      
      {/* Main navigation menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className={`nav-item ${activeMenu === item.label ? 'active' : ''}`}
            onClick={() => handleMenuClick(item.label)}
          >
            <div className="nav-icon">{item.icon}</div>
            {/* Use displayLabel if available, otherwise use label */}
            <span className="nav-label">{item.displayLabel || item.label}</span>
            {/* Tooltip for collapsed sidebar */}
            <span className="nav-tooltip">{item.displayLabel || item.label}</span>
          </div>
        ))}
      </nav>

      {/* User profile section at the bottom */}
      <div className="sidebar-profile-container">
        <div className="sidebar-profile" onClick={handleProfileClick}>
          <div className="profile-info">
            {/* User avatar */}
            <div className="profile-avatar">
              <img src="https://via.placeholder.com/40x40/FFD700/000000?text=AE" alt="Profile" />
            </div>
            {/* User details */}
            <div className="profile-details">
              <div className="profile-name">{currentUser?.name || 'User'}</div>
              <div className="profile-handle">@{currentUser?.name?.toLowerCase().replace(/\s+/g, '') || 'user'}</div>
            </div>
          </div>
          {/* Profile menu button */}
          <div className="profile-menu">
            <FaEllipsisH />
          </div>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  onMenuChange: PropTypes.func.isRequired,
  activeMenu: PropTypes.string.isRequired,
  currentUser: UserPropType
};

Sidebar.defaultProps = {
  currentUser: null
};

export default Sidebar; 