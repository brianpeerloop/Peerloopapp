/**
 * User Profiles Database
 * Contains all community members with their profiles, roles, and stats
 */

// Helper to generate random stats within a range
const randomStat = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// All community users with full profiles
export const communityUsers = {
  // Course 1: AI for Product Managers
  'ProductPioneer42': {
    id: 'ProductPioneer42',
    name: 'Patricia Parker',
    username: '@ProductPioneer42',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#4ECDC4',
    bio: 'Product Manager turned AI enthusiast. Love bridging the gap between tech and business. Now teaching AI concepts to fellow PMs!',
    location: 'Seattle, WA',
    website: 'https://productpioneer.io',
    joinedDate: 'January 2024',
    stats: {
      coursesCompleted: 8,
      coursesTeaching: 2,
      studentsHelped: 34,
      hoursLearned: 120,
      avgRating: 4.8,
      totalEarnings: 1890
    },
    expertise: ['AI for Business', 'Product Management', 'Machine Learning Basics'],
    currentlyLearning: ['Deep Learning Fundamentals'],
    achievements: [
      { id: 1, name: 'AI Pioneer', description: 'First PM course completed', icon: '🎯' },
      { id: 2, name: 'Teacher Rising', description: 'Started teaching', icon: '📚' }
    ]
  },

  'TechPM_Sarah': {
    id: 'TechPM_Sarah',
    name: 'Sarah Mitchell',
    username: '@TechPM_Sarah',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#4ECDC4',
    bio: 'Senior PM at a Fortune 500. Passionate about AI-powered products. Teaching helps me learn better!',
    location: 'New York, NY',
    website: 'https://sarahmitchell.tech',
    joinedDate: 'February 2024',
    stats: {
      coursesCompleted: 5,
      coursesTeaching: 1,
      studentsHelped: 18,
      hoursLearned: 85,
      avgRating: 4.9,
      totalEarnings: 1260
    },
    expertise: ['AI Strategy', 'Product Roadmaps', 'Stakeholder Management'],
    currentlyLearning: ['Natural Language Processing'],
    achievements: [
      { id: 1, name: 'Quick Start', description: 'Certified in first month', icon: '⚡' }
    ]
  },

  // Course 2: Node.js Backend Development
  'BackendBoss99': {
    id: 'BackendBoss99',
    name: 'Brandon Blake',
    username: '@BackendBoss99',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#00D2FF',
    bio: 'Backend developer specializing in Node.js and Express. Love building scalable APIs and helping newcomers master server-side development.',
    location: 'Austin, TX',
    website: 'https://backendboss.dev',
    joinedDate: 'December 2023',
    stats: {
      coursesCompleted: 12,
      coursesTeaching: 3,
      studentsHelped: 67,
      hoursLearned: 210,
      avgRating: 4.9,
      totalEarnings: 4230
    },
    expertise: ['Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'PostgreSQL'],
    currentlyLearning: ['Microservices Architecture', 'GraphQL'],
    achievements: [
      { id: 1, name: 'Backend Master', description: 'Completed all backend courses', icon: '🔧' },
      { id: 2, name: 'Top Teacher', description: '50+ students helped', icon: '🌟' },
      { id: 3, name: 'High Earner', description: 'Earned $4000+', icon: '💰' }
    ]
  },

  'CodeNewbie_Mike': {
    id: 'CodeNewbie_Mike',
    name: 'Michael Chen',
    username: '@CodeNewbie_Mike',
    roles: ['student'],
    avatar: null,
    avatarColor: '#00D2FF',
    bio: 'Career changer learning to code. Coming from marketing, now diving into web development. One step at a time!',
    location: 'Portland, OR',
    website: null,
    joinedDate: 'March 2024',
    stats: {
      coursesCompleted: 2,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 45,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['HTML/CSS', 'JavaScript Basics'],
    currentlyLearning: ['Node.js Backend Development', 'Full-Stack Web Development'],
    achievements: [
      { id: 1, name: 'First Steps', description: 'Completed first course', icon: '👣' }
    ]
  },

  // Course 3: Cloud Architecture with AWS
  'CloudMaster_Pro': {
    id: 'CloudMaster_Pro',
    name: 'Carlos Mendez',
    username: '@CloudMaster_Pro',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#FF9900',
    bio: 'AWS Certified Solutions Architect. Previously DevOps engineer, now teaching cloud architecture. Cloud is the future!',
    location: 'Miami, FL',
    website: 'https://cloudmasterpro.com',
    joinedDate: 'November 2023',
    stats: {
      coursesCompleted: 15,
      coursesTeaching: 4,
      studentsHelped: 89,
      hoursLearned: 280,
      avgRating: 4.95,
      totalEarnings: 6780
    },
    expertise: ['AWS', 'Cloud Architecture', 'Serverless', 'Terraform', 'Docker'],
    currentlyLearning: ['Kubernetes Advanced'],
    achievements: [
      { id: 1, name: 'Cloud Guru', description: 'AWS Certified', icon: '☁️' },
      { id: 2, name: 'Mentor Elite', description: '75+ students', icon: '🏆' },
      { id: 3, name: 'Top Rated', description: '4.95 rating', icon: '⭐' }
    ]
  },

  'DevOpsNewbie': {
    id: 'DevOpsNewbie',
    name: 'Diana Okonkwo',
    username: '@DevOpsNewbie',
    roles: ['student'],
    avatar: null,
    avatarColor: '#FF9900',
    bio: 'Junior developer exploring DevOps. Fascinated by automation and cloud infrastructure. Learning AWS step by step.',
    location: 'Chicago, IL',
    website: null,
    joinedDate: 'April 2024',
    stats: {
      coursesCompleted: 1,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 32,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Linux Basics', 'Git'],
    currentlyLearning: ['Cloud Architecture with AWS', 'DevOps & CI/CD Mastery'],
    achievements: []
  },

  // Course 4: Deep Learning Fundamentals
  'NeuralNetNinja': {
    id: 'NeuralNetNinja',
    name: 'Nathan Nguyen',
    username: '@NeuralNetNinja',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#FF6B6B',
    bio: 'ML Engineer specializing in deep learning. Built CNNs for image recognition at scale. Teaching neural networks is my passion!',
    location: 'San Jose, CA',
    website: 'https://neuralnetninja.ai',
    joinedDate: 'October 2023',
    stats: {
      coursesCompleted: 18,
      coursesTeaching: 5,
      studentsHelped: 112,
      hoursLearned: 340,
      avgRating: 4.92,
      totalEarnings: 8450
    },
    expertise: ['Deep Learning', 'TensorFlow', 'PyTorch', 'CNN', 'Computer Vision'],
    currentlyLearning: ['Transformer Models', 'LLM Fine-tuning'],
    achievements: [
      { id: 1, name: 'Neural Master', description: 'All DL courses done', icon: '🧠' },
      { id: 2, name: 'Century Club', description: '100+ students', icon: '💯' },
      { id: 3, name: 'AI Influencer', description: 'Top 5% teacher', icon: '🌟' }
    ]
  },

  'AIStudent_2024': {
    id: 'AIStudent_2024',
    name: 'Amanda Stevens',
    username: '@AIStudent_2024',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#FF6B6B',
    bio: 'Data scientist transitioning to ML engineering. Recently certified to teach Deep Learning. Excited to help others on their AI journey!',
    location: 'Boston, MA',
    website: 'https://amandastevens.ml',
    joinedDate: 'January 2024',
    stats: {
      coursesCompleted: 6,
      coursesTeaching: 1,
      studentsHelped: 23,
      hoursLearned: 95,
      avgRating: 4.85,
      totalEarnings: 1680
    },
    expertise: ['Python', 'Data Science', 'Deep Learning', 'Statistics'],
    currentlyLearning: ['Computer Vision with Python', 'NLP'],
    achievements: [
      { id: 1, name: 'Fast Learner', description: '6 courses in 3 months', icon: '🚀' },
      { id: 2, name: 'New Teacher', description: 'First teaching cert', icon: '📖' }
    ]
  },

  // Course 5: Computer Vision with Python
  'VisionCoder25': {
    id: 'VisionCoder25',
    name: 'Victor Ivanov',
    username: '@VisionCoder25',
    roles: ['student'],
    avatar: null,
    avatarColor: '#9B59B6',
    bio: 'Software engineer exploring computer vision. Building real-time object detection systems. Love the intersection of AI and visual computing.',
    location: 'Denver, CO',
    website: 'https://visioncode.dev',
    joinedDate: 'February 2024',
    stats: {
      coursesCompleted: 4,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 72,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Python', 'OpenCV Basics', 'Image Processing'],
    currentlyLearning: ['Computer Vision with Python', 'Deep Learning Fundamentals'],
    achievements: [
      { id: 1, name: 'Vision Quest', description: 'Started CV course', icon: '👁️' }
    ]
  },

  'OpenCV_Fan': {
    id: 'OpenCV_Fan',
    name: 'Olivia Foster',
    username: '@OpenCV_Fan',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#9B59B6',
    bio: 'Computer vision specialist. From OpenCV basics to building production ML pipelines. Teaching CV and loving every session!',
    location: 'Los Angeles, CA',
    website: 'https://oliviafoster.cv',
    joinedDate: 'December 2023',
    stats: {
      coursesCompleted: 9,
      coursesTeaching: 2,
      studentsHelped: 45,
      hoursLearned: 156,
      avgRating: 4.88,
      totalEarnings: 3120
    },
    expertise: ['Computer Vision', 'OpenCV', 'YOLO', 'Image Segmentation'],
    currentlyLearning: ['3D Vision', 'GANs'],
    achievements: [
      { id: 1, name: 'CV Expert', description: 'Certified in CV', icon: '📷' },
      { id: 2, name: 'Helpful Hand', description: '40+ students', icon: '🤝' }
    ]
  },

  // Course 6: Natural Language Processing
  'NLPMastermind': {
    id: 'NLPMastermind',
    name: 'Nicholas Lopez',
    username: '@NLPMastermind',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#17bf63',
    bio: 'NLP engineer building chatbots and sentiment analysis tools. Transformers changed everything! Teaching NLP to spread the knowledge.',
    location: 'Washington, DC',
    website: 'https://nlpmastermind.ai',
    joinedDate: 'November 2023',
    stats: {
      coursesCompleted: 11,
      coursesTeaching: 3,
      studentsHelped: 58,
      hoursLearned: 198,
      avgRating: 4.91,
      totalEarnings: 4560
    },
    expertise: ['NLP', 'BERT', 'GPT', 'Text Classification', 'Named Entity Recognition'],
    currentlyLearning: ['LLM Applications', 'RAG Systems'],
    achievements: [
      { id: 1, name: 'Language Master', description: 'NLP certified', icon: '💬' },
      { id: 2, name: 'Word Wizard', description: 'Built 5 NLP projects', icon: '📝' }
    ]
  },

  'TextMiner_Pro': {
    id: 'TextMiner_Pro',
    name: 'Tanya Morrison',
    username: '@TextMiner_Pro',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#17bf63',
    bio: 'From linguistics to NLP engineering. Fascinated by how machines understand human language. Teaching text mining and loving it!',
    location: 'Philadelphia, PA',
    website: null,
    joinedDate: 'January 2024',
    stats: {
      coursesCompleted: 5,
      coursesTeaching: 1,
      studentsHelped: 19,
      hoursLearned: 88,
      avgRating: 4.75,
      totalEarnings: 1340
    },
    expertise: ['Text Mining', 'Sentiment Analysis', 'Python'],
    currentlyLearning: ['Transformer Models', 'Speech Recognition'],
    achievements: [
      { id: 1, name: 'Text Expert', description: 'Completed NLP course', icon: '📊' }
    ]
  },

  // Course 7: Data Science Fundamentals
  'DataDriven_Dan': {
    id: 'DataDriven_Dan',
    name: 'Daniel Wright',
    username: '@DataDriven_Dan',
    roles: ['student'],
    avatar: null,
    avatarColor: '#794BC4',
    bio: 'Business analyst learning data science. Excel power user transitioning to Python. Data tells stories, and I want to tell them better!',
    location: 'Atlanta, GA',
    website: null,
    joinedDate: 'March 2024',
    stats: {
      coursesCompleted: 2,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 48,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Excel', 'SQL Basics', 'Data Visualization'],
    currentlyLearning: ['Data Science Fundamentals', 'Python for Data Analysis'],
    achievements: [
      { id: 1, name: 'Data Journey', description: 'Started DS path', icon: '📈' }
    ]
  },

  'AnalyticsAce': {
    id: 'AnalyticsAce',
    name: 'Angela Chen',
    username: '@AnalyticsAce',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#794BC4',
    bio: 'Senior Data Analyst at a fintech startup. Teaching data science fundamentals because sharing knowledge multiplies it!',
    location: 'San Francisco, CA',
    website: 'https://analyticsace.io',
    joinedDate: 'October 2023',
    stats: {
      coursesCompleted: 14,
      coursesTeaching: 4,
      studentsHelped: 78,
      hoursLearned: 245,
      avgRating: 4.93,
      totalEarnings: 5890
    },
    expertise: ['Data Analysis', 'Python', 'Pandas', 'SQL', 'Tableau', 'Statistics'],
    currentlyLearning: ['Machine Learning Engineering'],
    achievements: [
      { id: 1, name: 'Data Master', description: 'All DS courses done', icon: '📊' },
      { id: 2, name: 'Super Teacher', description: '70+ students', icon: '👨‍🏫' },
      { id: 3, name: 'Top Earner', description: '$5000+ earned', icon: '💎' }
    ]
  },

  // Course 8: Business Intelligence & Analytics
  'BIDashboardPro': {
    id: 'BIDashboardPro',
    name: 'Brian Davis',
    username: '@BIDashboardPro',
    roles: ['student'],
    avatar: null,
    avatarColor: '#3498DB',
    bio: 'Finance professional learning BI tools. Building executive dashboards that actually get used. Data visualization enthusiast.',
    location: 'Dallas, TX',
    website: null,
    joinedDate: 'February 2024',
    stats: {
      coursesCompleted: 3,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 56,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Excel', 'Power BI Basics', 'Financial Modeling'],
    currentlyLearning: ['Business Intelligence & Analytics', 'Tableau'],
    achievements: [
      { id: 1, name: 'Dashboard Creator', description: 'First BI project', icon: '📉' }
    ]
  },

  'TableauNewbie': {
    id: 'TableauNewbie',
    name: 'Tracy Nelson',
    username: '@TableauNewbie',
    roles: ['student'],
    avatar: null,
    avatarColor: '#3498DB',
    bio: 'Marketing manager exploring data visualization. Want to make data-driven decisions easier for my team. Learning Tableau step by step.',
    location: 'Minneapolis, MN',
    website: null,
    joinedDate: 'April 2024',
    stats: {
      coursesCompleted: 1,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 24,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Marketing Analytics', 'Google Analytics'],
    currentlyLearning: ['Business Intelligence & Analytics'],
    achievements: []
  },

  // Course 9: Full-Stack Web Development
  'FullStackFiona': {
    id: 'FullStackFiona',
    name: 'Fiona Rodriguez',
    username: '@FullStackFiona',
    roles: ['student'],
    avatar: null,
    avatarColor: '#E74C3C',
    bio: 'Graphic designer learning full-stack development. Building my own portfolio site from scratch. React is amazing!',
    location: 'Phoenix, AZ',
    website: 'https://fionarodriguez.design',
    joinedDate: 'January 2024',
    stats: {
      coursesCompleted: 4,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 78,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['HTML/CSS', 'JavaScript', 'React Basics', 'UI Design'],
    currentlyLearning: ['Full-Stack Web Development', 'Node.js Backend Development'],
    achievements: [
      { id: 1, name: 'First Deploy', description: 'Deployed first app', icon: '🚀' }
    ]
  },

  'WebDev_Journey': {
    id: 'WebDev_Journey',
    name: 'William Jackson',
    username: '@WebDev_Journey',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#E74C3C',
    bio: 'From zero to full-stack in 8 weeks! Now I teach web development and help others start their coding journey. The flywheel is real!',
    location: 'Houston, TX',
    website: 'https://webdevjourney.com',
    joinedDate: 'November 2023',
    stats: {
      coursesCompleted: 10,
      coursesTeaching: 3,
      studentsHelped: 52,
      hoursLearned: 180,
      avgRating: 4.87,
      totalEarnings: 3890
    },
    expertise: ['React', 'Node.js', 'MongoDB', 'Express', 'Full-Stack Development'],
    currentlyLearning: ['TypeScript', 'Next.js'],
    achievements: [
      { id: 1, name: 'Full Stack', description: 'All web courses done', icon: '🌐' },
      { id: 2, name: 'Career Changer', description: 'New career started', icon: '🎯' }
    ]
  },

  // Course 10: DevOps & CI/CD Mastery
  'DevOpsDerek': {
    id: 'DevOpsDerek',
    name: 'Derek Thompson',
    username: '@DevOpsDerek',
    roles: ['student'],
    avatar: null,
    avatarColor: '#4A90E2',
    bio: 'System administrator learning DevOps. Automating everything I can. Jenkins and GitHub Actions are my new best friends.',
    location: 'Detroit, MI',
    website: null,
    joinedDate: 'February 2024',
    stats: {
      coursesCompleted: 3,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 62,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Linux', 'Bash Scripting', 'Jenkins Basics'],
    currentlyLearning: ['DevOps & CI/CD Mastery', 'Docker'],
    achievements: [
      { id: 1, name: 'Pipeline Builder', description: 'First CI/CD setup', icon: '🔄' }
    ]
  },

  'Pipeline_Pro': {
    id: 'Pipeline_Pro',
    name: 'Priscilla Wong',
    username: '@Pipeline_Pro',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#4A90E2',
    bio: 'DevOps engineer with 5 years experience. Teaching CI/CD because proper pipelines save lives (and weekends). Automation is freedom!',
    location: 'San Diego, CA',
    website: 'https://pipelinepro.dev',
    joinedDate: 'September 2023',
    stats: {
      coursesCompleted: 16,
      coursesTeaching: 4,
      studentsHelped: 86,
      hoursLearned: 268,
      avgRating: 4.94,
      totalEarnings: 6340
    },
    expertise: ['CI/CD', 'Jenkins', 'GitHub Actions', 'Docker', 'Kubernetes', 'Terraform'],
    currentlyLearning: ['SRE Practices', 'Platform Engineering'],
    achievements: [
      { id: 1, name: 'DevOps Guru', description: 'All DevOps certs', icon: '⚙️' },
      { id: 2, name: 'Pipeline Master', description: '100+ pipelines built', icon: '🏗️' }
    ]
  },

  // Course 11: Microservices Architecture
  'MicroservicesMike': {
    id: 'MicroservicesMike',
    name: 'Michael Brown',
    username: '@MicroservicesMike',
    roles: ['student'],
    avatar: null,
    avatarColor: '#1ABC9C',
    bio: 'Backend developer learning microservices. Decomposing monoliths is an art. Docker and Kubernetes are challenging but worth it!',
    location: 'Nashville, TN',
    website: null,
    joinedDate: 'March 2024',
    stats: {
      coursesCompleted: 2,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 42,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Java', 'Spring Boot', 'Docker Basics'],
    currentlyLearning: ['Microservices Architecture', 'Kubernetes'],
    achievements: [
      { id: 1, name: 'Container Start', description: 'First Docker app', icon: '📦' }
    ]
  },

  'ContainerKing': {
    id: 'ContainerKing',
    name: 'Charles Kim',
    username: '@ContainerKing',
    roles: ['student'],
    avatar: null,
    avatarColor: '#1ABC9C',
    bio: 'Software architect diving deep into containerization. Building my first multi-container app. The microservices journey begins!',
    location: 'Orlando, FL',
    website: 'https://containerking.io',
    joinedDate: 'February 2024',
    stats: {
      coursesCompleted: 5,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 96,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Docker', 'Container Orchestration', 'System Design'],
    currentlyLearning: ['Microservices Architecture', 'Service Mesh'],
    achievements: [
      { id: 1, name: 'Multi-Container', description: 'First compose app', icon: '🐳' }
    ]
  },

  // Course 12: AI for Robotics Coding Lab
  'RoboticsGeek29': {
    id: 'RoboticsGeek29',
    name: 'Rachel Green',
    username: '@RoboticsGeek29',
    roles: ['student'],
    avatar: null,
    avatarColor: '#50C878',
    bio: 'Mechanical engineer exploring robotics programming. Path planning algorithms are fascinating! Building autonomous systems is my dream.',
    location: 'Pittsburgh, PA',
    website: 'https://roboticsgeek.tech',
    joinedDate: 'January 2024',
    stats: {
      coursesCompleted: 4,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 82,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Python', 'ROS Basics', 'Path Planning', 'Control Systems'],
    currentlyLearning: ['AI for Robotics Coding Lab', 'Computer Vision'],
    achievements: [
      { id: 1, name: 'Robot Builder', description: 'First robot programmed', icon: '🤖' }
    ]
  },

  'BotBuilder_Pro': {
    id: 'BotBuilder_Pro',
    name: 'Benjamin Taylor',
    username: '@BotBuilder_Pro',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#50C878',
    bio: 'Robotics engineer specializing in autonomous systems. Teaching path planning and robot control. The future is autonomous!',
    location: 'Boulder, CO',
    website: 'https://botbuilderpro.ai',
    joinedDate: 'October 2023',
    stats: {
      coursesCompleted: 12,
      coursesTeaching: 3,
      studentsHelped: 41,
      hoursLearned: 195,
      avgRating: 4.89,
      totalEarnings: 3240
    },
    expertise: ['Robotics', 'ROS', 'Path Planning', 'SLAM', 'Autonomous Systems'],
    currentlyLearning: ['Reinforcement Learning for Robotics'],
    achievements: [
      { id: 1, name: 'Bot Master', description: 'Robotics certified', icon: '🦾' },
      { id: 2, name: 'Autonomy Expert', description: '10 bots programmed', icon: '🎮' }
    ]
  },

  // Course 13: AI for Medical Diagnostics Coding
  'MedTechInnovator': {
    id: 'MedTechInnovator',
    name: 'Maria Santos',
    username: '@MedTechInnovator',
    roles: ['student'],
    avatar: null,
    avatarColor: '#E74C3C',
    bio: 'MD exploring AI in healthcare. Building diagnostic tools to help doctors make better decisions. Medicine meets machine learning!',
    location: 'Baltimore, MD',
    website: 'https://medtechinnovator.health',
    joinedDate: 'December 2023',
    stats: {
      coursesCompleted: 6,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 112,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Medical Imaging', 'Python', 'Healthcare AI', 'Diagnostics'],
    currentlyLearning: ['AI for Medical Diagnostics Coding', 'Deep Learning'],
    achievements: [
      { id: 1, name: 'Health AI', description: 'First diagnostic model', icon: '🏥' }
    ]
  },

  'HealthAI_Student': {
    id: 'HealthAI_Student',
    name: 'Hannah White',
    username: '@HealthAI_Student',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#E74C3C',
    bio: 'Biomedical engineer turned AI specialist. Teaching medical AI to bridge the gap between healthcare and technology. Saving lives with code!',
    location: 'Cleveland, OH',
    website: 'https://healthaistudent.io',
    joinedDate: 'November 2023',
    stats: {
      coursesCompleted: 8,
      coursesTeaching: 2,
      studentsHelped: 34,
      hoursLearned: 145,
      avgRating: 4.86,
      totalEarnings: 2680
    },
    expertise: ['Medical AI', 'Image Classification', 'Healthcare ML', 'PyTorch'],
    currentlyLearning: ['Federated Learning for Healthcare'],
    achievements: [
      { id: 1, name: 'Medical AI Cert', description: 'Healthcare certified', icon: '⚕️' },
      { id: 2, name: 'Life Saver', description: 'Diagnostic tools built', icon: '❤️' }
    ]
  },

  // Course 14: AI Coding Bootcamp: Python Projects
  'PythonPro88': {
    id: 'PythonPro88',
    name: 'Peter Anderson',
    username: '@PythonPro88',
    roles: ['student'],
    avatar: null,
    avatarColor: '#FFD93D',
    bio: 'Self-taught programmer going pro with Python. Building ML projects one at a time. Prof. Petrova makes Python fun!',
    location: 'Columbus, OH',
    website: null,
    joinedDate: 'February 2024',
    stats: {
      coursesCompleted: 3,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 58,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Python', 'Basic ML', 'Data Structures'],
    currentlyLearning: ['AI Coding Bootcamp: Python Projects', 'Data Science'],
    achievements: [
      { id: 1, name: 'Python Start', description: '5 projects completed', icon: '🐍' }
    ]
  },

  'MLBeginner_2024': {
    id: 'MLBeginner_2024',
    name: 'Maya Lewis',
    username: '@MLBeginner_2024',
    roles: ['student', 'teacher'],
    avatar: null,
    avatarColor: '#FFD93D',
    bio: 'From Python newbie to AI developer in 8 weeks! Now teaching the bootcamp. Proof that anyone can learn to code with the right system.',
    location: 'Sacramento, CA',
    website: 'https://mayalewis.dev',
    joinedDate: 'December 2023',
    stats: {
      coursesCompleted: 7,
      coursesTeaching: 2,
      studentsHelped: 28,
      hoursLearned: 134,
      avgRating: 4.82,
      totalEarnings: 2120
    },
    expertise: ['Python', 'ML Basics', 'Scikit-learn', 'Jupyter Notebooks'],
    currentlyLearning: ['Deep Learning Fundamentals'],
    achievements: [
      { id: 1, name: 'Bootcamp Graduate', description: 'All projects done', icon: '🎓' },
      { id: 2, name: 'Rapid Growth', description: 'Teacher in 8 weeks', icon: '📈' }
    ]
  }
};

/**
 * Get a user profile by username (with or without @)
 */
export const getUserByUsername = (username) => {
  const cleanUsername = username.replace('@', '');
  return communityUsers[cleanUsername] || null;
};

/**
 * Get a user profile by their display name
 */
export const getUserByName = (name) => {
  return Object.values(communityUsers).find(user => user.name === name) || null;
};

/**
 * Get all users with a specific role
 */
export const getUsersByRole = (role) => {
  return Object.values(communityUsers).filter(user => user.roles.includes(role));
};

/**
 * Get all student-teachers (users with both 'student' and 'teacher' roles)
 */
export const getStudentTeachers = () => {
  return Object.values(communityUsers).filter(
    user => user.roles.includes('student') && user.roles.includes('teacher')
  );
};

/**
 * Get all students only (not teachers)
 */
export const getStudentsOnly = () => {
  return Object.values(communityUsers).filter(
    user => user.roles.includes('student') && !user.roles.includes('teacher')
  );
};

/**
 * Get user initials from name
 */
export const getUserInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export default communityUsers;

