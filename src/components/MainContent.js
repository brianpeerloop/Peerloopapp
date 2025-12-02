import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './MainContent.css';
import { FaImage, FaSmile, FaCalendar, FaMapMarkerAlt, FaGlobe, FaSearch, FaBook, FaUser, FaFilter, FaGraduationCap, FaStar, FaUsers, FaAward } from 'react-icons/fa';
import { AiOutlineHeart, AiOutlineBarChart } from 'react-icons/ai';
import { BiRepost } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { IoShareOutline } from 'react-icons/io5';
import { MdChatBubbleOutline } from 'react-icons/md';
import { BsBookmark } from 'react-icons/bs';
import Dashboard from './Dashboard';
import Community from './Community';
import Profile from './Profile';
import CreatorProfile from './CreatorProfile';
import CreatorMode from './CreatorMode';
import CourseListing from './CourseListing';
import JobExchange from './JobExchange';
import { getAllInstructors, getInstructorWithCourses, getCourseById, getAllCourses, getInstructorById, getIndexedCourses, getIndexedInstructors } from '../data/database';
import { UserPropType } from './PropTypes';

const MainContent = ({ activeMenu, currentUser, onSwitchUser, onMenuChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const lastTopMenuRef = useRef('courses');
  const [activeTopMenu, setActiveTopMenu] = useState('courses');
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentInstructorForCourse, setCurrentInstructorForCourse] = useState(null);
  const [isReturningFromCourse, setIsReturningFromCourse] = useState(false);
  const [followedCommunities, setFollowedCommunities] = useState(() => {
    // Load existing follow states from localStorage
    try {
      const stored = localStorage.getItem('followedCommunities');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing followedCommunities from localStorage:', error);
      return [];
    }
  });
  const [lastBrowseClick, setLastBrowseClick] = useState(0);
  const [indexedCourses, setIndexedCourses] = useState([]);
  const [indexedInstructors, setIndexedInstructors] = useState([]);
  const [isFollowDropdownOpen, setIsFollowDropdownOpen] = useState(false);
  const [followedInstructors, setFollowedInstructors] = useState(() => {
    // Start with empty set - no instructors followed by default
    return new Set();
  });
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [selectedCourseForListing, setSelectedCourseForListing] = useState(null);

    // Reset to top level when Browse menu is clicked
    React.useEffect(() => {
      if (activeMenu === 'Browse' || activeMenu === 'Browse_Reset') {
        setSelectedInstructor(null);
        setSelectedCourse(null);
        setCurrentInstructorForCourse(null);
        setActiveTopMenu(lastTopMenuRef.current || 'courses');
        setSearchQuery('');
      }
    }, [activeMenu]);

    // Reset when Browse is clicked again while already on Browse page
    React.useEffect(() => {
      if (activeMenu === 'Browse' && lastBrowseClick > 0) {
        setSelectedInstructor(null);
        setSelectedCourse(null);
        setCurrentInstructorForCourse(null);
        setActiveTopMenu('instructors');
        setSearchQuery('');
      }
    }, [lastBrowseClick]);

    // Track last selected top menu
    useEffect(() => {
      lastTopMenuRef.current = activeTopMenu;
    }, [activeTopMenu]);

    // Restore last selected top menu when Browse is activated
    useEffect(() => {
      if (activeMenu === 'Browse' || activeMenu === 'Browse_Reset') {
        setSelectedInstructor(null);
        setSelectedCourse(null);
        setCurrentInstructorForCourse(null);
        setActiveTopMenu(lastTopMenuRef.current || 'courses');
        setSearchQuery('');
      }
    }, [activeMenu]);

    // On mount, build or load indexes
    useEffect(() => {
      const initializeIndexes = () => {
        try {
          // Clear cached indexes to force regeneration with new search logic
          localStorage.removeItem('indexedCourses');
          localStorage.removeItem('indexedInstructors');
          
          const courses = getIndexedCourses();
          const instructors = getIndexedInstructors();
          setIndexedCourses(courses);
          setIndexedInstructors(instructors);
          
          // Try to save to localStorage, but don't fail if it's not available
          try {
            localStorage.setItem('indexedCourses', JSON.stringify(courses));
            localStorage.setItem('indexedInstructors', JSON.stringify(instructors));
          } catch (storageError) {
            // localStorage might not be available (private browsing, etc.)
            console.warn('localStorage not available, indexes will not be cached:', storageError);
          }
        } catch (error) {
          console.error('Error initializing indexes:', error);
          // Fallback: set empty arrays to prevent crashes
          setIndexedCourses([]);
          setIndexedInstructors([]);
        }
      };
      
      initializeIndexes();
    }, []);

      // When followedCommunities changes, save to localStorage
  useEffect(() => {
    const saveFollowedCommunities = () => {
      try {
        localStorage.setItem('followedCommunities', JSON.stringify(followedCommunities));
      } catch (error) {
        console.error('Error saving followedCommunities to localStorage:', error);
        // Fallback: try to save a minimal version
        try {
          localStorage.setItem('followedCommunities', JSON.stringify([]));
        } catch (fallbackError) {
          console.error('Error saving fallback followedCommunities to localStorage:', fallbackError);
        }
      }
    };
    
    saveFollowedCommunities();
  }, [followedCommunities]);

    // 2. For each course button (dropdown and course list), use:
    // <button className={`follow-btn ${followedCourses.has(courseObj.id) ? 'following' : ''}`} ...>
    //   {followedCourses.has(courseObj.id) ? 'Following' : 'Follow'}
    // </button>
    // 3. For the top button, use:
    // <button className={`follow-btn ${isAnyCourseFollowed ? 'following' : ''}`} ...>
    //   {isAnyCourseFollowed ? 'Following' : 'Follow'}
    // </button>
    // 4. Remove any logic that could cause a stale or mismatched state.

    // Instructor data from database
  const [instructorsData, setInstructorsData] = useState(getAllInstructors());
  const instructorData = instructorsData[0]; // Default to first instructor

  // Remove embedded mock posts - all data should come from database
  const mockPosts = [];

      const [editingInstructor, setEditingInstructor] = useState(false);
    const [editedInstructorData, setEditedInstructorData] = useState({...instructorData});
    const [savedInstructorData, setSavedInstructorData] = useState(instructorData);

    // Update edited data when selected instructor changes
    React.useEffect(() => {
      if (selectedInstructor && !isReturningFromCourse) {
        // Get full instructor data with courses from database
        const fullInstructorData = getInstructorWithCourses(selectedInstructor.id);
        if (fullInstructorData) {
          setEditedInstructorData({...fullInstructorData});
          setSavedInstructorData(fullInstructorData);
        } else {
          setEditedInstructorData({...selectedInstructor});
          setSavedInstructorData(selectedInstructor);
        }
      }
      // Reset the flag after processing
      if (isReturningFromCourse) {
        setIsReturningFromCourse(false);
      }
    }, [selectedInstructor, isReturningFromCourse]);

      const handleSaveInstructor = () => {
      setEditingInstructor(false);
      const updatedInstructor = {...editedInstructorData};
      setSavedInstructorData(updatedInstructor);
      
      // Update the selected instructor with the new data
      setSelectedInstructor(updatedInstructor);
      
      // Update the instructor in the instructorsData array
      const updatedInstructorsData = instructorsData.map(instructor => 
        instructor.id === selectedInstructor.id ? updatedInstructor : instructor
      );
      setInstructorsData(updatedInstructorsData);
      
      // Here you would typically save to backend
    };

      const handleCancelEdit = () => {
      setEditingInstructor(false);
      setEditedInstructorData({...savedInstructorData});
    };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedInstructorData({
          ...editedInstructorData,
          avatar: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

    const renderInstructorProfile = () => {
    const instructorCourseIds = selectedInstructor.courses ? selectedInstructor.courses.map(c => (typeof c === 'object' ? c.id : c)) : [];
    const isAnyCourseFollowed = instructorCourseIds.some(id => isCourseFollowed(id));

    return (
    <div className="instructor-profile">
      <div className="instructor-profile-hero">
        <div className="instructor-profile-bg" />
        <div className="instructor-profile-avatar">
          <img src={selectedInstructor.avatar} alt={selectedInstructor.name} />
        </div>
      </div>
      <div className="instructor-profile-content">
        <div className="instructor-profile-actions">
          {!editingInstructor ? (
            <div className="profile-action-buttons">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button 
                  className={`follow-btn ${isInstructorFollowed(selectedInstructor.id) ? 'following' : ''}`}
                  onClick={() => setIsFollowDropdownOpen(open => !open)}
                >
                  {isInstructorFollowed(selectedInstructor.id) ? 'Following' : 'Follow'}
                </button>
                {isFollowDropdownOpen && (
                  <div className="follow-dropdown">
                    {selectedInstructor.courses && selectedInstructor.courses.map(c => {
                      const courseObj = typeof c === 'object' ? c : indexedCourses.find(course => course.id === c);
                      if (!courseObj) return null;
                      return (
                        <div key={courseObj.id} className="dropdown-course-item" onClick={e => { e.stopPropagation(); handleFollowCourse(courseObj.id); }}>
                          <span>{courseObj.title}</span>
                          {isCourseFollowed(courseObj.id) && <span className="checkmark">✔</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <button className="edit-instructor-btn" onClick={() => setEditingInstructor(true)}>
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSaveInstructor}>
                Save
              </button>
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          )}
        </div>
        
        {editingInstructor ? (
          <div className="instructor-edit-form">
            <div className="form-group">
              <label>Profile Picture</label>
              <div className="image-upload-container">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="image-upload"
                  className="image-upload-input"
                />
                <label htmlFor="image-upload" className="image-upload-label">
                  <div className="image-upload-preview">
                    <img src={editedInstructorData.avatar} alt="Profile preview" />
                  </div>
                  <span>Click to upload new image</span>
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                value={editedInstructorData.name}
                onChange={(e) => setEditedInstructorData({...editedInstructorData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                value={editedInstructorData.title}
                onChange={(e) => setEditedInstructorData({...editedInstructorData, title: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea 
                value={editedInstructorData.bio}
                onChange={(e) => setEditedInstructorData({...editedInstructorData, bio: e.target.value})}
                rows={4}
              />
            </div>
          </div>
        ) : (
          <div className="instructor-profile-summary">
            <h1>{selectedInstructor.name}</h1>
            <p className="instructor-title">{selectedInstructor.title}</p>
            <p className="instructor-bio">{selectedInstructor.bio}</p>
            
            {/* Qualifications Section */}
            {selectedInstructor.qualifications && selectedInstructor.qualifications.length > 0 && (
              <div className="instructor-qualifications-section">
                <h2>Qualifications</h2>
                <div className="qualifications-list">
                  {selectedInstructor.qualifications.map((qual, index) => (
                    <div key={index} className="qualification-item">
                      <span className="qualification-sentence">{qual.sentence}</span>
                    </div>
                  ))}
                  {selectedInstructor.website && (
                    <div className="qualification-item">
                      <a 
                        href={selectedInstructor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="qualification-link"
                      >
                        Visit Website →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
            

            

            
            {selectedInstructor.courses && selectedInstructor.courses.length > 0 && (
              <div className="instructor-courses">
                <h2>Courses</h2>
                <div className="courses-list">
                  {selectedInstructor.courses.map(c => {
                    const courseObj = typeof c === 'object' ? c : indexedCourses.find(course => course.id === c);
                    if (!courseObj) return null;
                    return (
                      <div key={courseObj.id} className="course-link" onClick={() => {
                        setSelectedCourse(courseObj);
                        setCurrentInstructorForCourse(selectedInstructor);
                      }}>
                        <div className="course-link-thumbnail">
                          <img src={courseObj.thumbnail} alt={courseObj.title} />
                        </div>
                        <div className="course-link-info">
                          <h3>{courseObj.title}</h3>
                          <p className="course-link-description">{courseObj.description}</p>
                          <div className="course-link-meta">
                            <span className="course-duration">{courseObj.duration}</span>
                            <span className="course-level">{courseObj.level}</span>
                            <span className="course-rating">⭐ {courseObj.rating}</span>
                            <span className="course-students">{courseObj.students} students</span>
                          </div>
                          <div className="course-link-price">
                            <span className="price">{courseObj.price}</span>
                          </div>
                        </div>
                        <div className="course-link-arrow">
                          →
                        </div>
                        <button 
                          className={`follow-btn ${isCourseFollowed(courseObj.id) ? 'following' : ''}`} 
                          onClick={e => { e.stopPropagation(); handleFollowCourse(courseObj.id); }}
                          disabled={isFollowingLoading}
                        >
                          {isCourseFollowed(courseObj.id) ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

  // Helper function to get community data for a course
  const getCommunityForCourse = (courseId) => {
    const course = getCourseById(courseId);
    if (!course) return null;
    
    const instructor = getInstructorById(course.instructorId);
    if (!instructor) return null;
    
    // Generate community data dynamically based on course and instructor
    const communityColors = [
      '#4ECDC4', '#00D2FF', '#FF9900', '#FF6B6B', '#9B59B6', 
      '#FFD93D', '#00B894', '#6C5CE7', '#FF7675', '#74B9FF',
      '#636e72', '#0984e3', '#e17055', '#fdcb6e'
    ];
    
    const colorIndex = (courseId - 1) % communityColors.length;
    const color = communityColors[colorIndex];
    
    // Generate topic image based on course category
    const topicImage = `https://via.placeholder.com/400x200${color.replace('#', '')}/ffffff?text=${course.category.replace(/\s+/g, '')}`;
    
    // Generate instructor avatar
    const instructorAvatar = `https://via.placeholder.com/48x48${color.replace('#', '')}/ffffff?text=${instructor.name.split(' ').map(n => n[0]).join('')}`;
    
    // Calculate community stats based on course data
    const members = Math.floor(course.students * 0.8); // 80% of students are community members
    const posts = Math.floor(members * 0.3); // 30% of members have posted
    const lastActivity = '2 hours ago'; // Default activity time
    
    return {
      id: courseId,
      name: `${course.title} Community`,
      topic: course.category,
      members: members,
      posts: posts,
      lastActivity: lastActivity,
      instructor: instructor.name,
      instructorAvatar: instructorAvatar,
      topicImage: topicImage,
      description: course.description,
      courseId: courseId
    };
  };

  // Helper function to get course-specific community data
  const getCourseSpecificCommunity = (courseId) => {
    const course = getCourseById(courseId);
    if (!course) return null;
    
    const baseCommunity = getCommunityForCourse(courseId);
    if (!baseCommunity) return null;
    
    // Create a course-specific community that only includes posts from this specific course
    return {
      ...baseCommunity,
      id: `course-${courseId}`, // Unique ID for this specific course
      name: `${course.title} Community`,
      description: `Community for ${course.title} - ${course.description}`,
      courseId: courseId,
      isCourseSpecific: true
    };
  };

  // Helper function to check if a course is followed
  const isCourseFollowed = (courseId) => {
    const courseSpecificId = `course-${courseId}`;
    return followedCommunities.some(c => c.id === courseSpecificId);
  };

  // Helper function to check if an instructor is followed (based on their course communities)
  const isInstructorFollowed = (instructorId) => {
    const instructor = getInstructorById(instructorId);
    if (!instructor) return false;
    
    // Check if all of the instructor's course communities are followed
    return instructor.courses.every(courseId => {
      const courseSpecificId = `course-${courseId}`;
      return followedCommunities.some(c => c.id === courseSpecificId);
    });
  };

  const handleFollowInstructor = (instructorId) => {
    if (isFollowingLoading) return; // Prevent rapid clicking
    
    try {
      setIsFollowingLoading(true);
      
      // Validate instructorId
      if (!instructorId || typeof instructorId !== 'number') {
        console.error('Invalid instructorId:', instructorId);
        return;
      }

      // Get instructor data to find their courses
      const instructor = getInstructorById(instructorId);
      if (!instructor) {
        console.error('Instructor not found:', instructorId);
        return;
      }

      const isAlreadyFollowed = isInstructorFollowed(instructorId);
      
      if (isAlreadyFollowed) {
        // Unfollow - remove all course-specific communities for this instructor's courses
        setFollowedCommunities(prev => {
          return prev.filter(community => {
            // Keep communities that are not course-specific for this instructor
            if (!community.isCourseSpecific) return true;
            // Remove course-specific communities for this instructor's courses
            return !instructor.courses.includes(community.courseId);
          });
        });
      } else {
        // Follow - add all course-specific communities for this instructor's courses
        const newCommunities = instructor.courses.map(courseId => {
          return getCourseSpecificCommunity(courseId);
        }).filter(Boolean); // Filter out any undefined communities
        
        setFollowedCommunities(prev => {
          // Add new communities, avoiding duplicates
          const existingIds = new Set(prev.map(c => c.id));
          const uniqueNewCommunities = newCommunities.filter(c => !existingIds.has(c.id));
          return [...prev, ...uniqueNewCommunities];
        });
      }
    } catch (error) {
      console.error('Error in handleFollowInstructor:', error);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const handleFollowCourse = (courseId) => {
    if (isFollowingLoading) return; // Prevent rapid clicking
    
    try {
      setIsFollowingLoading(true);
      
      // Validate courseId
      if (!courseId || typeof courseId !== 'number') {
        console.error('Invalid courseId:', courseId);
        return;
      }

      const course = getCourseById(courseId);
      if (!course) {
        console.error('Course not found for courseId:', courseId);
        return;
      }
      const instructor = getInstructorById(course.instructorId);
      if (!instructor) {
        console.error('Instructor not found for courseId:', courseId);
        return;
      }

      // Get all course-specific communities for this instructor
      const allInstructorCourseCommunities = instructor.courses.map(cid => getCourseSpecificCommunity(cid)).filter(Boolean);
      
      setFollowedCommunities(prev => {
        // Check if any of the instructor's course communities are already followed
        const isAlreadyFollowed = allInstructorCourseCommunities.every(c => prev.some(pc => pc.id === c.id));
        
        if (isAlreadyFollowed) {
          // Unfollow: remove all of this instructor's course communities
          const newCommunities = prev.filter(c => !instructor.courses.includes(c.courseId));
          
          // Also remove instructor from followedInstructors if no courses are followed
          const remainingInstructorCourses = newCommunities.filter(c => 
            c.isCourseSpecific && instructor.courses.includes(c.courseId)
          );
          if (remainingInstructorCourses.length === 0) {
            setFollowedInstructors(prev => {
              const newSet = new Set(prev);
              newSet.delete(instructor.id);
              return newSet;
            });
          }
          
          return newCommunities;
        } else {
          // Follow: add all of this instructor's course communities (avoid duplicates)
          const existingIds = new Set(prev.map(c => c.id));
          const uniqueNewCommunities = allInstructorCourseCommunities.filter(c => !existingIds.has(c.id));
          const newCommunities = [...prev, ...uniqueNewCommunities];
          
          // Also add instructor to followedInstructors
          setFollowedInstructors(prev => {
            const newSet = new Set(prev);
            newSet.add(instructor.id);
            return newSet;
          });
          
          return newCommunities;
        }
      });
    } catch (error) {
      console.error('Error in handleFollowCourse:', error);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const renderCourseDetail = () => {
    // Get full course data from database
    const courseData = getCourseById(selectedCourse.id);
    if (!courseData) return null;
    // Get instructor data for this course
    const instructorData = getInstructorById(courseData.instructorId);
    // Mock student-teacher stats
    const studentTeachers = 1200;
    const avgTaught = 5;
    // Mock top teacher badge
    const topTeacherBadge = '🏅 Master Educator';
    // Mock related courses
    const relatedCourses = [
      { id: 2, title: 'AI for Everyone' },
      { id: 4, title: 'Machine Learning Basics' }
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0', marginTop: '0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', maxWidth: '100%', margin: '0', background: '#fff', borderRadius: 0, border: '1px solid #e6e8ec', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 0, marginTop: '0' }}>
          {/* Removed banner image so the title is at the very top */}
          {/* Title & Creator */}
          <div style={{ padding: '24px 32px 0 32px', textAlign: 'center' }}>
            <div className="main-course-title" style={{ fontWeight: 700, fontSize: 32, marginBottom: 8 }}>
              {courseData.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 8 }}>
              <span style={{ fontSize: 16, color: '#444' }}>Created by {instructorData && instructorData.name}</span>
            </div>
            {/* Stats Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 15, marginBottom: 10 }}>
              <span title="Rating" style={{ display: 'flex', alignItems: 'center', gap: 2 }}><span style={{ color: '#f5b50a', fontSize: 16 }}>★</span> {courseData.rating}</span>
              <span title="Active Learners" style={{ display: 'flex', alignItems: 'center', gap: 2 }}><span role="img" aria-label="users">👥</span> {courseData.students.toLocaleString()} Active Learners</span>
              <span title="Level" style={{ display: 'flex', alignItems: 'center', gap: 2 }}><span role="img" aria-label="level">📊</span> {courseData.level}</span>
              <span title="Price" style={{ display: 'flex', alignItems: 'center', gap: 2 }}><span role="img" aria-label="money">💰</span> {courseData.price}</span>
            </div>
            {/* Description */}
            <div style={{ color: '#222', fontSize: 15, marginBottom: 14, textAlign: 'center' }}>{courseData.description}</div>
            {/* Flywheel Benefits */}
            <ul style={{ color: '#222', fontSize: 15, margin: '18px 0 0 0', paddingLeft: 0, textAlign: 'left', fontWeight: 400, lineHeight: 1.5, listStylePosition: 'inside' }}>
              <li style={{ marginBottom: 2 }}>Earn: 80% commission on each student you teach (e.g., teach one to recover $80 of $100 investment)</li>
              <li style={{ marginBottom: 2 }}>Certify: Dual credentials – Learning Certificate for knowledge, Teaching Certificate for impact</li>
              <li style={{ marginBottom: 2 }}>Community: Join or create gated groups for certified peers; network, collaborate on real-world AI projects</li>
              <li style={{ marginBottom: 2 }}>Outcomes: Address Bloom's 2 Sigma with scalable one-to-one peer tutoring for superior retention and mastery</li>
            </ul>
            {/* Curriculum Outline */}
            <div style={{ margin: '32px 0 0 0', textAlign: 'left', width: '100%', paddingLeft: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Curriculum Outline</div>
              {courseData.curriculum.map((module, idx) => (
                <div key={idx} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, display: 'inline-block' }}>{module.title} <span style={{ fontWeight: 400, fontSize: 15, color: '#888' }}>({module.duration})</span></div>
                  <div style={{ fontSize: 15, color: '#222', marginLeft: 2 }}>{module.description}</div>
                </div>
              ))}
            </div>
            {/* Creator Profile Teaser */}
            <div style={{ margin: '18px 0', textAlign: 'center', background: '#f7f9fa', borderRadius: 10, padding: 16 }}>
              <img src={instructorData.avatar} alt={instructorData.name} style={{ width: 48, height: 48, borderRadius: '50%', marginBottom: 4 }} />
              <div style={{ fontWeight: 600, fontSize: 15 }}>{instructorData.name}</div>
              <div style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>{instructorData.title}</div>
              <div style={{ color: '#444', fontSize: 13 }}>{instructorData.bio}</div>
            </div>
            {/* Student-Teacher Stats */}
            <div style={{ color: '#1d9bf0', fontSize: 13, marginBottom: 10, textAlign: 'center' }}>
              Active Student-Teachers: {studentTeachers} &nbsp;|&nbsp; Avg. Taught per Teacher: {avgTaught} &nbsp;|&nbsp; Top Teacher Badge: {topTeacherBadge}
            </div>
            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, margin: '10px 0 18px 0' }}>
              <span style={{ color: '#1d9bf0', fontWeight: 600, fontSize: 14, cursor: 'pointer', textDecoration: 'none', padding: 0, background: 'none', border: 'none', lineHeight: '20px' }} onMouseOver={e => e.target.style.textDecoration = 'underline'} onMouseOut={e => e.target.style.textDecoration = 'none'}>Enroll</span>
              <span style={{ color: '#1d9bf0', fontWeight: 600, fontSize: 14, cursor: 'pointer', textDecoration: 'none', padding: 0, background: 'none', border: 'none', lineHeight: '20px' }} onMouseOver={e => e.target.style.textDecoration = 'underline'} onMouseOut={e => e.target.style.textDecoration = 'none'}>Explore Teaching</span>
              <span style={{ color: '#1d9bf0', fontWeight: 500, fontSize: 14, cursor: 'pointer', textDecoration: 'none', padding: 0, background: 'none', border: 'none', lineHeight: '20px' }} onMouseOver={e => e.target.style.textDecoration = 'underline'} onMouseOut={e => e.target.style.textDecoration = 'none'}>Follow Course</span>
              <span style={{ color: '#1d9bf0', fontWeight: 500, fontSize: 14, cursor: 'pointer', textDecoration: 'none', padding: 0, background: 'none', border: 'none', lineHeight: '20px' }} onMouseOver={e => e.target.style.textDecoration = 'underline'} onMouseOut={e => e.target.style.textDecoration = 'none'}>Join Community</span>
            </div>
            {/* Footer: Related Courses, Share Links */}
            <div style={{ color: '#888', fontSize: 13, textAlign: 'center', marginBottom: 10 }}>
              Related Courses: {relatedCourses.map(rc => rc.title).join(' | ')}
            </div>
            <div style={{ color: '#1d9bf0', fontSize: 13, textAlign: 'center', marginBottom: 18 }}>
              
            </div>
          </div>
        </div>
        {/* End of Card Padding */}
        <div style={{ height: 40 }} />
      </div>
    );
  };

  const renderInstructorSummary = () => {
    const filteredInstructors = indexedInstructors.filter(instructor =>
      instructor.searchIndex.includes(searchQuery.toLowerCase())
    );
    return (
      <div className="courses-feed" style={{ padding: 0, margin: 0 }}>
        {filteredInstructors.map(instructor => (
          <div key={instructor.id} className="course-post" onClick={() => {
            const fullInstructorData = getInstructorWithCourses(instructor.id);
            setSelectedInstructor(fullInstructorData || instructor);
          }}>
            <div className="post-content" style={{ padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, color: '#222' }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{instructor.name}</span>
                <span style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>@{instructor.title}</span>
              </div>
              <div className="post-text" style={{ color: '#222' }}>{instructor.bio}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 15, margin: '8px 0 2px 0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FaBook style={{ fontSize: 18, color: '#4e8dd2' }} /> {instructor.stats?.coursesCreated || 0} Courses</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FaStar style={{ fontSize: 18, color: '#4e8dd2' }} /> {instructor.stats?.averageRating || 0}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FaUsers style={{ fontSize: 18, color: '#4e8dd2' }} /> {instructor.stats?.followers?.toLocaleString() || 0} Followers</span>
              </div>
              {/* Horizontal stats row instead of vertical list */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: '#222', fontSize: 13, margin: '6px 0 0 0' }}>
                <span>Total Students: {instructor.stats?.studentsTaught?.toLocaleString() || 'N/A'}</span>
                <span style={{ color: '#888' }}>•</span>
                <span>Avg. Course Rating: {instructor.stats?.averageRating || 'N/A'}</span>
                <span style={{ color: '#888' }}>•</span>
                <span>Communities: {instructor.stats?.communityType || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8, color: '#1d9bf0', fontSize: 13 }} onClick={e => e.stopPropagation()}>
                <button className={`follow-btn ${isInstructorFollowed(instructor.id) ? 'following' : ''}`}
                  onClick={() => handleFollowInstructor(instructor.id)}
                  disabled={isFollowingLoading}
                  style={{ fontWeight: 500, fontSize: 13, background: 'none', border: 'none', color: '#1d9bf0', cursor: 'pointer', padding: 0 }}
                >
                  {isInstructorFollowed(instructor.id) ? 'Following' : 'Follow'}
                </button>
                <span style={{ cursor: 'pointer', color: '#1d9bf0', fontWeight: 500 }} onClick={() => setSelectedInstructor(getInstructorWithCourses(instructor.id))}>View Courses</span>
                <span style={{ cursor: 'pointer', color: '#1d9bf0', fontWeight: 500 }}>Message</span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <span title="Like" style={{ color: '#888', fontSize: 15, cursor: 'pointer' }}>👍</span>
                <span title="Dislike" style={{ color: '#888', fontSize: 15, cursor: 'pointer' }}>👎</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Show Browse when Browse is active
  if (activeMenu === 'Browse' || activeMenu === 'Browse_Reset') {
    return (
      <div className="main-content">
        <div style={{ display: 'flex', gap: '32px', marginTop: 32 }}>
          {/* Left: Main Content */}
          <div style={{ flex: 2, minWidth: 0 }}>
            <div className="top-menu-section">
              <div className="tabs-section">
                <button
                  className={`tab-btn ${activeTopMenu === 'courses' ? 'active' : ''}`}
                  onClick={() => setActiveTopMenu('courses')}
                >
                  <FaBook />
                  <span>Courses</span>
                </button>
                <button
                  className={`tab-btn ${activeTopMenu === 'instructors' ? 'active' : ''}`}
                  onClick={() => setActiveTopMenu('instructors')}
                >
                  <FaUser />
                  <span>Creator/Instructor</span>
                </button>
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search courses, instructors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
            </div>
            <div className="browse-content">
              {activeTopMenu === 'courses' ? (
                <div className="courses-section">
                  {selectedCourse ? (
                    <div className="course-detail-view">
                      <button 
                        className="back-btn"
                        onClick={() => setSelectedCourse(null)}
                      >
                        ← Back to Courses
                      </button>
                      {renderCourseDetail()}
                    </div>
                  ) : (
                    <>
                      <div className="browse-header">
                        <h1></h1>
                      </div>
                      <div className="courses-feed">

                        {indexedCourses.filter(course =>
                          course.searchIndex.includes(searchQuery.toLowerCase())
                        ).map(course => {
                          const instructorData = getInstructorById(course.instructorId);
                          return (
                            <div key={course.id} className="course-post" onClick={() => setSelectedCourse(course)} style={{ background: '#fff', boxShadow: 'none', padding: '12px 18px', fontFamily: 'system-ui, sans-serif', fontSize: 15, lineHeight: 1.35, width: '100%', marginLeft: 0, marginRight: 0, cursor: 'pointer', color: '#222' }}>
                              <div className="post-content" style={{ padding: 0 }}>
                                {/* Title and Duration Row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, color: '#222' }}>
                                  <span style={{ fontWeight: 700, fontSize: 16, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.title}</span>
                                  <span style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>• {course.duration}</span>
                                </div>
                                <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500, margin: '2px 0 6px 0' }}>By {instructorData?.name}</div>
                                {/* Description Row - show all text */}
                                <div className="post-text" style={{ color: '#222' }}>
                                  {course.description} Master AI skills, earn certificates, and unlock the option to teach and earn commissions.
                                </div>
                                {/* Teacher Stats - tight */}
                                <div style={{ color: '#888', fontSize: 12, marginBottom: 2 }}>
                                  Student-Teachers: 158 | Avg. Taught: 12
                                </div>
                                {/* Action Buttons Row - social media style */}
                                <div className="post-actions" style={{ display: 'flex', justifyContent: 'flex-start', gap: '40px', maxWidth: '425px', marginTop: 8 }} onClick={e => e.stopPropagation()}>
                                  <button className="action-btn">
                                    <MdChatBubbleOutline className="action-icon" />
                                  </button>
                                  <button className="action-btn">
                                    <BiRepost className="action-icon retweet-icon" />
                                    <span className="action-count">1</span>
                                  </button>
                                  <button className="action-btn">
                                    <AiOutlineHeart className="action-icon heart-icon" />
                                    <span className="action-count">3</span>
                                  </button>
                                  <button className="action-btn">
                                    <BsBookmark className="action-icon" />
                                  </button>
                                  <button className="action-btn">
                                    <IoShareOutline className="action-icon" />
                                  </button>
                                  <button className="action-btn">
                                    <BsThreeDots className="action-icon" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="instructors-section">
                  <div className="browse-header">
                    <h1></h1>
                  </div>
                  {selectedInstructor ? (
                    <div className="instructor-detail-view">
                      <button 
                        className="back-btn"
                        onClick={() => setSelectedInstructor(null)}
                      >
                        ← Back to Instructors
                      </button>
                      {renderInstructorProfile()}
                    </div>
                  ) : (
                    renderInstructorSummary()
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Right: Empty Pane */}
          <div style={{ flex: 1, minWidth: 320 }}></div>
        </div>
      </div>
    );
  }

  // Show Dashboard when Dashboard is active
  if (activeMenu === 'Dashboard') {
    return (
      <div className="main-content">
        <Dashboard />
      </div>
    );
  }

  // Show Community when My Community is active
  if (activeMenu === 'My Community') {
    return (
      <div className="main-content">
        <Community
          followedCommunities={followedCommunities}
          setFollowedCommunities={setFollowedCommunities}
        />
      </div>
    );
  }

  // Show Notifications when Notifications is active
  if (activeMenu === 'Notifications') {
    return (
      <div className="main-content">
        <div className="feed-header">
          <h1>Notifications</h1>
        </div>
        <div className="feed-posts">
          {/* Fake notifications data */}
          {[
            {
              id: 1,
              type: 'course',
              title: 'New Course Available',
              message: 'Check out "Advanced React Patterns" - now available for enrollment!',
              timestamp: '2 hours ago',
              unread: true
            },
            {
              id: 2,
              type: 'community',
              title: 'Community Update',
              message: 'Sarah joined your "Machine Learning Basics" community',
              timestamp: '5 hours ago',
              unread: true
            },
            {
              id: 3,
              type: 'achievement',
              title: 'Achievement Unlocked!',
              message: 'Congratulations! You completed your first course as a teacher.',
              timestamp: '1 day ago',
              unread: false
            },
            {
              id: 4,
              type: 'message',
              title: 'New Message',
              message: 'John sent you a message about your "AI Ethics" course',
              timestamp: '2 days ago',
              unread: false
            },
            {
              id: 5,
              type: 'system',
              title: 'System Update',
              message: 'Platform maintenance completed. All services are back online.',
              timestamp: '3 days ago',
              unread: false
            }
          ].map(notification => (
            <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
              <div className="notification-content">
                <div className="notification-header">
                  <span className="notification-type">{notification.type}</span>
                  <span className="notification-timestamp">{notification.timestamp}</span>
                </div>
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-actions">
                  <button className="notification-action-btn">
                    <span className="notification-action-icon">💬</span>
                    <span className="notification-action-count">12</span>
                  </button>
                  <button className="notification-action-btn">
                    <span className="notification-action-icon">🔄</span>
                    <span className="notification-action-count">24</span>
                  </button>
                  <button className="notification-action-btn">
                    <span className="notification-action-icon">❤️</span>
                    <span className="notification-action-count">156</span>
                  </button>
                  <button className="notification-action-btn">
                    <span className="notification-action-icon">📈</span>
                    <span className="notification-action-count">2.1K</span>
                  </button>
                  <button className="notification-action-btn">
                    <span className="notification-action-icon">🔖</span>
                  </button>
                  <button className="notification-action-btn">
                    <span className="notification-action-icon">📤</span>
                  </button>
                </div>
              </div>
              {notification.unread && <div className="notification-dot"></div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show Profile when Profile is active
  if (activeMenu === 'Profile') {
    return (
      <div className="main-content">
        <Profile 
          currentUser={currentUser} 
          onSwitchUser={typeof onSwitchUser === 'function' ? onSwitchUser : undefined}
          onMenuChange={onMenuChange}
        />
      </div>
    );
  }

  // Show Job Exchange when Job Exchange is active
  if (activeMenu === 'Job Exchange') {
    return (
      <div className="main-content">
        <JobExchange />
      </div>
    );
  }

  // Show CreatorProfile when CreatorProfile is active
  if (activeMenu === 'CreatorProfile') {
    return (
      <div className="main-content">
        <CreatorProfile 
          currentUser={currentUser}
          onBackToMain={() => onMenuChange('Profile')}
          onSwitchToCreatorMode={() => onMenuChange('CreatorMode')}
        />
      </div>
    );
  }

  // Show CreatorMode when in creator mode
  if (['create-course', 'edit-courses', 'preview-courses', 'analytics', 'student-management'].includes(activeMenu)) {
    return (
      <div className="main-content">
        <CreatorMode 
          activeMenu={activeMenu}
          currentUser={currentUser}
        />
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="feed-header">
        <h1>{activeMenu}</h1>
      </div>

      <div className="feed-posts">
        {mockPosts.length > 0 ? (
          mockPosts.map(post => (
            <div key={post.id} className="post">
              <div className="post-avatar">
                <img src={post.avatar} alt={post.author} />
              </div>
              <div className="post-content">
                <div className="post-header">
                  <span className="post-author">{post.author}</span>
                  <span className="post-handle">{post.handle}</span>
                  <span className="post-timestamp">· {post.timestamp}</span>
                </div>
                <div className="post-text">
                  {post.content}
                </div>
                <div className="post-actions">
                  <button className="action-btn">
                    <span className="action-icon">💬</span>
                    <span className="action-count">{post.replies}</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">🔄</span>
                    <span className="action-count">{post.retweets}</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">❤️</span>
                    <span className="action-count">{post.likes}</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">📊</span>
                    <span className="action-count">{post.views}</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">📤</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h2>No content available</h2>
            <p>Content will appear here when available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

MainContent.propTypes = {
  activeMenu: PropTypes.string.isRequired,
  currentUser: UserPropType.isRequired,
  onSwitchUser: PropTypes.func.isRequired
};

export default MainContent; 