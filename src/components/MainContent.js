import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './MainContent.css';
import { FaImage, FaSmile, FaCalendar, FaMapMarkerAlt, FaGlobe, FaSearch, FaBook, FaUser, FaFilter, FaGraduationCap, FaStar, FaUsers, FaAward, FaHeart, FaComment, FaAt, FaRetweet, FaBullhorn, FaDollarSign, FaCheckCircle, FaClock } from 'react-icons/fa';
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

const MainContent = ({ activeMenu, currentUser, onSwitchUser, onMenuChange, isDarkMode }) => {
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
  const [openCreatorFollowDropdown, setOpenCreatorFollowDropdown] = useState(null); // Track which creator's follow dropdown is open
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

    // Close creator follow dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (openCreatorFollowDropdown && !event.target.closest('.creator-follow-dropdown-wrapper')) {
          setOpenCreatorFollowDropdown(null);
        }
      };
      // Use mousedown for more reliable outside-click detection
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openCreatorFollowDropdown]);

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
    const creator = selectedInstructor;
    const creatorCourses = creator.courses ? creator.courses.map(c => typeof c === 'object' ? c : indexedCourses.find(course => course.id === c)).filter(Boolean) : [];

    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '0' }}>
        {/* Back Button */}
        <button 
          onClick={() => setSelectedInstructor(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '10px 16px',
            margin: '16px',
            cursor: 'pointer',
            fontWeight: 600,
            color: '#64748b'
          }}
        >
          ← Back to Creators
        </button>

        {/* Creator Profile Card */}
        <div style={{ background: '#fff', borderRadius: 16, margin: '0 16px 24px 16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {/* Header Banner */}
          <div style={{ background: 'linear-gradient(135deg, #1d9bf0 0%, #0284c7 100%)', height: 120 }} />
          
          {/* Profile Content */}
          <div style={{ padding: '0 24px 24px 24px', marginTop: -50 }}>
            {/* Avatar & Basic Info */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 20 }}>
              <img 
                src={creator.avatar} 
                alt={creator.name}
                style={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: '50%', 
                  border: '4px solid #fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  objectFit: 'cover'
                }}
              />
              <div style={{ flex: 1, paddingBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#1e293b' }}>{creator.name}</h1>
                  <span style={{ background: '#dbeafe', color: '#1e40af', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>CREATOR</span>
                </div>
                <p style={{ margin: 0, color: '#64748b', fontSize: 16 }}>{creator.title}</p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  style={{ 
                    background: '#1d9bf0', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '12px 24px', 
                    borderRadius: 8, 
                    fontWeight: 600, 
                    fontSize: 14, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  📅 Schedule Session
                </button>
                {/* Follow Button with Dropdown */}
                <div className="creator-follow-dropdown-wrapper" style={{ position: 'relative' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenCreatorFollowDropdown(openCreatorFollowDropdown === `detail-${creator.id}` ? null : `detail-${creator.id}`);
                    }}
                    style={{ 
                      background: hasAnyCreatorCourseFollowed(creator.id) ? '#e2e8f0' : '#fff',
                      color: hasAnyCreatorCourseFollowed(creator.id) ? '#64748b' : '#1d9bf0',
                      border: '2px solid #e2e8f0', 
                      padding: '12px 24px', 
                      borderRadius: 8, 
                      fontWeight: 600, 
                      fontSize: 14, 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    {hasAnyCreatorCourseFollowed(creator.id) ? '✓ Following' : 'Follow'}
                    <span style={{ fontSize: 10 }}>▼</span>
                  </button>
                  
                  {/* Dropdown */}
                  {openCreatorFollowDropdown === `detail-${creator.id}` && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: 4,
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                      zIndex: 1000,
                      minWidth: 200,
                      maxWidth: 280,
                      padding: '4px 0'
                    }}>
                      <button 
                        type="button"
                        style={{ 
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: 13,
                          color: isInstructorFollowed(creator.id) ? '#dc2626' : '#1d9bf0',
                          fontWeight: 500,
                          borderBottom: '1px solid #f1f5f9',
                          background: 'transparent',
                          border: 'none',
                          width: '100%',
                          textAlign: 'left',
                          display: 'block'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleFollowInstructor(creator.id);
                          setOpenCreatorFollowDropdown(null);
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {isInstructorFollowed(creator.id) ? 'Unfollow All' : 'Follow All'}
                      </button>
                      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                        {creatorCourses.map(course => {
                          const isFollowed = isCourseFollowed(course.id);
                          return (
                            <div 
                              key={course.id}
                              style={{ 
                                padding: '8px 12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 8,
                                fontSize: 13,
                                color: isFollowed ? '#1d9bf0' : '#475569',
                                fontWeight: isFollowed ? 500 : 400
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFollowCourse(course.id);
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <span style={{ 
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {course.title}
                              </span>
                              {isFollowed && <span>✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div style={{ 
              display: 'flex', 
              gap: 32, 
              padding: '16px 0', 
              borderTop: '1px solid #e2e8f0',
              borderBottom: '1px solid #e2e8f0',
              marginBottom: 20
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{creator.stats?.studentsTaught?.toLocaleString() || 0}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Students Taught</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>⭐ {creator.stats?.averageRating || 0}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Avg Rating</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{creator.stats?.coursesCreated || creatorCourses.length}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Courses</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{creator.stats?.totalReviews?.toLocaleString() || 0}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Reviews</div>
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600, color: '#1e293b' }}>About</h3>
              <p style={{ margin: 0, color: '#475569', fontSize: 15, lineHeight: 1.7 }}>{creator.bio}</p>
            </div>

            {/* Credentials */}
            {creator.qualifications && creator.qualifications.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Credentials</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {creator.qualifications.map((qual, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 14 }}>
                      <span style={{ color: '#1d9bf0' }}>✓</span>
                      <span>{qual.sentence}</span>
                    </div>
                  ))}
                </div>
                {creator.website && (
                  <a 
                    href={creator.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block', marginTop: 12, color: '#1d9bf0', fontWeight: 500, fontSize: 14 }}
                  >
                    🌐 Visit Website →
                  </a>
                )}
              </div>
            )}

            {/* Expertise Tags */}
            {creator.expertise && creator.expertise.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Expertise</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {creator.expertise.map((skill, index) => (
                    <span key={index} style={{ 
                      background: '#f1f5f9', 
                      color: '#475569', 
                      padding: '6px 14px', 
                      borderRadius: 20, 
                      fontSize: 13,
                      fontWeight: 500
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Courses Section */}
        {creatorCourses.length > 0 && (
          <div style={{ margin: '0 16px 24px 16px' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: 20, fontWeight: 700, color: '#1e293b' }}>
              Courses by {creator.name}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {creatorCourses.map(course => {
                const isFollowed = isCourseFollowed(course.id);
                const isViaCreator = isCourseFollowedViaCreator(course.id);
                return (
                  <div 
                    key={course.id} 
                    onClick={() => {
                      setSelectedCourse(course);
                      setCurrentInstructorForCourse(creator);
                    }}
                    style={{ 
                      background: '#fff', 
                      borderRadius: 12, 
                      padding: 20, 
                      cursor: 'pointer',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      gap: 20,
                      alignItems: 'flex-start',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      style={{ width: 160, height: 100, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 600, color: '#1e293b' }}>{course.title}</h3>
                      <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: 14, lineHeight: 1.5 }}>{course.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: '#64748b' }}>
                        <span>⭐ {course.rating}</span>
                        <span>👥 {course.students?.toLocaleString()} students</span>
                        <span>⏱️ {course.duration}</span>
                        <span>📊 {course.level}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#1d9bf0' }}>{course.price}</div>
                      <button 
                        onClick={e => { e.stopPropagation(); handleFollowCourse(course.id); }}
                        disabled={isFollowingLoading}
                        style={{ 
                          background: isFollowed ? '#e2e8f0' : '#1d9bf0',
                          color: isFollowed ? '#64748b' : '#fff',
                          border: 'none', 
                          padding: '10px 20px', 
                          borderRadius: 8, 
                          fontWeight: 600, 
                          fontSize: 14, 
                          cursor: 'pointer'
                        }}
                      >
                        {isFollowed ? '✓ Following' : 'Follow'}
                      </button>
                      <button 
                        onClick={e => { e.stopPropagation(); }}
                        style={{ 
                          background: '#1d9bf0', 
                          color: '#fff', 
                          border: 'none', 
                          padding: '10px 20px', 
                          borderRadius: 8, 
                          fontWeight: 600, 
                          fontSize: 14, 
                          cursor: 'pointer' 
                        }}
                      >
                        View Course
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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

  // Helper function to get course-specific community data (for following individual courses)
  const getCourseSpecificCommunity = (courseId) => {
    const course = getCourseById(courseId);
    if (!course) return null;
    
    const instructor = getInstructorById(course.instructorId);
    if (!instructor) return null;
    
    // Create a course-specific community
    return {
      id: `course-${courseId}`,
      type: 'course', // Identifies this as a course follow
      name: course.title, // Just the course name for the tab
      courseId: courseId,
      courseIds: [courseId], // Array for filtering posts
      instructorId: course.instructorId,
      instructorName: instructor.name,
      description: course.description,
      members: Math.floor(course.students * 0.8),
      posts: Math.floor(course.students * 0.24)
    };
  };

  // Helper function to get creator community data (for following creators)
  const getCreatorCommunity = (instructorId) => {
    const instructor = getInstructorById(instructorId);
    if (!instructor) return null;
    
    // Get all course IDs for this creator
    const courseIds = instructor.courses || [];
    
    // Calculate aggregate stats
    let totalStudents = 0;
    courseIds.forEach(cid => {
      const course = getCourseById(cid);
      if (course) totalStudents += course.students;
    });
    
    // Create a creator community that aggregates all their courses
    return {
      id: `creator-${instructorId}`,
      type: 'creator', // Identifies this as a creator follow
      name: instructor.name, // Creator name for the tab
      instructorId: instructorId,
      instructorName: instructor.name,
      courseIds: courseIds, // All course IDs for filtering posts
      description: instructor.bio,
      members: Math.floor(totalStudents * 0.8),
      posts: Math.floor(totalStudents * 0.24),
      avatar: instructor.avatar
    };
  };

  // Helper function to check if a course is followed (individually or via creator)
  const isCourseFollowed = (courseId) => {
    // Check if this specific course is followed
    const courseSpecificId = `course-${courseId}`;
    if (followedCommunities.some(c => c.id === courseSpecificId)) return true;
    
    // Also check if the creator of this course is followed
    const course = getCourseById(courseId);
    if (course) {
      const creatorId = `creator-${course.instructorId}`;
      if (followedCommunities.some(c => c.id === creatorId)) return true;
    }
    
    return false;
  };

  // Helper to check if course is followed via creator (not individually)
  const isCourseFollowedViaCreator = (courseId) => {
    const course = getCourseById(courseId);
    if (!course) return false;
    
    const courseSpecificId = `course-${courseId}`;
    const isIndividuallyFollowed = followedCommunities.some(c => c.id === courseSpecificId);
    if (isIndividuallyFollowed) return false;
    
    const creatorId = `creator-${course.instructorId}`;
    return followedCommunities.some(c => c.id === creatorId);
  };

  // Helper function to check if a creator is followed (all courses)
  const isInstructorFollowed = (instructorId) => {
    const creatorId = `creator-${instructorId}`;
    return followedCommunities.some(c => c.id === creatorId);
  };

  // Helper function to check if ANY course from a creator is followed (individually or via creator)
  const hasAnyCreatorCourseFollowed = (instructorId) => {
    // Check if creator is fully followed
    const creatorId = `creator-${instructorId}`;
    if (followedCommunities.some(c => c.id === creatorId)) return true;
    
    // Check if any individual course from this creator is followed
    const creatorData = getInstructorWithCourses(instructorId);
    if (creatorData && creatorData.courses) {
      for (const course of creatorData.courses) {
        const courseSpecificId = `course-${course.id}`;
        if (followedCommunities.some(c => c.id === courseSpecificId)) return true;
      }
    }
    return false;
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

      // Get instructor data
      const instructor = getInstructorById(instructorId);
      if (!instructor) {
        console.error('Instructor not found:', instructorId);
        return;
      }

      const creatorCommunityId = `creator-${instructorId}`;
      const isAlreadyFollowed = followedCommunities.some(c => c.id === creatorCommunityId);
      
      if (isAlreadyFollowed) {
        // Unfollow - remove the creator community
        setFollowedCommunities(prev => prev.filter(c => c.id !== creatorCommunityId));
      } else {
        // Follow - add creator community (single tab for all creator's courses)
        const creatorCommunity = getCreatorCommunity(instructorId);
        if (creatorCommunity) {
          // Get the creator's course IDs to remove individual course follows
          const creatorCourseIds = instructor.courses || [];
          
          setFollowedCommunities(prev => {
            // Check if already exists
            if (prev.some(c => c.id === creatorCommunity.id)) return prev;
            
            // Remove any individual course follows that belong to this creator
            // since they're now included in the creator follow
            const filteredPrev = prev.filter(c => {
              // Keep if it's not a course follow
              if (c.type !== 'course') return true;
              // Keep if the course doesn't belong to this creator
              return !creatorCourseIds.includes(c.courseId);
            });
            
            return [...filteredPrev, creatorCommunity];
          });
        }
      }
    } catch (error) {
      console.error('Error in handleFollowInstructor:', error);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  // Follow/unfollow a SINGLE course (individual course follow)
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

      // Get the course-specific community for this single course
      const courseCommunity = getCourseSpecificCommunity(courseId);
      if (!courseCommunity) {
        console.error('Could not create community for courseId:', courseId);
        return;
      }

      // Check if this SPECIFIC course is followed (not via creator)
      const courseSpecificId = `course-${courseId}`;
      const isIndividuallyFollowed = followedCommunities.some(c => c.id === courseSpecificId);
      
      // Check if the creator of this course is followed
      const creatorId = `creator-${course.instructorId}`;
      const creatorCommunity = followedCommunities.find(c => c.id === creatorId);
      const isCreatorFollowed = !!creatorCommunity;
      
      setFollowedCommunities(prev => {
        if (isIndividuallyFollowed) {
          // Unfollow: remove just this course community
          return prev.filter(c => c.id !== courseCommunity.id);
        } else if (isCreatorFollowed) {
          // Course is followed via creator - unfollow this specific course
          // Remove the creator follow and add individual follows for OTHER courses
          const instructor = getInstructorById(course.instructorId);
          if (!instructor) return prev;
          
          const otherCourseIds = (instructor.courses || []).filter(cid => cid !== courseId);
          
          // Remove creator follow
          let newList = prev.filter(c => c.id !== creatorId);
          
          // Add individual follows for the other courses
          otherCourseIds.forEach(cid => {
            const otherCourseCommunity = getCourseSpecificCommunity(cid);
            if (otherCourseCommunity && !newList.some(c => c.id === otherCourseCommunity.id)) {
              newList.push(otherCourseCommunity);
            }
          });
          
          return newList;
        } else {
          // Follow: add just this course community (avoid duplicates)
          const existingIds = new Set(prev.map(c => c.id));
          if (existingIds.has(courseCommunity.id)) {
            return prev; // Already exists
          }
          return [...prev, courseCommunity];
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
          <div style={{ padding: '24px 32px 0 32px', textAlign: 'center', position: 'relative' }}>
            {/* Follow button positioned top right */}
            <button 
              onClick={() => handleFollowCourse(courseData.id)}
              disabled={isFollowingLoading}
              style={{ 
                position: 'absolute',
                top: 24,
                right: 32,
                background: isCourseFollowed(courseData.id) ? '#e2e8f0' : '#1d9bf0', 
                color: isCourseFollowed(courseData.id) ? '#64748b' : '#fff', 
                fontWeight: 600, 
                fontSize: 14, 
                cursor: 'pointer', 
                padding: '10px 20px', 
                borderRadius: 8, 
                border: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6 
              }}
            >
              {isCourseFollowed(courseData.id) ? '✓ Following' : 'Follow'}
            </button>
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
              <li style={{ marginBottom: 2 }}>Earn: 70% commission when you become a Student-Teacher (e.g., earn $350 per $500 course you teach)</li>
              <li style={{ marginBottom: 2 }}>1-on-1 Sessions: Learn directly from the Creator or certified Student-Teachers via live video</li>
              <li style={{ marginBottom: 2 }}>Certify: Get certified, then teach others and earn while sharing your knowledge</li>
              <li style={{ marginBottom: 2 }}>Outcomes: Proven 2x better results through peer tutoring (Bloom's 2 Sigma)</li>
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
            <div style={{ background: '#eff6ff', border: '1px solid #1d9bf0', borderRadius: 8, padding: '12px 16px', marginBottom: 16, textAlign: 'center' }}>
              <div style={{ color: '#0284c7', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                🎓 {studentTeachers} Student-Teachers available to help you learn
              </div>
              <div style={{ color: '#047857', fontSize: 13 }}>
                Book 1-on-1 sessions with the Creator or certified peers
              </div>
            </div>
            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '16px 0 18px 0', flexWrap: 'wrap' }}>
              <button style={{ background: '#1d9bf0', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', padding: '10px 20px', borderRadius: 8, border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                📅 Schedule Session
              </button>
              <button style={{ background: '#1d9bf0', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', padding: '10px 20px', borderRadius: 8, border: 'none' }}>
                Enroll Now - {courseData.price}
              </button>
              <span style={{ color: '#1d9bf0', fontWeight: 500, fontSize: 14, cursor: 'pointer', textDecoration: 'none', padding: '10px 0', background: 'none', border: 'none', lineHeight: '20px' }} onMouseOver={e => e.target.style.textDecoration = 'underline'} onMouseOut={e => e.target.style.textDecoration = 'none'}>Learn about teaching</span>
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
      <div className="creators-feed" style={{ padding: 0, margin: 0 }}>
        {filteredInstructors.map(creator => (
          <div key={creator.id} className="creator-card" onClick={() => {
            const fullCreatorData = getInstructorWithCourses(creator.id);
            setSelectedInstructor(fullCreatorData || creator);
          }} style={{
            background: isDarkMode ? '#16181c' : '#fff',
            borderRadius: 12,
            padding: '20px',
            marginBottom: 16,
            border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            {/* Creator Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <img 
                src={creator.avatar} 
                alt={creator.name}
                style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid #1d9bf0' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 18, color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>{creator.name}</span>
                  <span style={{ background: isDarkMode ? '#1e3a5f' : '#dbeafe', color: isDarkMode ? '#93c5fd' : '#1e40af', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 12 }}>CREATOR</span>
                </div>
                <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 14, marginBottom: 8 }}>{creator.title}</div>
                <div style={{ color: isDarkMode ? '#cbd5e1' : '#475569', fontSize: 14, lineHeight: 1.5, marginBottom: 12 }}>{creator.bio}</div>
                
                {/* Stats Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 13, color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FaUsers style={{ color: '#1d9bf0' }} />
                    <strong style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>{creator.stats?.studentsTaught?.toLocaleString() || 0}</strong> students
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FaStar style={{ color: '#f59e0b' }} />
                    <strong style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>{creator.stats?.averageRating || 0}</strong> rating
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FaBook style={{ color: '#3b82f6' }} />
                    <strong style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>{creator.stats?.coursesCreated || 0}</strong> courses
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 12 }} onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => setSelectedInstructor(getInstructorWithCourses(creator.id))}
                    style={{ 
                      background: '#1d9bf0', 
                      color: '#fff', 
                      border: 'none', 
                      padding: '8px 16px', 
                      borderRadius: 8, 
                      fontWeight: 600, 
                      fontSize: 13, 
                      cursor: 'pointer' 
                    }}
                  >
                    View Profile
                  </button>
                  
                  {/* Follow Button with Dropdown */}
                  <div className="creator-follow-dropdown-wrapper" style={{ position: 'relative' }}>
                    <button 
                      className={`follow-btn ${hasAnyCreatorCourseFollowed(creator.id) ? 'following' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Always toggle dropdown - let user choose what to follow/unfollow
                        setOpenCreatorFollowDropdown(openCreatorFollowDropdown === creator.id ? null : creator.id);
                      }}
                      disabled={isFollowingLoading}
                      style={{ 
                        background: hasAnyCreatorCourseFollowed(creator.id) ? (isDarkMode ? '#2f3336' : '#e2e8f0') : (isDarkMode ? '#16181c' : '#fff'),
                        color: hasAnyCreatorCourseFollowed(creator.id) ? (isDarkMode ? '#94a3b8' : '#64748b') : '#1d9bf0',
                        border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0', 
                        padding: '8px 16px', 
                        borderRadius: 8, 
                        fontWeight: 600, 
                        fontSize: 13, 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {hasAnyCreatorCourseFollowed(creator.id) ? '✓ Following' : 'Follow'}
                      <span style={{ fontSize: 10, marginLeft: 2 }}>▼</span>
                    </button>
                    
                    {/* Follow Dropdown - Minimalist */}
                    {openCreatorFollowDropdown === creator.id && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: 4,
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        minWidth: 200,
                        maxWidth: 280,
                        padding: '4px 0'
                      }}>
                        {/* Follow/Unfollow All Option */}
                        <button 
                          type="button"
                          style={{ 
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: 13,
                            color: isInstructorFollowed(creator.id) ? '#dc2626' : '#1d9bf0',
                            fontWeight: 500,
                            borderBottom: '1px solid #f1f5f9',
                            background: 'transparent',
                            border: 'none',
                            width: '100%',
                            textAlign: 'left',
                            display: 'block'
                          }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleFollowInstructor(creator.id);
                          setOpenCreatorFollowDropdown(null);
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {isInstructorFollowed(creator.id) ? 'Unfollow All' : 'Follow All'}
                        </button>
                        
                        {/* Individual Courses */}
                        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                          {(() => {
                            const creatorData = getInstructorWithCourses(creator.id);
                            const courses = creatorData?.courses || [];
                            return courses.map(course => {
                              const isFollowed = isCourseFollowed(course.id);
                              return (
                                <div 
                                  key={course.id}
                                  style={{ 
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 8,
                                    fontSize: 13,
                                    color: isFollowed ? '#1d9bf0' : '#475569',
                                    fontWeight: isFollowed ? 500 : 400
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFollowCourse(course.id);
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  <span style={{ 
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}>
                                    {course.title}
                                  </span>
                                  {isFollowed && <span>✓</span>}
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
        <div className="three-column-layout">
          <div className="center-column">
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
                  <span>Creators</span>
                </button>
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search courses, creators..."
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
                          const isFollowed = isCourseFollowed(course.id);
                          const isViaCreator = isCourseFollowedViaCreator(course.id);
                          return (
                            <div key={course.id} className="course-post" onClick={() => setSelectedCourse(course)} style={{ background: '#fff', boxShadow: 'none', padding: '12px 18px', fontFamily: 'system-ui, sans-serif', fontSize: 15, lineHeight: 1.35, width: '100%', marginLeft: 0, marginRight: 0, cursor: 'pointer', color: '#222' }}>
                              <div className="post-content" style={{ padding: 0 }}>
                                {/* Title, Duration, and Follow Button Row */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#222', flex: 1, minWidth: 0 }}>
                                    <span style={{ fontWeight: 700, fontSize: 16, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.title}</span>
                                    <span style={{ color: '#888', fontSize: 13, fontWeight: 500, flexShrink: 0 }}>• {course.duration}</span>
                                  </div>
                                  <button 
                                    onClick={e => { e.stopPropagation(); handleFollowCourse(course.id); }}
                                    disabled={isFollowingLoading}
                                    style={{ 
                                      background: isFollowed ? '#e2e8f0' : '#1d9bf0',
                                      color: isFollowed ? '#64748b' : '#fff',
                                      border: 'none', 
                                      padding: '6px 14px', 
                                      borderRadius: 20, 
                                      fontWeight: 600, 
                                      fontSize: 13, 
                                      cursor: 'pointer',
                                      flexShrink: 0,
                                      marginLeft: 12
                                    }}
                                  >
                                    {isFollowed ? '✓ Following' : 'Follow'}
                                  </button>
                                </div>
                                <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500, margin: '2px 0 6px 0' }}>Created by {instructorData?.name}</div>
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
                <div className="creators-section">
                  {selectedInstructor ? (
                    renderInstructorProfile()
                  ) : (
                    renderInstructorSummary()
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Right Pane */}
          <div className="right-pane">
            <div className="right-pane-section">
              <h3>Trending Topics</h3>
              <div className="trending-item">
                <span className="trending-category">AI & Machine Learning</span>
                <span className="trending-title">#DeepLearning</span>
                <span className="trending-posts">2.4K posts</span>
              </div>
              <div className="trending-item">
                <span className="trending-category">Web Development</span>
                <span className="trending-title">#ReactJS</span>
                <span className="trending-posts">1.8K posts</span>
              </div>
              <div className="trending-item">
                <span className="trending-category">Cloud Computing</span>
                <span className="trending-title">#AWS</span>
                <span className="trending-posts">1.2K posts</span>
              </div>
            </div>
            <div className="right-pane-section">
              <h3>Who to Follow</h3>
              <div className="follow-suggestion">
                <img src="https://via.placeholder.com/40x40/4ECDC4/ffffff?text=JD" alt="Jane Doe" />
                <div className="follow-info">
                  <span className="follow-name">Jane Doe</span>
                  <span className="follow-title">AI Strategist</span>
                </div>
                <button className="follow-btn-small">Follow</button>
              </div>
              <div className="follow-suggestion">
                <img src="https://via.placeholder.com/40x40/FF6B6B/ffffff?text=JW" alt="James Wilson" />
                <div className="follow-info">
                  <span className="follow-name">James Wilson</span>
                  <span className="follow-title">Full-Stack Dev</span>
                </div>
                <button className="follow-btn-small">Follow</button>
              </div>
            </div>
          </div>
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
    // X.com style notifications for PeerLoop interactions
    const notifications = [
      // Likes
      {
        id: 1,
        type: 'like',
        icon: <FaHeart style={{ color: '#e11d48' }} />,
        users: [
          { name: 'Sarah Chen', avatar: 'https://via.placeholder.com/32x32/FF6B6B/ffffff?text=SC' },
          { name: 'Mike Rodriguez', avatar: 'https://via.placeholder.com/32x32/4ECDC4/ffffff?text=MR' },
          { name: 'Emma Wilson', avatar: 'https://via.placeholder.com/32x32/9B59B6/ffffff?text=EW' }
        ],
        content: 'liked your post',
        postPreview: '"Just completed my Student-Teacher certification in Node.js! Ready to help others learn 🚀"',
        timestamp: '2m',
        unread: true
      },
      // Comment/Reply
      {
        id: 2,
        type: 'reply',
        icon: <FaComment style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'Alex Thompson', avatar: 'https://via.placeholder.com/32x32/00D2FF/ffffff?text=AT' }
        ],
        content: 'replied to your post',
        postPreview: '"Congrats! I just enrolled in your course. Looking forward to our first session!"',
        timestamp: '15m',
        unread: true
      },
      // Mention
      {
        id: 3,
        type: 'mention',
        icon: <FaAt style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'Jane Doe', avatar: 'https://via.placeholder.com/32x32/FF6B6B/ffffff?text=JD' }
        ],
        content: 'mentioned you in a post',
        postPreview: '"Shoutout to @alexstudent for being an amazing Student-Teacher! Best 1-on-1 session I\'ve had 🙌"',
        timestamp: '1h',
        unread: true
      },
      // Repost
      {
        id: 4,
        type: 'repost',
        icon: <FaRetweet style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'David Park', avatar: 'https://via.placeholder.com/32x32/FFD93D/000000?text=DP' },
          { name: 'Lisa Wang', avatar: 'https://via.placeholder.com/32x32/6C5CE7/ffffff?text=LW' }
        ],
        content: 'reposted your post',
        postPreview: '"The PeerLoop model is genius - Learn, Teach, Earn. Already made $420 this week teaching!"',
        timestamp: '2h',
        unread: true
      },
      // New Follower
      {
        id: 5,
        type: 'follow',
        icon: <FaUser style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'Marcus Chen', avatar: 'https://via.placeholder.com/32x32/FF9900/ffffff?text=MC' }
        ],
        content: 'followed you',
        postPreview: null,
        timestamp: '3h',
        unread: true
      },
      // Session Booked
      {
        id: 6,
        type: 'session',
        icon: <FaCalendar style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'Rachel Green', avatar: 'https://via.placeholder.com/32x32/00B894/ffffff?text=RG' }
        ],
        content: 'booked a session with you',
        postPreview: 'Node.js Backend Development • Tomorrow at 2:00 PM',
        timestamp: '4h',
        unread: false
      },
      // Course Enrollment
      {
        id: 7,
        type: 'enrollment',
        icon: <FaGraduationCap style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'Tom Bradley', avatar: 'https://via.placeholder.com/32x32/74B9FF/ffffff?text=TB' },
          { name: 'Amy Foster', avatar: 'https://via.placeholder.com/32x32/FF7675/ffffff?text=AF' },
          { name: 'Chris Lee', avatar: 'https://via.placeholder.com/32x32/636e72/ffffff?text=CL' }
        ],
        content: 'enrolled in your course',
        postPreview: 'AI for Product Managers',
        timestamp: '6h',
        unread: false
      },
      // Certification Achievement
      {
        id: 8,
        type: 'achievement',
        icon: <FaStar style={{ color: '#fbbf24' }} />,
        users: [],
        content: 'Congratulations! You\'ve been certified as a Student-Teacher',
        postPreview: 'Cloud Architecture with AWS • You can now teach and earn 70% commission',
        timestamp: '1d',
        unread: false
      },
      // Earnings Notification
      {
        id: 9,
        type: 'earnings',
        icon: <FaDollarSign style={{ color: '#1d9bf0' }} />,
        users: [],
        content: 'You earned $245 this week',
        postPreview: '7 sessions completed • 70% of $350 total tuition',
        timestamp: '1d',
        unread: false
      },
      // Creator Announcement
      {
        id: 10,
        type: 'announcement',
        icon: <FaBullhorn style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'Albert Einstein', avatar: 'https://via.placeholder.com/32x32/4ECDC4/ffffff?text=AE' }
        ],
        content: 'posted an announcement in Node.js Backend Development',
        postPreview: '"New module added: Advanced Authentication with JWT! Check it out 🔐"',
        timestamp: '2d',
        unread: false
      },
      // Multiple Likes
      {
        id: 11,
        type: 'like',
        icon: <FaHeart style={{ color: '#e11d48' }} />,
        users: [
          { name: 'Jordan Smith', avatar: 'https://via.placeholder.com/32x32/e17055/ffffff?text=JS' },
          { name: 'Taylor Brown', avatar: 'https://via.placeholder.com/32x32/fdcb6e/000000?text=TB' }
        ],
        content: 'and 12 others liked your post',
        postPreview: '"Week 3 of teaching on PeerLoop: 15 students taught, $1,050 earned. This platform is changing education! 📚"',
        timestamp: '2d',
        unread: false
      },
      // Comment on your comment
      {
        id: 12,
        type: 'reply',
        icon: <FaComment style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'Nina Patel', avatar: 'https://via.placeholder.com/32x32/0984e3/ffffff?text=NP' }
        ],
        content: 'replied to your comment',
        postPreview: '"Thanks for the tip! The 2 Sigma explanation really helped me understand the PeerLoop model."',
        timestamp: '3d',
        unread: false
      },
      // Session Reminder
      {
        id: 13,
        type: 'reminder',
        icon: <FaClock style={{ color: '#f59e0b' }} />,
        users: [],
        content: 'Reminder: You have a session starting in 30 minutes',
        postPreview: 'Deep Learning Fundamentals with Jane Doe • 2:00 PM',
        timestamp: '3d',
        unread: false
      },
      // Payout Processed
      {
        id: 14,
        type: 'payout',
        icon: <FaCheckCircle style={{ color: '#1d9bf0' }} />,
        users: [],
        content: 'Your weekly payout has been processed',
        postPreview: '$682.50 deposited to your bank account',
        timestamp: '5d',
        unread: false
      }
    ];

    // Dark mode colors for notifications - X.com pure black
    const notifBg = isDarkMode ? '#000000' : '#fff';
    const notifBgHover = isDarkMode ? '#16181c' : '#f8fafc';
    const notifHeaderBg = isDarkMode ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)';
    const notifBorder = isDarkMode ? '#334155' : '#e2e8f0';
    const notifTextPrimary = isDarkMode ? '#f1f5f9' : '#0f1419';
    const notifTextSecondary = isDarkMode ? '#94a3b8' : '#536471';

    return (
      <div className="main-content">
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          background: notifHeaderBg, 
          backdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: `1px solid ${notifBorder}`,
          padding: '16px 20px',
          zIndex: 100
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: notifTextPrimary, margin: 0 }}>Notifications</h1>
        </div>
        
        {/* Notification Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: `1px solid ${notifBorder}`,
          background: notifBg
        }}>
          <button style={{ 
            flex: 1, 
            padding: '16px', 
            background: 'none', 
            border: 'none', 
            fontWeight: 600, 
            color: notifTextPrimary,
            borderBottom: '2px solid #1d9bf0',
            cursor: 'pointer'
          }}>All</button>
          <button style={{ 
            flex: 1, 
            padding: '16px', 
            background: 'none', 
            border: 'none', 
            fontWeight: 500, 
            color: notifTextSecondary,
            cursor: 'pointer'
          }}>Mentions</button>
          <button style={{ 
            flex: 1, 
            padding: '16px', 
            background: 'none', 
            border: 'none', 
            fontWeight: 500, 
            color: notifTextSecondary,
            cursor: 'pointer'
          }}>Sessions</button>
          <button style={{ 
            flex: 1, 
            padding: '16px', 
            background: 'none', 
            border: 'none', 
            fontWeight: 500, 
            color: notifTextSecondary,
            cursor: 'pointer'
          }}>Earnings</button>
        </div>

        {/* Notifications List */}
        <div style={{ background: notifBg }}>
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              style={{ 
                display: 'flex',
                padding: '16px 20px',
                borderBottom: `1px solid ${notifBorder}`,
                background: notifBg,
                cursor: 'pointer',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = notifBgHover}
              onMouseLeave={(e) => e.currentTarget.style.background = notifBg}
            >
              {/* Icon */}
              <div style={{ 
                width: 40, 
                display: 'flex', 
                justifyContent: 'center',
                paddingTop: 4,
                fontSize: 18
              }}>
                {notification.icon}
              </div>
              
              {/* Content */}
              <div style={{ flex: 1, marginLeft: 12 }}>
                {/* User Avatars - Using colored circles with initials instead of images */}
                {notification.users.length > 0 && (
                  <div style={{ display: 'flex', marginBottom: 8, height: 32 }}>
                    {notification.users.slice(0, 3).map((user, idx) => {
                      const colors = ['#FF6B6B', '#4ECDC4', '#9B59B6', '#00D2FF', '#FFD93D', '#6C5CE7', '#FF9900'];
                      const colorIndex = user.name.charCodeAt(0) % colors.length;
                      const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2);
                      return (
                        <div 
                          key={idx}
                          style={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%',
                            marginLeft: idx > 0 ? -8 : 0,
                            border: '2px solid #fff',
                            background: colors[colorIndex],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0
                          }}
                          title={user.name}
                        >
                          {initials}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Notification Text */}
                <div style={{ fontSize: 15, color: notifTextPrimary, lineHeight: 1.4 }}>
                  {notification.users.length > 0 && (
                    <span style={{ fontWeight: 700 }}>
                      {notification.users.length === 1 
                        ? notification.users[0].name 
                        : notification.users.length === 2
                          ? `${notification.users[0].name} and ${notification.users[1].name}`
                          : `${notification.users[0].name}, ${notification.users[1].name}`}
                    </span>
                  )}
                  {' '}{notification.content}
                </div>
                
                {/* Post Preview */}
                {notification.postPreview && (
                  <div style={{ 
                    marginTop: 8, 
                    color: notifTextSecondary, 
                    fontSize: 14,
                    lineHeight: 1.4
                  }}>
                    {notification.postPreview}
                  </div>
                )}
              </div>
              
              {/* Timestamp & Unread Dot */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontSize: 13, color: notifTextSecondary }}>{notification.timestamp}</span>
                {notification.unread && (
                  <div style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    background: '#1d9bf0',
                    marginTop: 6
                  }} />
                )}
              </div>
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