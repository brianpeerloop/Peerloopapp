import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import Sidebar from './components/Sidebar';
import CreatorSidebar from './components/CreatorSidebar';
import MainContent from './components/MainContent';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * Main Application Component
 * 
 * This is the root component that manages the overall application state and layout.
 * It handles user switching, menu state management, and renders the main layout
 * consisting of a sidebar and main content area.
 */
function App() {
  // Global state for tracking which menu item is currently active
  // This determines what content is displayed in the main area
  const [activeMenu, setActiveMenu] = useState('Browse');
  
  // State for tracking if we're in creator mode
  const [isCreatorMode, setIsCreatorMode] = useState(false);

  // Dark mode state - persisted in localStorage (dark mode is default)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Apply dark mode class to body and persist preference
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Define two different user profiles for demonstration purposes
  // Each user has different roles and permissions
  const userA = {
    id: 1,
    name: 'Alex Student/Teacher',
    roles: ['student', 'teacher'], // Alex can both learn and teach
  };
  const userB = {
    id: 2,
    name: 'Jamie Creator/Instructor/Student/Teacher',
    roles: ['creator', 'instructor', 'student', 'teacher'], // Jamie has all roles
  };

  // State for tracking which user is currently active
  // This affects what content and features are available
  const [currentUser, setCurrentUser] = useState(userA);

  /**
   * Handles menu changes from the sidebar
   * @param {string} menuName - The name of the menu item that was clicked
   */
  const handleMenuChange = (menuName) => {
    if (menuName === 'CreatorProfile') {
      setActiveMenu(menuName);
      setIsCreatorMode(false);
    } else if (menuName === 'CreatorMode') {
      setActiveMenu('create-course');
      setIsCreatorMode(true);
    } else {
      setActiveMenu(menuName);
      setIsCreatorMode(false);
    }
  };

  /**
   * Handles switching back to main app from creator mode
   */
  const handleBackToMain = () => {
    setIsCreatorMode(false);
    setActiveMenu('Browse');
  };

  /**
   * Toggles between the two predefined users
   * This is used for demonstration purposes to show different user experiences
   */
  const toggleUser = () => {
    setCurrentUser(currentUser.id === userA.id ? userB : userA);
  };

  return (
    <ErrorBoundary>
      <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
        {/* Left Sidebar - Navigation and user profile */}
        {isCreatorMode ? (
          <CreatorSidebar 
            onMenuChange={handleMenuChange} 
            activeMenu={activeMenu} 
            currentUser={currentUser}
            onBackToMain={handleBackToMain}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        ) : (
          <Sidebar 
            onMenuChange={handleMenuChange} 
            activeMenu={activeMenu} 
            currentUser={currentUser}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )}
        
        {/* Main Content Area - Displays different content based on active menu */}
        <MainContent 
          activeMenu={activeMenu} 
          currentUser={currentUser} 
          onSwitchUser={toggleUser}
          onMenuChange={handleMenuChange}
          isDarkMode={isDarkMode}
        />
      </div>
    </ErrorBoundary>
  );
}

App.propTypes = {
  // No props for App component
};

export default App; 