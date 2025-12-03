import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './CourseListing.css';
import { FaStar, FaUsers, FaGraduationCap, FaAward, FaPlay, FaCheck, FaArrowRight, FaHeart, FaShare, FaBook, FaClock, FaDollarSign, FaCertificate, FaChalkboardTeacher, FaCalendarAlt, FaVideo, FaUserGraduate } from 'react-icons/fa';
import { getAllCourses, getInstructorById } from '../data/database';
import { CoursePropType } from './PropTypes';

// Mock Student-Teachers data (will be replaced with real data later)
const mockStudentTeachers = [
  { id: 1, name: 'Marcus Chen', rating: 4.9, sessionsTaught: 25, avatar: 'https://via.placeholder.com/40x40/4ECDC4/ffffff?text=MC', available: true },
  { id: 2, name: 'Sarah Williams', rating: 4.8, sessionsTaught: 18, avatar: 'https://via.placeholder.com/40x40/FF6B6B/ffffff?text=SW', available: true },
  { id: 3, name: 'James Park', rating: 4.7, sessionsTaught: 12, avatar: 'https://via.placeholder.com/40x40/6C5CE7/ffffff?text=JP', available: false },
];

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
    const creator = getInstructorById(course.instructorId);
    
    return (
      <div key={course.id} className="course-card" onClick={() => onCourseSelect(course)}>
        <div className="course-card-image">
          <img src={course.thumbnail} alt={course.title} />
          <div className="course-card-overlay">
            <FaPlay className="play-icon" />
          </div>
          <div className="course-card-badge-overlay">
            <span className="one-on-one-badge">
              <FaVideo /> 1-on-1 Sessions
            </span>
          </div>
        </div>
        
        <div className="course-card-content">
          <div className="course-card-header">
            <h3 className="course-title">{course.title}</h3>
            <div className="course-creator">
              <div className="creator-avatar">
                <img src={creator?.avatar} alt={creator?.name} />
              </div>
              <span className="creator-name">Created by {creator?.name}</span>
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
              <span>{course.students.toLocaleString()} students</span>
            </div>
          </div>

          <div className="course-badges">
            <div className="teach-earn-badge">
              <FaChalkboardTeacher className="badge-icon" />
              <span>Earn 70% Teaching</span>
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
    const creator = getInstructorById(course.instructorId);
    
    return (
      <div className="course-detail-page">
        {/* Hero Section - Simplified */}
        <div className="course-hero">
          <div className="course-hero-content">
            <div className="course-hero-header">
              <h1 className="course-hero-title">{course.title}</h1>
              <p className="course-hero-description">{course.description}</p>
            </div>
            
            {/* Creator Info */}
            <div className="course-creator-hero">
              <div className="creator-hero-avatar">
                <img src={creator?.avatar} alt={creator?.name} />
              </div>
              <div className="creator-hero-info">
                <span className="creator-label">Created by</span>
                <h3>{creator?.name}</h3>
                <p>{creator?.title}</p>
              </div>
            </div>

            {/* Course Stats */}
            <div className="course-hero-stats">
              <div className="stat-item">
                <FaStar className="stat-icon" />
                <span>{course.rating} rating</span>
              </div>
              <div className="stat-item">
                <FaUsers className="stat-icon" />
                <span>{course.students.toLocaleString()} students</span>
              </div>
              <div className="stat-item">
                <FaClock className="stat-icon" />
                <span>{course.duration}</span>
              </div>
              <div className="stat-item">
                <FaVideo className="stat-icon" />
                <span>1-on-1 Sessions</span>
              </div>
            </div>

            {/* Price & Enroll */}
            <div className="course-hero-cta">
              <div className="price-display">
                <span className="price-amount">{course.price}</span>
                <span className="price-includes">Includes 1-on-1 tutoring sessions</span>
              </div>
              <button className="enroll-btn" aria-label={`Enroll in ${course.title} for ${course.price}`}>
                <FaCalendarAlt /> Enroll & Schedule First Session
              </button>
            </div>
          </div>
        </div>

        {/* Student-Teachers Section - Core to PeerLoop */}
        <div className="student-teachers-section">
          <h3>
            <FaUserGraduate className="section-icon" />
            Learn from the Creator or Certified Student-Teachers
          </h3>
          <p className="section-subtitle">Book 1-on-1 sessions with peer tutors who've mastered this course</p>
          
          <div className="student-teachers-grid">
            {/* Creator as first option */}
            <div className="student-teacher-card creator-card">
              <div className="st-avatar">
                <img src={creator?.avatar} alt={creator?.name} />
                <span className="creator-badge">Creator</span>
              </div>
              <div className="st-info">
                <h4>{creator?.name}</h4>
                <div className="st-stats">
                  <span><FaStar /> {creator?.stats?.averageRating || 5.0}</span>
                  <span><FaUsers /> {creator?.stats?.studentsTaught?.toLocaleString() || '1000+'} taught</span>
                </div>
              </div>
              <button className="schedule-btn">Schedule Session</button>
            </div>

            {/* Student-Teachers */}
            {mockStudentTeachers.map(st => (
              <div key={st.id} className={`student-teacher-card ${!st.available ? 'unavailable' : ''}`}>
                <div className="st-avatar">
                  <img src={st.avatar} alt={st.name} />
                  {st.available && <span className="available-badge">Available</span>}
                </div>
                <div className="st-info">
                  <h4>{st.name}</h4>
                  <div className="st-stats">
                    <span><FaStar /> {st.rating}</span>
                    <span><FaChalkboardTeacher /> {st.sessionsTaught} sessions</span>
                  </div>
                </div>
                <button className="schedule-btn" disabled={!st.available}>
                  {st.available ? 'Schedule Session' : 'Unavailable'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Course Curriculum */}
        <div className="course-content-section">
          <div className="course-curriculum">
            <h4>
              <FaBook className="section-icon" />
              Course Curriculum
            </h4>
            <div className="curriculum-list">
              {course.curriculum?.map((module, index) => (
                <div key={index} className="curriculum-item">
                  <div className="module-info">
                    <span className="module-number">Module {index + 1}</span>
                    <span className="module-title">{module.title}</span>
                    <span className="module-duration">{module.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="learning-objectives">
            <h4>
              <FaCheck className="section-icon" />
              What You'll Learn
            </h4>
            <div className="objectives-grid">
              {course.learningObjectives?.map((objective, index) => (
                <div key={index} className="objective-item">
                  <FaCheck className="check-icon" />
                  <span>{objective}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Earn While You Learn - PeerLoop Value Prop */}
        <div className="earn-section">
          <div className="earn-content">
            <h3>
              <FaChalkboardTeacher className="section-icon" />
              Earn While You Learn
            </h3>
            <p>Complete this course, get certified, and become a Student-Teacher.</p>
            
            <div className="revenue-split">
              <div className="split-item student-teacher-split">
                <span className="split-percent">70%</span>
                <span className="split-label">You Earn</span>
                <span className="split-desc">As a Student-Teacher</span>
              </div>
              <div className="split-item creator-split">
                <span className="split-percent">15%</span>
                <span className="split-label">Creator</span>
                <span className="split-desc">Course creator</span>
              </div>
              <div className="split-item platform-split">
                <span className="split-percent">15%</span>
                <span className="split-label">PeerLoop</span>
                <span className="split-desc">Platform</span>
              </div>
            </div>

            <p className="earn-example">
              At {course.price}, you'd earn <strong>${Math.round(parseFloat(course.price.replace('$', '')) * 0.7)}</strong> per student you teach.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="final-cta">
          <button className="enroll-now-btn" aria-label={`Enroll in ${course.title} for ${course.price}`}>
            <FaCalendarAlt /> Enroll Now - {course.price}
          </button>
          <p className="cta-subtext">Start learning with 1-on-1 tutoring sessions</p>
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