import React, { useState } from 'react';
import './CreatorMode.css';
import { 
  FaPlus,
  FaEdit,
  FaEye,
  FaChartLine,
  FaUsers,
  FaBook,
  FaVideo,
  FaFileAlt,
  FaImage,
  FaLink,
  FaSave,
  FaPlay,
  FaArrowLeft
} from 'react-icons/fa';
import CourseBuilder from './CourseBuilder';

const CreatorMode = ({ activeMenu, currentUser }) => {
  const [showCourseBuilder, setShowCourseBuilder] = useState(false);

  const handleBackToCreator = () => {
    setShowCourseBuilder(false);
  };

  const renderCreateCourse = () => (
    <div className="creator-mode-content">
      <div className="creator-mode-header">
        <h1>Create New Course</h1>
        <p>Start building your course step by step</p>
      </div>
      
      <div className="course-creation-form">
        <div className="form-section">
          <h2>Course Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Course Title</label>
              <input type="text" placeholder="Enter course title" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select>
                <option>Select category</option>
                <option>Technology</option>
                <option>Business</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Personal Development</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea placeholder="Describe your course..." rows={4} />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="number" placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Level</label>
              <select>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Course Content</h2>
          <div className="content-builder">
            <div className="content-item">
              <div className="content-item-header">
                <FaBook />
                <span>Module 1: Introduction</span>
                <button className="add-content-btn">
                  <FaPlus />
                </button>
              </div>
              <div className="content-actions">
                <button className="action-btn">
                  <FaVideo />
                  Add Video
                </button>
                <button className="action-btn">
                  <FaFileAlt />
                  Add Document
                </button>
                <button className="action-btn">
                  <FaImage />
                  Add Image
                </button>
                <button className="action-btn">
                  <FaLink />
                  Add Link
                </button>
              </div>
            </div>
            
            <button className="add-module-btn">
              <FaPlus />
              Add New Module
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button className="save-draft-btn">
            <FaSave />
            Save as Draft
          </button>
          <button 
            className="publish-btn"
            onClick={() => setShowCourseBuilder(true)}
          >
            <FaPlay />
            Open Course Builder
          </button>
        </div>
      </div>
    </div>
  );

  const renderEditCourses = () => (
    <div className="creator-mode-content">
      <div className="creator-mode-header">
        <h1>Edit Courses</h1>
        <p>Manage and update your existing courses</p>
      </div>
      
      <div className="courses-management">
        <div className="course-card">
          <div className="course-card-header">
            <h3>Introduction to Machine Learning</h3>
            <span className="status published">Published</span>
          </div>
          <p className="course-description">
            Learn the fundamentals of machine learning with practical examples and hands-on projects.
          </p>
          <div className="course-stats">
            <span>1,247 students</span>
            <span>4.8 rating</span>
            <span>$12,450 revenue</span>
          </div>
          <div className="course-actions">
            <button className="edit-btn">
              <FaEdit />
              Edit Course
            </button>
            <button className="view-btn">
              <FaEye />
              View Course
            </button>
          </div>
        </div>

        <div className="course-card">
          <div className="course-card-header">
            <h3>Advanced Python Programming</h3>
            <span className="status draft">Draft</span>
          </div>
          <p className="course-description">
            Master advanced Python concepts including decorators, generators, and async programming.
          </p>
          <div className="course-stats">
            <span>0 students</span>
            <span>No ratings</span>
            <span>$0 revenue</span>
          </div>
          <div className="course-actions">
            <button className="edit-btn">
              <FaEdit />
              Continue Editing
            </button>
            <button className="preview-btn">
              <FaEye />
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewTest = () => (
    <div className="creator-mode-content">
      <div className="creator-mode-header">
        <h1>Preview & Test</h1>
        <p>Review and test your courses before publishing</p>
      </div>
      
      <div className="preview-section">
        <div className="preview-controls">
          <button className="preview-btn active">
            <FaEye />
            Student View
          </button>
          <button className="preview-btn">
            <FaPlay />
            Test Mode
          </button>
        </div>
        
        <div className="preview-content">
          <div className="preview-placeholder">
            <h3>Course Preview</h3>
            <p>Select a course to preview how it will appear to students</p>
            <div className="preview-stats">
              <div className="preview-stat">
                <span>Loading Time</span>
                <strong>2.3s</strong>
              </div>
              <div className="preview-stat">
                <span>Mobile Friendly</span>
                <strong>✓</strong>
              </div>
              <div className="preview-stat">
                <span>Accessibility</span>
                <strong>✓</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="creator-mode-content">
      <div className="creator-mode-header">
        <h1>Course Analytics</h1>
        <p>Track performance and engagement metrics</p>
      </div>
      
      <div className="analytics-dashboard">
        <div className="analytics-cards">
          <div className="analytics-card">
            <h3>Total Revenue</h3>
            <div className="analytics-value">$21,370</div>
            <div className="analytics-change positive">+12% this month</div>
          </div>
          <div className="analytics-card">
            <h3>Total Students</h3>
            <div className="analytics-value">2,139</div>
            <div className="analytics-change positive">+8% this month</div>
          </div>
          <div className="analytics-card">
            <h3>Average Rating</h3>
            <div className="analytics-value">4.8</div>
            <div className="analytics-change positive">+0.2 this month</div>
          </div>
          <div className="analytics-card">
            <h3>Completion Rate</h3>
            <div className="analytics-value">78%</div>
            <div className="analytics-change negative">-2% this month</div>
          </div>
        </div>
        
        <div className="analytics-charts">
          <div className="chart-placeholder">
            <h3>Student Growth</h3>
            <p>📈 Chart showing student enrollment over time</p>
          </div>
          <div className="chart-placeholder">
            <h3>Revenue Trends</h3>
            <p>💰 Chart showing revenue trends</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentManagement = () => (
    <div className="creator-mode-content">
      <div className="creator-mode-header">
        <h1>Student Management</h1>
        <p>Manage enrolled students and their progress</p>
      </div>
      
      <div className="student-management">
        <div className="student-filters">
          <input type="text" placeholder="Search students..." />
          <select>
            <option>All Courses</option>
            <option>Introduction to Machine Learning</option>
            <option>Data Science Fundamentals</option>
          </select>
          <select>
            <option>All Status</option>
            <option>Active</option>
            <option>Completed</option>
            <option>Inactive</option>
          </select>
        </div>
        
        <div className="students-list">
          <div className="student-item">
            <div className="student-info">
              <img src="https://via.placeholder.com/40x40/4A90E2/FFFFFF?text=JS" alt="Student" />
              <div>
                <h4>John Smith</h4>
                <p>john.smith@email.com</p>
              </div>
            </div>
            <div className="student-course">Introduction to ML</div>
            <div className="student-progress">75%</div>
            <div className="student-status active">Active</div>
            <button className="contact-btn">Message</button>
          </div>
          
          <div className="student-item">
            <div className="student-info">
              <img src="https://via.placeholder.com/40x40/28a745/FFFFFF?text=AS" alt="Student" />
              <div>
                <h4>Alice Johnson</h4>
                <p>alice.j@email.com</p>
              </div>
            </div>
            <div className="student-course">Data Science Fundamentals</div>
            <div className="student-progress">100%</div>
            <div className="student-status completed">Completed</div>
            <button className="contact-btn">Message</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'create-course':
        return renderCreateCourse();
      case 'edit-courses':
        return renderEditCourses();
      case 'preview-courses':
        return renderPreviewTest();
      case 'analytics':
        return renderAnalytics();
      case 'student-management':
        return renderStudentManagement();
      default:
        return renderCreateCourse();
    }
  };

  if (showCourseBuilder) {
    return <CourseBuilder onBackToCreator={handleBackToCreator} />;
  }

  return (
    <div className="creator-mode">
      {renderContent()}
    </div>
  );
};

export default CreatorMode; 