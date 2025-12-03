import React, { useState, useEffect, useRef } from 'react';
import './Community.css';
import { FaUsers, FaStar, FaClock, FaPlay, FaBook, FaGraduationCap, FaHome, FaChevronLeft, FaChevronRight, FaHeart, FaComment, FaRetweet, FaBookmark, FaShare, FaChevronDown } from 'react-icons/fa';
import { getAllCourses, getInstructorById, getCourseById } from '../data/database';

const Community = ({ followedCommunities = [], setFollowedCommunities = null }) => {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [activeTab, setActiveTab] = useState('Home'); // 'Home' or community id
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const tabsContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [openCreatorDropdown, setOpenCreatorDropdown] = useState(null); // Track which creator dropdown is open
  const [selectedCourseFilter, setSelectedCourseFilter] = useState(null); // Filter to specific course within creator
  
  // Use props directly - the parent (MainContent) manages the state and localStorage
  // This ensures consistency between Browse follows and Community display
  const actualFollowedCommunities = followedCommunities;
  const actualSetFollowedCommunities = setFollowedCommunities || (() => {});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openCreatorDropdown && !event.target.closest('.community-tab-wrapper')) {
        setOpenCreatorDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openCreatorDropdown]);

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
  // Course IDs: 1=AI for PM, 2=Node.js, 3=AWS, 4=Deep Learning, 5=Computer Vision, 
  // 6=NLP, 7=Data Science, 8=BI Analytics, 9=Full-Stack, 10=DevOps, 
  // 11=Microservices, 12=Robotics, 13=Medical AI, 14=Python Bootcamp
  const fakePosts = [
    // Course 1: AI for Product Managers (Jane Doe)
    {
      id: 1,
      courseId: 1,
      author: 'ProductPioneer42',
      authorAvatar: 'https://via.placeholder.com/40x40/4ECDC4/ffffff?text=PP',
      authorHandle: '@ProductPioneer42',
      content: 'Just finished AI for Product Managers! Jane Doe\'s teaching style is incredible. Now I can actually talk to engineers about ML without sounding clueless 😂 #PeerLoop',
      timestamp: '2 hours ago',
      likes: 1200,
      replies: 48,
      community: 'AI for Product Managers'
    },
    {
      id: 2,
      courseId: 1,
      author: 'TechPM_Sarah',
      authorAvatar: 'https://via.placeholder.com/40x40/4ECDC4/ffffff?text=TS',
      authorHandle: '@TechPM_Sarah',
      content: 'Became a Student-Teacher for AI for Product Managers today! 🎉 Already have 2 students booked. The 70% commission is amazing. Thank you @JaneDoe!',
      timestamp: '5 hours ago',
      likes: 890,
      replies: 35,
      community: 'AI for Product Managers'
    },

    // Course 2: Node.js Backend Development (Albert Einstein)
    {
      id: 3,
      courseId: 2,
      author: 'BackendBoss99',
      authorAvatar: 'https://via.placeholder.com/40x40/00D2FF/ffffff?text=BB',
      authorHandle: '@BackendBoss99',
      content: 'Node.js Backend Development is 🔥! Built my first REST API in week 2. The 1-on-1 sessions with Student-Teachers make all the difference. #LearnTeachEarn',
      timestamp: '3 hours ago',
      likes: 1100,
      replies: 40,
      community: 'Node.js Backend Development'
    },
    {
      id: 4,
      courseId: 2,
      author: 'CodeNewbie_Mike',
      authorAvatar: 'https://via.placeholder.com/40x40/00D2FF/ffffff?text=CM',
      authorHandle: '@CodeNewbie_Mike',
      content: 'Shoutout to my Student-Teacher @BackendBoss99 for explaining Express middleware! Finally clicked after our session. PeerLoop\'s model is genius.',
      timestamp: '1 day ago',
      likes: 650,
      replies: 22,
      community: 'Node.js Backend Development'
    },

    // Course 3: Cloud Architecture with AWS (Albert Einstein)
    {
      id: 5,
      courseId: 3,
      author: 'CloudMaster_Pro',
      authorAvatar: 'https://via.placeholder.com/40x40/FF9900/ffffff?text=CP',
      authorHandle: '@CloudMaster_Pro',
      content: 'Passed my AWS certification after taking Cloud Architecture with AWS! The serverless module was exactly what I needed. Now teaching others and earning 70%! 💰',
      timestamp: '4 hours ago',
      likes: 980,
      replies: 38,
      community: 'Cloud Architecture with AWS'
    },
    {
      id: 6,
      courseId: 3,
      author: 'DevOpsNewbie',
      authorAvatar: 'https://via.placeholder.com/40x40/FF9900/ffffff?text=DN',
      authorHandle: '@DevOpsNewbie',
      content: 'Week 3 of Cloud Architecture with AWS. Lambda functions finally make sense! Booking my first 1-on-1 with a Student-Teacher tomorrow. Excited!',
      timestamp: '2 days ago',
      likes: 420,
      replies: 15,
      community: 'Cloud Architecture with AWS'
    },

    // Course 4: Deep Learning Fundamentals (Jane Doe)
    {
      id: 7,
      courseId: 4,
      author: 'NeuralNetNinja',
      authorAvatar: 'https://via.placeholder.com/40x40/FF6B6B/ffffff?text=NN',
      authorHandle: '@NeuralNetNinja',
      content: 'Deep Learning Fundamentals changed my career! Built a CNN from scratch in the capstone. The peer teaching model helped me understand backpropagation 10x faster.',
      timestamp: '6 hours ago',
      likes: 1350,
      replies: 52,
      community: 'Deep Learning Fundamentals'
    },
    {
      id: 8,
      courseId: 4,
      author: 'AIStudent_2024',
      authorAvatar: 'https://via.placeholder.com/40x40/FF6B6B/ffffff?text=AS',
      authorHandle: '@AIStudent_2024',
      content: 'Just certified as a Student-Teacher for Deep Learning Fundamentals! Jane Doe approved my application today. Ready to help others while earning. Win-win! 🚀',
      timestamp: '1 day ago',
      likes: 780,
      replies: 28,
      community: 'Deep Learning Fundamentals'
    },

    // Course 5: Computer Vision with Python (Jane Doe)
    {
      id: 9,
      courseId: 5,
      author: 'VisionCoder25',
      authorAvatar: 'https://via.placeholder.com/40x40/9B59B6/ffffff?text=VC',
      authorHandle: '@VisionCoder25',
      content: 'Computer Vision with Python is incredible! Detecting objects in real-time now. The community here is so supportive. Best learning investment ever!',
      timestamp: '2 hours ago',
      likes: 890,
      replies: 32,
      community: 'Computer Vision with Python'
    },
    {
      id: 10,
      courseId: 5,
      author: 'OpenCV_Fan',
      authorAvatar: 'https://via.placeholder.com/40x40/9B59B6/ffffff?text=OF',
      authorHandle: '@OpenCV_Fan',
      content: 'Completed my certification for Computer Vision with Python! Already earned back $210 from 1 teaching session. Bloom\'s 2 Sigma is real! #PeerLoop',
      timestamp: '8 hours ago',
      likes: 720,
      replies: 25,
      community: 'Computer Vision with Python'
    },

    // Course 6: Natural Language Processing (Jane Doe)
    {
      id: 11,
      courseId: 6,
      author: 'NLPMastermind',
      authorAvatar: 'https://via.placeholder.com/40x40/17bf63/ffffff?text=NM',
      authorHandle: '@NLPMastermind',
      content: 'Built a sentiment analysis tool after completing Natural Language Processing! Jane Doe\'s curriculum is perfectly structured. Now I\'m teaching others! 🎓',
      timestamp: '3 hours ago',
      likes: 1050,
      replies: 42,
      community: 'Natural Language Processing'
    },
    {
      id: 12,
      courseId: 6,
      author: 'TextMiner_Pro',
      authorAvatar: 'https://via.placeholder.com/40x40/17bf63/ffffff?text=TM',
      authorHandle: '@TextMiner_Pro',
      content: 'NLP course chatbot project was amazing! My Student-Teacher explained transformers so clearly. Earned my cert and joining the teaching pool next week!',
      timestamp: '1 day ago',
      likes: 680,
      replies: 24,
      community: 'Natural Language Processing'
    },

    // Course 7: Data Science Fundamentals (Prof. Maria Rodriguez)
    {
      id: 13,
      courseId: 7,
      author: 'DataDriven_Dan',
      authorAvatar: 'https://via.placeholder.com/40x40/794BC4/ffffff?text=DD',
      authorHandle: '@DataDriven_Dan',
      content: 'Data Science Fundamentals by Prof. Rodriguez is fantastic! Pandas and matplotlib finally make sense. Scheduled 3 peer sessions this week. #DataScience',
      timestamp: '4 hours ago',
      likes: 920,
      replies: 35,
      community: 'Data Science Fundamentals'
    },
    {
      id: 14,
      courseId: 7,
      author: 'AnalyticsAce',
      authorAvatar: 'https://via.placeholder.com/40x40/794BC4/ffffff?text=AA',
      authorHandle: '@AnalyticsAce',
      content: 'Became a certified Student-Teacher for Data Science Fundamentals! Made $350 in my first week teaching. PeerLoop\'s model is revolutionary! 💪',
      timestamp: '2 days ago',
      likes: 1180,
      replies: 48,
      community: 'Data Science Fundamentals'
    },

    // Course 8: Business Intelligence & Analytics (Prof. Maria Rodriguez)
    {
      id: 15,
      courseId: 8,
      author: 'BIDashboardPro',
      authorAvatar: 'https://via.placeholder.com/40x40/3498DB/ffffff?text=BP',
      authorHandle: '@BIDashboardPro',
      content: 'BI & Analytics course transformed how I present data! Built an executive dashboard that my boss loved. Worth every penny at $450!',
      timestamp: '5 hours ago',
      likes: 850,
      replies: 30,
      community: 'Business Intelligence & Analytics'
    },
    {
      id: 16,
      courseId: 8,
      author: 'TableauNewbie',
      authorAvatar: 'https://via.placeholder.com/40x40/3498DB/ffffff?text=TN',
      authorHandle: '@TableauNewbie',
      content: 'Just enrolled in Business Intelligence & Analytics. Prof. Rodriguez\'s intro video already cleared up so much! Can\'t wait for my first 1-on-1 session!',
      timestamp: '1 day ago',
      likes: 420,
      replies: 18,
      community: 'Business Intelligence & Analytics'
    },

    // Course 9: Full-Stack Web Development (James Wilson)
    {
      id: 17,
      courseId: 9,
      author: 'FullStackFiona',
      authorAvatar: 'https://via.placeholder.com/40x40/E74C3C/ffffff?text=FF',
      authorHandle: '@FullStackFiona',
      content: 'Full-Stack Web Development is the real deal! Deployed my first React + Node app today. James Wilson\'s course structure is perfect for beginners. 🌐',
      timestamp: '3 hours ago',
      likes: 1020,
      replies: 38,
      community: 'Full-Stack Web Development'
    },
    {
      id: 18,
      courseId: 9,
      author: 'WebDev_Journey',
      authorAvatar: 'https://via.placeholder.com/40x40/E74C3C/ffffff?text=WJ',
      authorHandle: '@WebDev_Journey',
      content: 'From zero to full-stack in 8 weeks! Now I\'m a certified Student-Teacher earning while helping others learn. PeerLoop changed my life! #LearnTeachEarn',
      timestamp: '6 hours ago',
      likes: 890,
      replies: 34,
      community: 'Full-Stack Web Development'
    },

    // Course 10: DevOps & CI/CD Mastery (James Wilson)
    {
      id: 19,
      courseId: 10,
      author: 'DevOpsDerek',
      authorAvatar: 'https://via.placeholder.com/40x40/4A90E2/ffffff?text=DD',
      authorHandle: '@DevOpsDerek',
      content: 'DevOps & CI/CD Mastery course is excellent! Set up my first Jenkins pipeline today. The Student-Teacher who helped me was incredibly patient. 🔧',
      timestamp: '4 hours ago',
      likes: 780,
      replies: 28,
      community: 'DevOps & CI/CD Mastery'
    },
    {
      id: 20,
      courseId: 10,
      author: 'Pipeline_Pro',
      authorAvatar: 'https://via.placeholder.com/40x40/4A90E2/ffffff?text=PP',
      authorHandle: '@Pipeline_Pro',
      content: 'Certified and now teaching DevOps & CI/CD Mastery! Already made back my course fee plus $200 extra. The flywheel effect is real! 🚀',
      timestamp: '2 days ago',
      likes: 650,
      replies: 22,
      community: 'DevOps & CI/CD Mastery'
    },

    // Course 11: Microservices Architecture (James Wilson)
    {
      id: 21,
      courseId: 11,
      author: 'MicroservicesMike',
      authorAvatar: 'https://via.placeholder.com/40x40/1ABC9C/ffffff?text=MM',
      authorHandle: '@MicroservicesMike',
      content: 'Microservices Architecture course helped me understand distributed systems finally! Docker + Kubernetes now make sense. Thanks to my amazing Student-Teacher!',
      timestamp: '5 hours ago',
      likes: 720,
      replies: 26,
      community: 'Microservices Architecture'
    },
    {
      id: 22,
      courseId: 11,
      author: 'ContainerKing',
      authorAvatar: 'https://via.placeholder.com/40x40/1ABC9C/ffffff?text=CK',
      authorHandle: '@ContainerKing',
      content: 'Week 4 of Microservices Architecture. Just built my first multi-container app! The community here is so helpful. Aiming for certification next month!',
      timestamp: '1 day ago',
      likes: 520,
      replies: 19,
      community: 'Microservices Architecture'
    },

    // Course 12: AI for Robotics Coding Lab (Dr. Priya Nair)
    {
      id: 23,
      courseId: 12,
      author: 'RoboticsGeek29',
      authorAvatar: 'https://via.placeholder.com/40x40/50C878/ffffff?text=RG',
      authorHandle: '@RoboticsGeek29',
      content: 'AI for Robotics Coding Lab is mind-blowing! Programmed my first path-planning algorithm. Dr. Nair\'s curriculum is cutting-edge! 🤖',
      timestamp: '3 hours ago',
      likes: 980,
      replies: 38,
      community: 'AI for Robotics Coding Lab'
    },
    {
      id: 24,
      courseId: 12,
      author: 'BotBuilder_Pro',
      authorAvatar: 'https://via.placeholder.com/40x40/50C878/ffffff?text=BB',
      authorHandle: '@BotBuilder_Pro',
      content: 'Just became a Student-Teacher for AI for Robotics! Teaching path planning algorithms and earning 70%. The protégé effect is real—I understand it better now! 🎓',
      timestamp: '8 hours ago',
      likes: 750,
      replies: 28,
      community: 'AI for Robotics Coding Lab'
    },

    // Course 13: AI for Medical Diagnostics Coding (Dr. Priya Nair)
    {
      id: 25,
      courseId: 13,
      author: 'MedTechInnovator',
      authorAvatar: 'https://via.placeholder.com/40x40/E74C3C/ffffff?text=MI',
      authorHandle: '@MedTechInnovator',
      content: 'AI for Medical Diagnostics Coding is transforming healthcare! Built a diagnostic model that actually works. Dr. Nair is an incredible teacher! 🏥',
      timestamp: '4 hours ago',
      likes: 1250,
      replies: 52,
      community: 'AI for Medical Diagnostics Coding'
    },
    {
      id: 26,
      courseId: 13,
      author: 'HealthAI_Student',
      authorAvatar: 'https://via.placeholder.com/40x40/E74C3C/ffffff?text=HS',
      authorHandle: '@HealthAI_Student',
      content: 'Completed my certification in AI for Medical Diagnostics! Already have 3 students lined up to teach. Making an impact AND earning income! #PeerLoop',
      timestamp: '1 day ago',
      likes: 920,
      replies: 38,
      community: 'AI for Medical Diagnostics Coding'
    },

    // Course 14: AI Coding Bootcamp: Python Projects (Prof. Elena Petrova)
    {
      id: 27,
      courseId: 14,
      author: 'PythonPro88',
      authorAvatar: 'https://via.placeholder.com/40x40/FFD93D/000000?text=PP',
      authorHandle: '@PythonPro88',
      content: 'AI Coding Bootcamp: Python Projects is exactly what I needed! Built 5 ML projects in 6 weeks. Prof. Petrova\'s teaching style is engaging! 🐍',
      timestamp: '2 hours ago',
      likes: 880,
      replies: 32,
      community: 'AI Coding Bootcamp: Python Projects'
    },
    {
      id: 28,
      courseId: 14,
      author: 'MLBeginner_2024',
      authorAvatar: 'https://via.placeholder.com/40x40/FFD93D/000000?text=MB',
      authorHandle: '@MLBeginner_2024',
      content: 'From Python newbie to AI developer in 8 weeks! Now I\'m teaching the bootcamp and earning 70% per session. Best investment I ever made! 💪',
      timestamp: '6 hours ago',
      likes: 720,
      replies: 26,
      community: 'AI Coding Bootcamp: Python Projects'
    }
  ];

  // Save followed communities to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('followedCommunities', JSON.stringify(actualFollowedCommunities));
    } catch (error) {
      console.error('Error saving followedCommunities to localStorage:', error);
      try {
        localStorage.setItem('followedCommunities', JSON.stringify([]));
      } catch (fallbackError) {
        console.error('Error saving fallback followedCommunities to localStorage:', fallbackError);
      }
    }
  }, [actualFollowedCommunities]);

  // Check scroll arrows visibility
  const checkScrollArrows = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollArrows();
    window.addEventListener('resize', checkScrollArrows);
    return () => window.removeEventListener('resize', checkScrollArrows);
  }, [actualFollowedCommunities]);

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200;
      tabsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollArrows, 300);
    }
  };

  const handleCommunityClick = (community) => {
    setSelectedCommunity(community);
  };

  const handleBackToCommunities = () => {
    setSelectedCommunity(null);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Reset course filter when switching tabs
    if (tabId !== activeTab) {
      setSelectedCourseFilter(null);
      setOpenCreatorDropdown(null);
    }
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

  // Filter posts based on active tab - memoized for performance
  const displayedPosts = React.useMemo(() => {
    let filteredPosts;
    
    if (activeTab === 'Home') {
      // Home tab: Show all posts from followed communities (algorithmic feed)
      filteredPosts = fakePosts.filter(post => {
        return actualFollowedCommunities.some(community => {
          // Use courseIds array (works for both course and creator follows)
          if (community.courseIds && community.courseIds.length > 0) {
            return community.courseIds.includes(post.courseId);
          }
          // Fallback for old format
          if (community.courseId) {
            return post.courseId === community.courseId;
          }
          return false;
        });
      });
    } else {
      // Specific community/creator tab: Filter based on the tab's courseIds
      const activeCommunity = actualFollowedCommunities.find(c => c.id === activeTab);
      if (activeCommunity && activeCommunity.courseIds) {
        // If there's a specific course filter selected (for creator tabs)
        if (selectedCourseFilter && activeCommunity.type === 'creator') {
          // Filter to just the selected course
          filteredPosts = fakePosts.filter(post => post.courseId === selectedCourseFilter);
        } else {
          // Filter posts that match any of the courseIds in this community
          filteredPosts = fakePosts.filter(post => 
            activeCommunity.courseIds.includes(post.courseId)
          );
        }
      } else {
        filteredPosts = [];
      }
    }
    
    // Sort by engagement (likes + replies) and recency for algorithmic feel
    return filteredPosts.sort((a, b) => {
      const engagementA = a.likes + (a.replies * 10);
      const engagementB = b.likes + (b.replies * 10);
      const timeA = a.timestamp.includes('hour') ? parseInt(a.timestamp) : 
                    a.timestamp.includes('minute') ? 0.1 : 
                    a.timestamp.includes('day') ? parseInt(a.timestamp) * 24 : 100;
      const timeB = b.timestamp.includes('hour') ? parseInt(b.timestamp) : 
                    b.timestamp.includes('minute') ? 0.1 : 
                    b.timestamp.includes('day') ? parseInt(b.timestamp) * 24 : 100;
      // Combine engagement and recency (recent + high engagement first)
      return (engagementB / (timeB + 1)) - (engagementA / (timeA + 1));
    });
  }, [activeTab, actualFollowedCommunities, selectedCourseFilter]);

  if (selectedCommunity) {
    // Get posts for this community
    const communityPosts = fakePosts.filter(post => 
      post.courseId === selectedCommunity.courseId || post.communityId === selectedCommunity.id
    );

    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: 0 }}>
        {/* Back Button */}
        <button 
          onClick={handleBackToCommunities}
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
          ← Back to Communities
        </button>

        {/* Community Header Card */}
        <div style={{ background: '#fff', borderRadius: 16, margin: '0 16px 24px 16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {/* Banner */}
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', height: 120 }} />
          
          {/* Content */}
          <div style={{ padding: '0 24px 24px 24px', marginTop: -40 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 16 }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 12, 
                background: '#fff',
                border: '4px solid #fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32
              }}>
                📚
              </div>
              <div style={{ flex: 1, paddingBottom: 8 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{selectedCommunity.name}</h1>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: 14 }}>{selectedCommunity.topic}</p>
              </div>
              <button 
                onClick={() => handleFollowCommunity(selectedCommunity.id)}
                style={{ 
                  background: isCommunityFollowed(selectedCommunity.id) ? '#e2e8f0' : '#3b82f6',
                  color: isCommunityFollowed(selectedCommunity.id) ? '#64748b' : '#fff',
                  border: 'none', 
                  padding: '10px 24px', 
                  borderRadius: 8, 
                  fontWeight: 600, 
                  fontSize: 14, 
                  cursor: 'pointer' 
                }}
              >
                {isCommunityFollowed(selectedCommunity.id) ? '✓ Joined' : 'Join Community'}
              </button>
            </div>

            {/* Description */}
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.6, margin: '0 0 16px 0' }}>
              {selectedCommunity.description}
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, fontSize: 14, color: '#64748b' }}>
              <span><strong style={{ color: '#1e293b' }}>{selectedCommunity.members?.toLocaleString()}</strong> members</span>
              <span><strong style={{ color: '#1e293b' }}>{selectedCommunity.posts}</strong> posts</span>
              <span>Created by <strong style={{ color: '#1e293b' }}>{selectedCommunity.instructor}</strong></span>
            </div>
          </div>
        </div>

        {/* Community Feed */}
        <div style={{ margin: '0 16px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: '0 0 16px 0' }}>Community Posts</h2>
          
          {communityPosts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {communityPosts.map(post => (
                <div key={post.id} style={{ 
                  background: '#fff', 
                  borderRadius: 12, 
                  padding: 20, 
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <img 
                      src={post.authorAvatar} 
                      alt={post.author}
                      style={{ width: 40, height: 40, borderRadius: '50%' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{post.author}</div>
                      <div style={{ color: '#64748b', fontSize: 12 }}>{post.authorHandle} • {post.timestamp}</div>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 12px 0', color: '#334155', fontSize: 15, lineHeight: 1.5 }}>{post.content}</p>
                  <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FaComment /> {post.replies}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FaHeart /> {post.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              background: '#fff', 
              borderRadius: 12, 
              padding: 40, 
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>No posts yet</h3>
              <p style={{ margin: 0, color: '#64748b' }}>Be the first to start a discussion in this community!</p>
            </div>
          )}
        </div>

        {/* Community Info */}
        <div style={{ margin: '24px 16px' }}>
          <div style={{ 
            background: '#fff', 
            borderRadius: 12, 
            padding: 20, 
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Community Guidelines</h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#475569', fontSize: 14, lineHeight: 1.8 }}>
              <li>Be respectful and inclusive in all discussions</li>
              <li>Share knowledge and help others learn</li>
              <li>Keep discussions relevant to the course topic</li>
              <li>No spam or self-promotion without value</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Get short name for community tabs
  const getShortName = (community) => {
    // Use the community name directly (already set correctly based on type)
    const name = community.name || '';
    // Truncate if needed
    return name.length > 20 ? name.substring(0, 18) + '...' : name;
  };

  return (
    <div className="community-content-outer">
      <div className="community-three-column">
        <div className="community-center-column">
          {/* Horizontal Scrollable Tabs - X.com Style */}
          <div className="community-top-menu">
            <div className="community-tabs-wrapper">
              {/* Left scroll arrow */}
              {showLeftArrow && (
                <button 
                  className="tab-scroll-arrow left"
                  onClick={() => scrollTabs('left')}
                  aria-label="Scroll tabs left"
                >
                  <FaChevronLeft />
                </button>
              )}
              
              {/* Scrollable tabs container */}
              <div 
                className="community-tabs-scroll"
                ref={tabsContainerRef}
                onScroll={checkScrollArrows}
              >
                {/* Home tab - always first */}
                <button
                  className={`community-tab-btn ${activeTab === 'Home' ? 'active' : ''}`}
                  onClick={() => handleTabClick('Home')}
                >
                  <FaHome />
                  <span>Home</span>
                </button>
                
                {/* Followed community tabs - shows course names or creator names */}
                {actualFollowedCommunities.map(community => (
                  <div key={community.id} className="community-tab-wrapper">
                    <button
                      className={`community-tab-btn ${activeTab === community.id ? 'active' : ''}`}
                      onClick={() => {
                        if (community.type === 'creator') {
                          // For creator tabs: make active AND toggle dropdown
                          if (activeTab !== community.id) {
                            handleTabClick(community.id);
                            setSelectedCourseFilter(null);
                          }
                          // Toggle dropdown (open on first click, toggle on subsequent)
                          setOpenCreatorDropdown(openCreatorDropdown === community.id ? null : community.id);
                        } else {
                          handleTabClick(community.id);
                          setOpenCreatorDropdown(null);
                        }
                      }}
                      title={community.type === 'creator' ? `${community.name} (Creator) - Click for courses` : community.name}
                    >
                      {community.type === 'creator' && <FaUsers style={{ marginRight: 4, fontSize: 12 }} />}
                      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span>{getShortName(community)}</span>
                        {/* Show selected course filter as subtitle */}
                        {community.type === 'creator' && activeTab === community.id && selectedCourseFilter && (
                          <span style={{ 
                            fontSize: 10, 
                            color: '#3b82f6', 
                            marginTop: 2,
                            fontWeight: 500,
                            maxWidth: 120,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {(() => {
                              const course = getCourseById(selectedCourseFilter);
                              return course ? course.title.substring(0, 18) + (course.title.length > 18 ? '...' : '') : '';
                            })()}
                          </span>
                        )}
                      </span>
                      {community.type === 'creator' && activeTab === community.id && (
                        <FaChevronDown style={{ marginLeft: 4, fontSize: 10, transition: 'transform 0.2s', transform: openCreatorDropdown === community.id ? 'rotate(180deg)' : 'rotate(0)' }} />
                      )}
                    </button>
                    
                    {/* Creator course dropdown */}
                    {community.type === 'creator' && openCreatorDropdown === community.id && (
                      <div 
                        className="creator-course-dropdown" 
                        style={{ 
                          display: 'block',
                          position: 'fixed',
                          top: '60px',
                          left: '300px',
                          zIndex: 99999,
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                          padding: '8px 0',
                          minWidth: '300px'
                        }}
                      >
                        {/* Creator header with avatar */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: '12px 16px',
                          borderBottom: '1px solid #e2e8f0',
                          marginBottom: '8px'
                        }}>
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            border: '2px solid #1d9bf0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                            background: '#eff6ff'
                          }}>
                            <FaUsers style={{ color: '#1d9bf0', fontSize: 16 }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{community.name}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{community.courseIds?.length || 0} courses</div>
                          </div>
                        </div>
                        
                        {/* All courses option */}
                        <div 
                          style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 16px',
                            cursor: 'pointer',
                            color: !selectedCourseFilter ? '#1d9bf0' : '#475569',
                            fontWeight: !selectedCourseFilter ? 600 : 400,
                            background: !selectedCourseFilter ? '#eff6ff' : 'transparent',
                            borderLeft: !selectedCourseFilter ? '3px solid #1d9bf0' : '3px solid transparent',
                            transition: 'all 0.15s'
                          }}
                          onClick={() => {
                            setSelectedCourseFilter(null);
                            setOpenCreatorDropdown(null);
                          }}
                          onMouseEnter={(e) => { if (selectedCourseFilter) e.currentTarget.style.background = '#f8fafc'; }}
                          onMouseLeave={(e) => { if (selectedCourseFilter) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <FaUsers style={{ marginRight: 10, color: '#1d9bf0' }} />
                          All Courses
                        </div>
                        
                        {/* Individual course options */}
                        {community.courseIds && community.courseIds.length > 0 ? (
                          community.courseIds.map(courseId => {
                            const course = getCourseById(courseId);
                            if (!course) return null;
                            const isSelected = selectedCourseFilter === courseId;
                            return (
                              <div 
                                key={courseId}
                                style={{ 
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '10px 16px',
                                  cursor: 'pointer',
                                  color: isSelected ? '#1d9bf0' : '#475569',
                                  fontWeight: isSelected ? 600 : 400,
                                  background: isSelected ? '#eff6ff' : 'transparent',
                                  borderLeft: isSelected ? '3px solid #1d9bf0' : '3px solid transparent',
                                  transition: 'all 0.15s'
                                }}
                                onClick={() => {
                                  setSelectedCourseFilter(courseId);
                                  setOpenCreatorDropdown(null);
                                }}
                                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#f8fafc'; }}
                                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                              >
                                <FaBook style={{ marginRight: 10, color: isSelected ? '#1d9bf0' : '#94a3b8' }} />
                                {course.title}
                              </div>
                            );
                          })
                        ) : (
                          <div style={{ padding: '10px 16px', color: '#94a3b8', fontStyle: 'italic' }}>
                            No courses found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Right scroll arrow */}
              {showRightArrow && (
                <button 
                  className="tab-scroll-arrow right"
                  onClick={() => scrollTabs('right')}
                  aria-label="Scroll tabs right"
                >
                  <FaChevronRight />
                </button>
              )}
            </div>
          </div>

          {/* Feed Content */}
          <div className="community-feed-content">
            {actualFollowedCommunities.length > 0 ? (
              <div className="posts-feed">
                {displayedPosts.length > 0 ? (
                  displayedPosts.map(post => {
                    const course = getCourseById(post.courseId);
                    return (
                      <div key={post.id} className="post-card">
                        <div className="post-card-header">
                          <img className="post-card-avatar" src={post.authorAvatar} alt="" />
                          <div className="post-card-header-info">
                            <div className="post-card-name-row">
                              <span className="post-card-author">{post.author}</span>
                              <span className="post-card-handle">{post.authorHandle}</span>
                              <span className="post-card-dot">·</span>
                              <span className="post-card-timestamp">{post.timestamp}</span>
                            </div>
                            {post.community && (
                              <span className="post-card-community">in {post.community}</span>
                            )}
                          </div>
                        </div>
                        <div className="post-card-content">{post.content}</div>
                        <div className="post-card-actions">
                          <button className="post-action-btn">
                            <FaComment />
                            <span>{post.replies}</span>
                          </button>
                          <button className="post-action-btn">
                            <FaRetweet />
                            <span>{Math.floor(post.likes * 0.3)}</span>
                          </button>
                          <button className="post-action-btn">
                            <FaHeart />
                            <span>{post.likes}</span>
                          </button>
                          <button className="post-action-btn">
                            <FaBookmark />
                          </button>
                          <button className="post-action-btn">
                            <FaShare />
                          </button>
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
                    <p>
                      {activeTab === 'Home' 
                        ? 'Posts from your followed communities will appear here.'
                        : 'No posts in this community yet. Be the first to share!'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaUsers />
                </div>
                <h2>Welcome to My Community</h2>
                <p>Follow courses from <strong>Browse → Courses</strong> or <strong>Creators</strong> to see their community posts here.</p>
                <p className="empty-state-hint">Communities you follow will appear as tabs above ↑</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane */}
        <div className="community-right-pane">
          <div className="community-right-section">
            <h3>Your Communities</h3>
            {actualFollowedCommunities.length > 0 ? (
              actualFollowedCommunities.slice(0, 5).map(community => (
                <div 
                  key={community.id} 
                  className={`community-mini-card ${activeTab === community.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(community.id)}
                >
                  <span className="mini-card-name">
                    {community.type === 'creator' ? `👤 ${community.name}` : community.name}
                  </span>
                  <span className="mini-card-members">
                    {community.type === 'creator' 
                      ? `${community.courseIds?.length || 0} courses` 
                      : `${community.members?.toLocaleString() || 0} members`}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-communities-text">Follow courses or creators</p>
            )}
          </div>
          <div className="community-right-section">
            <h3>Trending Topics</h3>
            <div className="topic-tag">#PeerLearning</div>
            <div className="topic-tag">#StudentTeacher</div>
            <div className="topic-tag">#AIJourney</div>
            <div className="topic-tag">#LearnTeachEarn</div>
          </div>
          <div className="community-right-section">
            <h3>Quick Tips</h3>
            <p className="tip-text">💡 Complete a course to become a Student-Teacher and earn 70% teaching others!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community; 