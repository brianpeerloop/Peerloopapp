import React, { useState, useEffect } from 'react';
import './Community.css';
import { FaUsers, FaStar, FaClock, FaPlay, FaBook, FaGraduationCap, FaHome, FaCompass, FaChevronDown, FaSearch, FaHeart, FaComment } from 'react-icons/fa';
import { getAllCourses, getInstructorById, getCourseById } from '../data/database';

const Community = ({ followedCommunities = [], setFollowedCommunities = null }) => {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  
  // Use internal state if props are not provided (for backward compatibility)
  const [internalFollowedCommunities, setInternalFollowedCommunities] = useState(() => {
    // Load existing follow states from localStorage
    try {
      const stored = localStorage.getItem('followedCommunities');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing followedCommunities from localStorage:', error);
      return [];
    }
  });

  // Use props if provided, otherwise use internal state
  const actualFollowedCommunities = followedCommunities.length > 0 ? followedCommunities : internalFollowedCommunities;
  const actualSetFollowedCommunities = setFollowedCommunities || setInternalFollowedCommunities;

  // Dynamically generate availableCommunities from all courses
  const allCourses = getAllCourses();
  const availableCommunities = allCourses.map(course => {
    const instructor = getInstructorById(course.instructorId);
    if (!instructor) return null;
    
    // Generate community data dynamically based on course and instructor
    const communityColors = [
      '#4ECDC4', '#00D2FF', '#FF9900', '#FF6B6B', '#9B59B6', 
      '#FFD93D', '#00B894', '#6C5CE7', '#FF7675', '#74B9FF',
      '#636e72', '#0984e3', '#e17055', '#fdcb6e'
    ];
    
    const colorIndex = (course.id - 1) % communityColors.length;
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
      id: course.id, // Use course ID as community ID
      name: `${course.title} Community`,
      topic: course.category,
      members: members,
      posts: posts,
      lastActivity: lastActivity,
      instructor: instructor.name,
      instructorAvatar: instructorAvatar,
      topicImage: topicImage,
      description: course.description,
      courseId: course.id,
      isCourseSpecific: true
    };
  }).filter(Boolean); // Remove any null entries

  // Mock data for fake posts from each community
  const fakePosts = [
    // AI for Product Managers Course Posts
    {
      id: 1,
      communityId: 1,
      author: 'CloudEnthusiast39',
      authorAvatar: 'https://via.placeholder.com/40x40/4ECDC4/ffffff?text=CE',
      authorHandle: '@CloudEnthusiast39',
      content: 'Giving a session in AI for Product Managers course. Student grasped roadmaps quickly—earned commission and boosted my rep. @PeerLoop\'s ecosystem is thriving!',
      timestamp: '2 hours ago',
      likes: 1000,
      replies: 42,
      community: 'AI for Product Managers',
      communityColor: '#4ECDC4',
      courseId: 1
    },
    {
      id: 2,
      communityId: 1,
      author: 'CodeWizard87',
      authorAvatar: 'https://via.placeholder.com/40x40/4ECDC4/ffffff?text=CW',
      authorHandle: '@CodeWizard87',
      content: 'Enrolled in Deep Learning Fundamentals on @PeerLoop —week 2 and the peer sessions are game-changing! My teacher just aced explaining neural nets. Eyeing that Teaching Certificate next. #AIJourney',
      timestamp: '1 day ago',
      likes: 950,
      replies: 35,
      community: 'AI for Product Managers',
      communityColor: '#4ECDC4',
      courseId: 1
    },

    // Node.js Backend Development Course Posts
    {
      id: 3,
      communityId: 2,
      author: 'LearnerBee23',
      authorAvatar: 'https://via.placeholder.com/40x40/00D2FF/ffffff?text=LB',
      authorHandle: '@LearnerBee23',
      content: 'Teaching my first student in Node.js Backend Development via @PeerLoop. Earned back $200 already—love how it reinforces my own skills. The flywheel works wonders!',
      timestamp: '3 hours ago',
      likes: 1100,
      replies: 40,
      community: 'Node.js Backend Development',
      communityColor: '#00D2FF',
      courseId: 2
    },

    // Cloud Architecture with AWS Course Posts
    {
      id: 4,
      communityId: 3,
      author: 'TechInnovator56',
      authorAvatar: 'https://via.placeholder.com/40x40/FF9900/ffffff?text=TI',
      authorHandle: '@TechInnovator56',
      content: 'Commenting on Cloud Architecture with AWS course: Serverless setups clicked thanks to peer guidance. Earned Learning Cert and joined a gated group for AWS pros. @PeerLoop nailed it!',
      timestamp: '2 days ago',
      likes: 800,
      replies: 28,
      community: 'Cloud Architecture with AWS',
      communityColor: '#FF9900',
      courseId: 3
    },

    // Computer Vision with Python Course Posts
    {
      id: 5,
      communityId: 4,
      courseId: 4,
      author: 'SkepticalLearner19',
      authorAvatar: 'https://via.placeholder.com/40x40/1d9bf0/ffffff?text=SL',
      authorHandle: '@SkepticalLearner19',
      content: 'Took Computer Vision with Python on @PeerLoop. Good content, but assessments felt too basic for "advanced." Still, recouped 80% by teaching one—worth it for the cert. 6/10',
      timestamp: '1 day ago',
      likes: 180,
      replies: 22,
      community: 'Computer Vision with Python',
      communityColor: '#1d9bf0'
    },
    {
      id: 6,
      communityId: 4,
      courseId: 4,
      author: 'VisionCoder25',
      authorAvatar: 'https://via.placeholder.com/40x40/1d9bf0/ffffff?text=VC',
      authorHandle: '@VisionCoder25',
      content: 'Enrolled in Computer Vision with Python—week 4 and detecting objects like magic. Gated community for CV pros is inspiring. Eager for Teaching Cert!',
      timestamp: '2 hours ago',
      likes: 800,
      replies: 29,
      community: 'Computer Vision with Python',
      communityColor: '#1d9bf0'
    },

    // Natural Language Processing Course Posts
    {
      id: 7,
      communityId: 5,
      courseId: 5,
      author: 'AIMastermind34',
      authorAvatar: 'https://via.placeholder.com/40x40/17bf63/ffffff?text=AM',
      authorHandle: '@AIMastermind34',
      content: 'Just completed Natural Language Processing course on @PeerLoop. Built a chatbot in the capstone—peer teacher was spot-on. Unlocked teaching option; excited to earn while mentoring!',
      timestamp: '3 days ago',
      likes: 1000,
      replies: 38,
      community: 'Natural Language Processing',
      communityColor: '#17bf63'
    },
    {
      id: 8,
      communityId: 5,
      courseId: 5,
      author: 'NLPNewbie48',
      authorAvatar: 'https://via.placeholder.com/40x40/17bf63/ffffff?text=NN',
      authorHandle: '@NLPNewbie48',
      content: 'Commenting on Natural Language Processing: Chatbot project was fun, peer teacher clarified everything. Minor gripe: more examples needed. Still, @PeerLoop delivers value. 8/10',
      timestamp: '3 days ago',
      likes: 220,
      replies: 20,
      community: 'Natural Language Processing',
      communityColor: '#17bf63'
    },

    // Data Science Fundamentals Course Posts
    {
      id: 9,
      communityId: 6,
      courseId: 6,
      author: 'DataCruncher72',
      authorAvatar: 'https://via.placeholder.com/40x40/794BC4/ffffff?text=DC',
      authorHandle: '@DataCruncher72',
      content: 'Giving sessions in Data Science Fundamentals via @PeerLoop. Students love the real-world examples. My earnings dashboard shows $160 from two teaches—addictive! #PeerLearning',
      timestamp: '2 hours ago',
      likes: 900,
      replies: 32,
      community: 'Data Science Fundamentals',
      communityColor: '#794BC4'
    },

    // Full-Stack Web Development Course Posts
    {
      id: 10,
      communityId: 7,
      courseId: 7,
      author: 'WebDevFanatic41',
      authorAvatar: 'https://via.placeholder.com/40x40/FF6B6B/ffffff?text=WD',
      authorHandle: '@WebDevFanatic41',
      content: 'Enrolled in Full-Stack Web Development on @PeerLoop. Halfway through and deploying apps like a pro. The community groups are buzzing with tips. Can\'t recommend enough.',
      timestamp: '1 day ago',
      likes: 750,
      replies: 25,
      community: 'Full-Stack Web Development',
      communityColor: '#FF6B6B'
    },

    // DevOps & CI/CD Mastery Course Posts
    {
      id: 11,
      communityId: 8,
      courseId: 8,
      author: 'CriticCoder77',
      authorAvatar: 'https://via.placeholder.com/40x40/4A90E2/ffffff?text=CC',
      authorHandle: '@CriticCoder77',
      content: 'DevOps & CI/CD Mastery course on @PeerLoop has solid material, but gated communities need more moderation—too many off-topic posts. Teaching payout is great though. 7/10',
      timestamp: '2 days ago',
      likes: 160,
      replies: 18,
      community: 'DevOps & CI/CD Mastery',
      communityColor: '#4A90E2'
    },

    // AI for Robotics Coding Lab Course Posts
    {
      id: 12,
      communityId: 9,
      courseId: 9,
      author: 'RoboticsGeek29',
      authorAvatar: 'https://via.placeholder.com/40x40/50C878/ffffff?text=RG',
      authorHandle: '@RoboticsGeek29',
      content: 'Teaching in AI for Robotics Coding Lab on @PeerLoop. Guided a peer through path planning—earned $320 and deepened my expertise. The protégé effect is real!',
      timestamp: '3 hours ago',
      likes: 850,
      replies: 30,
      community: 'AI for Robotics Coding Lab',
      communityColor: '#50C878'
    },

    // AI for Medical Diagnostics Coding Course Posts
    {
      id: 13,
      communityId: 10,
      author: 'MedTechInnovator15',
      authorAvatar: 'https://via.placeholder.com/40x40/E74C3C/ffffff?text=MI',
      authorHandle: '@MedTechInnovator15',
      content: 'Commenting on AI for Medical Diagnostics Coding: Peer-led labs made diagnostics models intuitive. Earned certs and joined a collab group for health AI projects. @PeerLoop rocks!',
      timestamp: '4 days ago',
      likes: 1200,
      replies: 45,
      community: 'AI for Medical Diagnostics Coding',
      communityColor: '#E74C3C'
    },

    // AI Coding Bootcamp: Python Projects Course Posts
    {
      id: 14,
      communityId: 11,
      author: 'PythonPro88',
      authorAvatar: 'https://via.placeholder.com/40x40/FFD93D/ffffff?text=PP',
      authorHandle: '@PythonPro88',
      content: 'Taking AI Coding Bootcamp: Python Projects on @PeerLoop. Built my first ML model—teacher\'s feedback was gold. Planning to teach soon for that 80% recoup.',
      timestamp: '2 hours ago',
      likes: 700,
      replies: 24,
      community: 'AI Coding Bootcamp: Python Projects',
      communityColor: '#FFD93D'
    },

    // Microservices Architecture Course Posts
    {
      id: 15,
      communityId: 12,
      author: 'SlightDoubter64',
      authorAvatar: 'https://via.placeholder.com/40x40/9B59B6/ffffff?text=SD',
      authorHandle: '@SlightDoubter64',
      content: 'Microservices Architecture course via @PeerLoop is informative, but lacks depth on scaling issues. Recouped fee by teaching one, certs are verifiable. Okay overall, 5/10.',
      timestamp: '1 day ago',
      likes: 140,
      replies: 15,
      community: 'Microservices Architecture',
      communityColor: '#9B59B6'
    },

    // Business Intelligence & Analytics Course Posts
    {
      id: 16,
      communityId: 13,
      author: 'ProdMgrHustler52',
      authorAvatar: 'https://via.placeholder.com/40x40/3498DB/ffffff?text=PM',
      authorHandle: '@ProdMgrHustler52',
      content: 'Finished Business Intelligence & Analytics on @PeerLoop. Dashboards now second nature—peer sessions beat solo learning. Unlocked teaching; aiming for net profit!',
      timestamp: '3 hours ago',
      likes: 950,
      replies: 36,
      community: 'Business Intelligence & Analytics',
      communityColor: '#3498DB'
    }
  ];

  // Save followed communities to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('followedCommunities', JSON.stringify(actualFollowedCommunities));
    } catch (error) {
      console.error('Error saving followedCommunities to localStorage:', error);
      // Fallback: try to save a minimal version
      try {
        localStorage.setItem('followedCommunities', JSON.stringify([]));
      } catch (fallbackError) {
        console.error('Error saving fallback followedCommunities to localStorage:', fallbackError);
      }
    }
  }, [actualFollowedCommunities]);

  const handleCommunityClick = (community) => {
    setSelectedCommunity(community);
  };

  const handleBackToCommunities = () => {
    setSelectedCommunity(null);
  };

  const handleHomeDropdownToggle = () => {
    // If we're not on Home tab, switch to Home and close dropdown
    if (activeTab !== 'Home') {
      setActiveTab('Home');
      setIsHomeDropdownOpen(false);
    } else {
      // If we're already on Home tab, toggle the dropdown
      setIsHomeDropdownOpen(!isHomeDropdownOpen);
    }
  };

  const handleCommunitySelect = (community) => {
    setSelectedCommunity(community);
    setIsHomeDropdownOpen(false);
  };

  const handleFollowCommunity = (communityId) => {
    if (isFollowingLoading) return; // Prevent rapid clicking
    
    try {
      setIsFollowingLoading(true);
      
      // Validate communityId
      if (!communityId || typeof communityId !== 'number') {
        console.error('Invalid communityId:', communityId);
        return;
      }

      const community = availableCommunities.find(c => c.id === communityId);
      if (!community) {
        console.error('Community not found:', communityId);
        return;
      }

      const isAlreadyFollowed = actualFollowedCommunities.some(c => c.id === communityId);
      
      if (isAlreadyFollowed) {
        // Unfollow
        actualSetFollowedCommunities(prev => prev.filter(c => c.id !== communityId));
      } else {
        // Follow
        actualSetFollowedCommunities(prev => [...prev, community]);
      }
    } catch (error) {
      console.error('Error in handleFollowCommunity:', error);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const isCommunityFollowed = (communityId) => {
    return actualFollowedCommunities.some(c => c.id === communityId);
  };

  // Filter communities based on search query
  const filteredCommunities = availableCommunities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter posts based on followed communities - memoized for performance
  const followedPosts = React.useMemo(() => {
    const filteredPosts = fakePosts.filter(post => {
      // Check if any followed community matches this post
      const matches = actualFollowedCommunities.some(community => {
        // For course-specific communities, check if the courseId matches
        if (community.isCourseSpecific && community.courseId) {
          return post.courseId === community.courseId;
        }
        // For regular communities, check if the communityId matches
        return community.id === post.communityId;
      });
      
      return matches;
    }).sort((a, b) => {
      // Sort by timestamp (most recent first)
      const timeA = a.timestamp.includes('hour') ? parseInt(a.timestamp) : 
                    a.timestamp.includes('minute') ? 0.1 : 24;
      const timeB = b.timestamp.includes('hour') ? parseInt(b.timestamp) : 
                    b.timestamp.includes('minute') ? 0.1 : 24;
      return timeA - timeB;
    });
    
    return filteredPosts;
  }, [actualFollowedCommunities]);

  if (selectedCommunity) {
    return (
      <div className="community">
        <div className="community-header">
          <button className="back-btn" onClick={handleBackToCommunities}>
            <FaBook />
            <span>Back to Communities</span>
          </button>
        </div>
        
        <div className="community-content">
          <div className="community-hero">
            <div className="community-hero-image">
              <img 
                src={selectedCommunity.topicImage} 
                alt={selectedCommunity.topic || 'Community'} 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x200/cccccc/666666?text=Image+Not+Found';
                }}
              />
            </div>
            
            <div className="community-hero-info">
              <h1>{selectedCommunity.name}</h1>
              <p className="community-subtitle">{selectedCommunity.description}</p>
              
              <div className="community-hero-stats">
                <div className="stat-item">
                  <FaUsers />
                  <span>{selectedCommunity.members.toLocaleString()} members</span>
                </div>
                <div className="stat-item">
                  <FaBook />
                  <span>{selectedCommunity.posts} posts</span>
                </div>
                <div className="stat-item">
                  <FaClock />
                  <span>Last active {selectedCommunity.lastActivity}</span>
                </div>
              </div>

              <div className="community-hero-instructor">
                <img src={selectedCommunity.instructorAvatar} alt={selectedCommunity.instructor} />
                <div className="instructor-info">
                  <span className="instructor-name">{selectedCommunity.instructor}</span>
                  <div className="topic-info">
                    <FaGraduationCap />
                    <span>{selectedCommunity.topic}</span>
                  </div>
                </div>
              </div>

              <div className="community-hero-actions">
                <button className="join-community-btn">Join Discussion</button>
                <button className="view-topic-btn">View Topic</button>
              </div>
            </div>
          </div>

          <div className="community-sections">
            <div className="community-section">
              <h2>Recent Discussions</h2>
              <div className="discussions-list">
                <div className="discussion-item">
                  <div className="discussion-header">
                    <h3>Best practices for React hooks</h3>
                    <span className="discussion-time">2 hours ago</span>
                  </div>
                  <p>What are your favorite patterns for organizing custom hooks?</p>
                  <div className="discussion-meta">
                    <span>By @react_dev</span>
                    <span>• 12 replies</span>
                    <span>• 45 likes</span>
                  </div>
                </div>
                
                <div className="discussion-item">
                  <div className="discussion-header">
                    <h3>State management solutions</h3>
                    <span className="discussion-time">4 hours ago</span>
                  </div>
                  <p>Redux vs Context API vs Zustand - what's your preference?</p>
                  <div className="discussion-meta">
                    <span>By @state_master</span>
                    <span>• 8 replies</span>
                    <span>• 23 likes</span>
                  </div>
                </div>
                
                <div className="discussion-item">
                  <div className="discussion-header">
                    <h3>Performance optimization tips</h3>
                    <span className="discussion-time">6 hours ago</span>
                  </div>
                  <p>Share your favorite React performance optimization techniques</p>
                  <div className="discussion-meta">
                    <span>By @perf_guru</span>
                    <span>• 15 replies</span>
                    <span>• 67 likes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="community-section">
              <h2>Community Guidelines</h2>
              <div className="guidelines-list">
                <ul>
                  <li>Be respectful and inclusive in all discussions</li>
                  <li>Share knowledge and help others learn</li>
                  <li>Keep discussions relevant to the topic</li>
                  <li>No spam or self-promotion without value</li>
                  <li>Report inappropriate content to moderators</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="community-content-outer">
      <div className="community-content">
        {/* Left: Main Content */}
        <div style={{ flex: 2, minWidth: 0 }}>
          {/* Top Menu Section (moved inside left pane) */}
          <div className="community-top-menu">
            <div className="community-tabs-section">
              <div className="community-tab-container">
                <button
                  className={`community-tab-btn ${activeTab === 'Home' ? 'active' : ''} ${isHomeDropdownOpen ? 'dropdown-open' : ''}`}
                  onClick={handleHomeDropdownToggle}
                  aria-label="Home tab with dropdown"
                  aria-expanded={isHomeDropdownOpen}
                  aria-haspopup="true"
                >
                  <FaHome />
                  <span>Home</span>
                  <FaChevronDown className="dropdown-arrow" />
                </button>
                {isHomeDropdownOpen && (
                  <div className="community-dropdown">
                    {actualFollowedCommunities.map(community => (
                      <div 
                        key={community.id} 
                        className="dropdown-community-item"
                        onClick={() => handleCommunitySelect(community)}
                      >
                        <div className="dropdown-community-info">
                          <h4>{community.name}</h4>
                          <p>{community.isCourseSpecific ? 'Course Community' : community.topic}</p>
                        </div>
                        <div className="dropdown-community-stats">
                          <span>{community.isCourseSpecific ? 'Course-specific' : `${community.members.toLocaleString()} members`}</span>
                        </div>
                      </div>
                    ))}
                    {actualFollowedCommunities.length === 0 && (
                      <div className="dropdown-empty">
                        <p>No communities followed yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                className={`community-tab-btn ${activeTab === 'Explore' ? 'active' : ''}`}
                onClick={() => setActiveTab('Explore')}
              >
                <FaCompass />
                <span>Explore</span>
              </button>
              <div className="community-search-container">
                <FaSearch className="community-search-icon" />
                <input
                  type="text"
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={(e) => {
                    // Basic input sanitization
                    const sanitizedValue = e.target.value.replace(/[<>]/g, '');
                    setSearchQuery(sanitizedValue);
                  }}
                  className="community-search-input"
                  maxLength={100}
                />
              </div>
            </div>
          </div>
          {/* Main Content Below Top Menu */}
          {activeTab === 'Home' && (
            <div className="community-home-content" style={{ padding: 0 }}>
              {actualFollowedCommunities.length > 0 ? (
                <div className="posts-feed">
                  {followedPosts.length > 0 ? (
                    followedPosts.map(post => {
                      const course = getCourseById(post.courseId);
                      const instructor = course ? getInstructorById(course.instructorId) : null;
                      return (
                        <div key={post.id} className="post-card">
                          <div className="post-card-header">
                            <img className="post-card-instructor-avatar" src={post.authorAvatar} alt="" />
                            <div className="post-card-header-main">
                              <div className="post-card-header-top">
                                <span className="post-card-handle">{post.authorHandle}</span>
                                <span className="post-card-timestamp">{post.timestamp}</span>
                              </div>
                            </div>
                          </div>
                          <div className="post-card-content">{post.content}</div>
                          <div className="post-card-actions">
                            <span className="post-card-action"><FaComment /> {post.replies}</span>
                            <span className="post-card-action"><FaHeart /> {post.likes}</span>
                            {course && <span className="post-card-action"><FaStar /> {course.rating}</span>}
                            {course && <span className="post-card-action"><FaUsers /> {course.students}</span>}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <FaBook />
                      </div>
                      <h2>No Posts Yet</h2>
                      <p>Posts from your followed communities will appear here.</p>
                      <p style={{fontSize: '12px', color: '#666'}}>
                        Debug: Followed Communities: {followedCommunities.length}, 
                        Available Posts: {fakePosts.length}, 
                        Filtered Posts: {followedPosts.length}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <FaUsers />
                  </div>
                  <h2>No Communities Followed</h2>
                  <p>Start following communities to see posts from their members here. Explore communities to find ones that interest you.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Explore' && (
            <div className="community-explore-content" style={{ padding: 0 }}>
              <div className="community-header" style={{ padding: 0, marginLeft: 0 }}>
                <h1>Explore Communities</h1>
                <p>Discover new communities and connect with like-minded learners</p>
              </div>
              
              {filteredCommunities.length > 0 ? (
                <div className="communities-grid">
                  {filteredCommunities.map(community => (
                    <div key={community.id} className="community-card">
                      <div className="community-image">
                        <img src={community.topicImage} alt={community.topic} />
                        <div className="community-overlay">
                          <button className="view-btn" onClick={() => handleCommunityClick(community)}>
                            <FaPlay />
                          </button>
                        </div>
                      </div>
                      
                      <div className="community-info">
                        <div className="community-header">
                          <h3>{community.name}</h3>
                          <div className="community-stats">
                            <FaUsers />
                            <span>{community.members.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="instructor-info">
                          <img src={community.instructorAvatar} alt={community.instructor} />
                          <div className="instructor-details">
                            <span className="instructor-name">{community.instructor}</span>
                          </div>
                        </div>
                        
                        <div className="community-description">
                          {community.description}
                        </div>
                        
                        <div className="community-meta">
                          <span><FaBook /> {community.posts} posts</span>
                          <span><FaClock /> {community.lastActivity}</span>
                        </div>
                        
                        <div className="community-footer">
                          <button 
                            className={`follow-btn ${isCommunityFollowed(community.id) ? 'following' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFollowCommunity(community.id);
                            }}
                            disabled={isFollowingLoading}
                          >
                            <FaHeart style={{ marginRight: 4 }} />
                            {isCommunityFollowed(community.id) ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <FaCompass />
                  </div>
                  <h2>No Communities Found</h2>
                  <p>Try adjusting your search terms to find more communities.</p>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Right: Empty Pane */}
        <div style={{ flex: 1, minWidth: 320 }}></div>
      </div>
    </div>
  );
};

export default Community; 