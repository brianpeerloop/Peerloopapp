import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './CourseListing.css';
import { FaStar, FaUsers, FaGraduationCap, FaAward, FaPlay, FaCheck, FaArrowRight, FaHeart, FaShare, FaBook, FaClock, FaDollarSign, FaCertificate, FaChalkboardTeacher } from 'react-icons/fa';
import { getAllCourses, getInstructorById } from '../data/database';
import { CoursePropType } from './PropTypes';

const CourseListing = ({ onCourseSelect, selectedCourse, onBackToList }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const allCourses = getAllCourses();
        setCourses(allCourses);
        setFilteredCourses(allCourses);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.students - a.students);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')));
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, selectedCategory, sortBy]);

  const categories = ['all', ...new Set(courses.map(course => course.category))];

  const renderCourseCard = (course) => {
    const instructor = getInstructorById(course.instructorId);
    
    return (
      <div key={course.id} className="course-card" onClick={() => onCourseSelect(course)}>
        <div className="course-card-image">
          <img src={course.thumbnail} alt={course.title} />
          <div className="course-card-overlay">
            <FaPlay className="play-icon" />
          </div>
        </div>
        
        <div className="course-card-content">
          <div className="course-card-header">
            <h3 className="course-title">{course.title}</h3>
            <div className="course-creator">
              <div className="creator-avatar">
                <img src={instructor?.avatar} alt={instructor?.name} />
              </div>
              <span className="creator-name">By {instructor?.name}</span>
            </div>
          </div>

          <div className="course-stats">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(course.rating) ? 'star-filled' : 'star-empty'} />
              ))}
              <span className="rating-text">({course.rating})</span>
            </div>
            <div className="enrollment-count">
              <FaUsers className="users-icon" />
              <span>{course.students.toLocaleString()} students enrolled</span>
            </div>
          </div>

          <div className="course-badges">
            <div className="teach-earn-badge">
              <FaChalkboardTeacher className="badge-icon" />
              <span>Teach & Earn</span>
            </div>
            <div className="price-badge">
              <FaDollarSign className="price-icon" />
              <span>{course.price}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCourseDetail = (course) => {
    const instructor = getInstructorById(course.instructorId);
    
    return (
      <div className="course-detail-page">
        {/* Hero Section */}
        <div className="course-hero">
          <div className="course-hero-content">
            <h1 className="course-hero-title">{course.title}</h1>
            <h2 className="course-hero-subtitle">Master the Skills to Lead AI-Driven Products</h2>
            
            <div className="course-creator-hero">
              <div className="creator-hero-avatar">
                <img src={instructor?.avatar} alt={instructor?.name} />
              </div>
              <div className="creator-hero-info">
                <h3>Created by {instructor?.name}</h3>
                <p>{instructor?.title}</p>
                <p>{instructor?.bio}</p>
                <button className="view-community-btn" aria-label="View community page">
                  View Community Page <FaArrowRight />
                </button>
              </div>
            </div>

            <div className="course-cta-buttons">
              <div className="cta-button learn-certify">
                <h3>LEARN & CERTIFY</h3>
                <button className="enroll-btn" aria-label={`Enroll in ${course.title} for ${course.price}`}>Enroll Now - {course.price}</button>
                <p>Earn your verifiable certificate</p>
              </div>
              
              <div className="cta-button teach-earn">
                <h3>LEARN, TEACH & EARN</h3>
                <button className="unlock-btn" aria-label="Unlock teaching and earning potential">Unlock 80% Earning Potential</button>
                <p>Become a teacher after you pass</p>
              </div>
            </div>
          </div>
        </div>

        {/* Community & Teacher Marketplace Section */}
        <div className="community-section">
          <h3>Learn from the Creator or a Certified Peer</h3>
          
          <div className="live-community-feed">
            <div className="community-post">
              <div className="post-avatar">
                <img src="https://via.placeholder.com/40x40/4ECDC4/ffffff?text=JS" alt="John S." />
              </div>
              <div className="post-content">
                <div className="post-header">
                  <strong>John S. (Taught 25x)</strong>
                </div>
                <p>"Just wrapped up a session on Module 3. The key takeaway for my student was understanding how to implement transformer models in real-world scenarios. The hands-on approach really helped solidify the concepts!"</p>
              </div>
            </div>

            <div className="community-post">
              <div className="post-avatar">
                <img src="https://via.placeholder.com/40x40/FF6B6B/ffffff?text=MG" alt="Maria G." />
              </div>
              <div className="post-content">
                <div className="post-header">
                  <strong>Maria G. (Taught 12x)</strong>
                </div>
                <p>"Here's a great resource I shared today for understanding transformer models: [Link to comprehensive guide]. This really helped my student grasp the attention mechanism concepts!"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content & Certification */}
        <div className="course-content-section">
          <div className="learning-objectives">
            <h4>What You'll Learn</h4>
            <div className="objectives-grid">
              {course.learningObjectives?.slice(0, 3).map((objective, index) => (
                <div key={index} className="objective-item">
                  <FaCheck className="check-icon" />
                  <span>{objective}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="course-curriculum">
            <h4>Course Curriculum</h4>
            <div className="curriculum-list">
              {course.curriculum?.map((module, index) => (
                <div key={index} className="curriculum-item">
                  <div className="module-info">
                    <span className="module-number">Module {index + 1}</span>
                    <span className="module-title">{module.title}</span>
                    <span className="module-duration">{module.duration}</span>
                  </div>
                  <FaArrowRight className="expand-icon" />
                </div>
              ))}
            </div>
          </div>

          <div className="credentials-section">
            <h4>Your Credentials</h4>
            <div className="credentials-grid">
              <div className="credential-card knowledge">
                <FaCertificate className="credential-icon" />
                <h5>{course.title}</h5>
                <p>Knowledge Verified</p>
              </div>
              
              <div className="credential-card teaching">
                <FaChalkboardTeacher className="credential-icon" />
                <h5>{course.title}</h5>
                <p>Teaching Mastery</p>
                <span className="teaching-stats">Taught: 50+ times</span>
              </div>
            </div>
          </div>
        </div>

        {/* Student Reviews */}
        <div className="reviews-section">
          <h3>Reviews ({Math.floor(course.students * 0.1)})</h3>
          
          <div className="reviews-list">
            <div className="review-item">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="star-filled" />
                ))}
              </div>
              <p className="review-text">"This course changed my career. Became a teacher and made back the fee in a week!"</p>
              <span className="reviewer-name">- John S.</span>
            </div>

            <div className="review-item">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="star-filled" />
                ))}
              </div>
              <p className="review-text">"Just wanted the knowledge, and it was perfect. The certificate looks great on my resume."</p>
              <span className="reviewer-name">- Priya K.</span>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="final-cta">
          <button className="enroll-now-btn" onClick={() => {}} aria-label={`Enroll in ${course.title} for ${course.price}`}>
            Enroll Now - {course.price}
          </button>
        </div>
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="course-listing-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  // Only render the detail view when a course is selected
  if (selectedCourse) {
    return (
      <div className="course-listing-container">
        {renderCourseDetail(selectedCourse)}
      </div>
    );
  }

  // If no course is selected, don't render anything (main listing is handled by MainContent)
  return null;
};

CourseListing.propTypes = {
  onCourseSelect: PropTypes.func.isRequired,
  selectedCourse: CoursePropType,
  onBackToList: PropTypes.func
};

CourseListing.defaultProps = {
  selectedCourse: null,
  onBackToList: null
};

export default CourseListing; 