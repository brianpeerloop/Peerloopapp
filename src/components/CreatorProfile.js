import React, { useState } from 'react';
import './CreatorProfile.css';
import { 
  FaPlus,
  FaEdit,
  FaEye,
  FaTrash,
  FaChartLine,
  FaUsers,
  FaStar,
  FaGraduationCap,
  FaTrophy,
  FaCalendar,
  FaClock,
  FaArrowLeft,
  FaCog,
  FaShieldAlt,
  FaQuestionCircle
} from 'react-icons/fa';

const CreatorProfile = ({ currentUser, onBackToMain, onSwitchToCreatorMode }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dr. Sarah Chen',
    handle: '@sarahchen',
    email: 'sarah.chen@university.edu',
    bio: 'Award-winning computer science professor and course creator with 15+ years of experience in online education. Specializing in AI, machine learning, and software engineering.',
    location: 'Stanford, CA',
    website: 'https://sarahchen.edu',
    avatar: 'https://via.placeholder.com/120x120/4A90E2/FFFFFF?text=SC',
    expertise: ['Artificial Intelligence', 'Machine Learning', 'Software Engineering', 'Data Science'],
    credentials: ['Ph.D. Computer Science', 'Stanford University', '15+ Years Teaching Experience']
  });

  const creatorSections = [
    { id: 'overview', label: 'Creator Overview', icon: <FaGraduationCap /> },
    { id: 'courses', label: 'My Courses', icon: <FaEdit /> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartLine /> },
    { id: 'students', label: 'Students', icon: <FaUsers /> },
    { id: 'settings', label: 'Creator Settings', icon: <FaCog /> }
  ];

  const sampleCourses = [
    {
      id: 1,
      title: 'Introduction to Machine Learning',
      status: 'published',
      students: 1247,
      rating: 4.8,
      revenue: '$12,450',
      lastUpdated: '2 days ago'
    },
    {
      id: 2,
      title: 'Advanced Python Programming',
      status: 'draft',
      students: 0,
      rating: 0,
      revenue: '$0',
      lastUpdated: '1 week ago'
    },
    {
      id: 3,
      title: 'Data Science Fundamentals',
      status: 'published',
      students: 892,
      rating: 4.9,
      revenue: '$8,920',
      lastUpdated: '3 days ago'
    }
  ];

  const renderTabBar = () => (
    <div className="creator-tab-bar">
      {creatorSections.map(section => (
        <button
          key={section.id}
          className={`creator-tab-item${activeSection === section.id ? ' active' : ''}`}
          onClick={() => setActiveSection(section.id)}
        >
          <span className="tab-icon">{section.icon}</span>
          <span>{section.label}</span>
        </button>
      ))}
      <button className="creator-tab-item back-btn" onClick={onBackToMain}>
        <FaArrowLeft style={{marginRight: 4}} />
        <span>Back to Main</span>
      </button>
    </div>
  );

  const renderOverview = () => (
    <div className="creator-overview">
      <div className="creator-header">
        <div className="creator-info">
          <img src={profileData.avatar} alt="Creator Avatar" className="creator-avatar" />
          <div className="creator-details">
            <h1>{profileData.name}</h1>
            <p className="creator-handle">{profileData.handle}</p>
            <p className="creator-bio">{profileData.bio}</p>
            <div className="creator-expertise">
              <strong>Expertise:</strong> {profileData.expertise.join(', ')}
            </div>
          </div>
        </div>
        <button className="create-course-btn" onClick={() => onSwitchToCreatorMode()}>
          <FaPlus />
          Create New Course
        </button>
      </div>

      <div className="creator-stats">
        <div className="stat-card">
          <FaGraduationCap />
          <div className="stat-content">
            <h3>3</h3>
            <p>Courses Created</p>
          </div>
        </div>
        <div className="stat-card">
          <FaUsers />
          <div className="stat-content">
            <h3>2,139</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <FaStar />
          <div className="stat-content">
            <h3>4.8</h3>
            <p>Average Rating</p>
          </div>
        </div>
        <div className="stat-card">
          <FaTrophy />
          <div className="stat-content">
            <h3>$21,370</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="creator-credentials">
        <h3>Credentials</h3>
        <ul>
          {profileData.credentials.map((credential, index) => (
            <li key={index}>{credential}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="creator-courses">
      <div className="courses-header">
        <h2>My Courses</h2>
        <button className="create-course-btn primary" onClick={() => onSwitchToCreatorMode()}>
          <FaPlus />
          Create New Course
        </button>
      </div>

      <div className="courses-grid">
        {sampleCourses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <h3>{course.title}</h3>
              <span className={`course-status ${course.status}`}>
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </span>
            </div>
            <div className="course-stats">
              <div className="course-stat">
                <FaUsers />
                <span>{course.students} students</span>
              </div>
              <div className="course-stat">
                <FaStar />
                <span>{course.rating > 0 ? course.rating : 'No ratings'}</span>
              </div>
              <div className="course-stat">
                <FaTrophy />
                <span>{course.revenue}</span>
              </div>
            </div>
            <div className="course-actions">
              <button className="action-btn edit">
                <FaEdit />
                Edit
              </button>
              <button className="action-btn view">
                <FaEye />
                View
              </button>
              <button className="action-btn delete">
                <FaTrash />
                Delete
              </button>
            </div>
            <div className="course-meta">
              <span>Last updated: {course.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="creator-analytics">
      <h2>Course Analytics</h2>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Student Growth</h3>
          <div className="chart-placeholder">
            <p>📈 Student enrollment chart would go here</p>
          </div>
        </div>
        <div className="analytics-card">
          <h3>Revenue Trends</h3>
          <div className="chart-placeholder">
            <p>💰 Revenue chart would go here</p>
          </div>
        </div>
        <div className="analytics-card">
          <h3>Course Performance</h3>
          <div className="chart-placeholder">
            <p>📊 Performance metrics would go here</p>
          </div>
        </div>
        <div className="analytics-card">
          <h3>Student Engagement</h3>
          <div className="chart-placeholder">
            <p>🎯 Engagement metrics would go here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="creator-students">
      <h2>My Students</h2>
      <div className="students-stats">
        <div className="student-stat">
          <h3>2,139</h3>
          <p>Total Students</p>
        </div>
        <div className="student-stat">
          <h3>1,847</h3>
          <p>Active Students</p>
        </div>
        <div className="student-stat">
          <h3>292</h3>
          <p>Completed Courses</p>
        </div>
      </div>
      <div className="students-list-placeholder">
        <p>📋 Student list and management interface would go here</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="creator-settings">
      <h2>Creator Settings</h2>
      <div className="settings-grid">
        <div className="setting-group">
          <h3>Course Creation</h3>
          <div className="setting-item">
            <span>Auto-publish new courses</span>
            <input type="checkbox" />
          </div>
          <div className="setting-item">
            <span>Require course approval</span>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
        
        <div className="setting-group">
          <h3>Notifications</h3>
          <div className="setting-item">
            <span>New student enrollments</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <span>Course completion notifications</span>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'courses':
        return renderCourses();
      case 'analytics':
        return renderAnalytics();
      case 'students':
        return renderStudents();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="creator-profile">
      {renderTabBar()}
      <div className="creator-main">
        {renderContent()}
      </div>
    </div>
  );
};

export default CreatorProfile; 