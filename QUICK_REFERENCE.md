# Quick Reference Guide - Light Speed Learning Interface

## 🚀 Quick Start
```bash
npm start          # Start development server
npm build          # Build for production
npm test           # Run tests
```

## 📁 Project Structure
```
UserInterface/
├── package.json           # Dependencies and scripts
├── README.md             # Basic project info
├── CODEBASE_REVIEW.md    # Comprehensive code review
├── QUICK_REFERENCE.md    # This file
├── public/
│   └── index.html        # Main HTML template
└── src/
    ├── index.js          # React entry point
    ├── index.css         # Global styles
    ├── App.js            # Main app component
    ├── App.css           # Main layout styles
    ├── data/
    │   └── database.js   # Mock data and helper functions
    └── components/
        ├── Sidebar.js    # Left navigation
        ├── MainContent.js # Content router
        ├── Dashboard.js  # Learning dashboard
        ├── Community.js  # Social features
        ├── Profile.js    # User profile
        ├── CourseListing.js # Course browsing
        ├── ErrorBoundary.js # Error handling
        └── PropTypes.js  # Type definitions
```

## 🎯 Key Features

### Navigation Menu
- **Browse**: Course and instructor browsing
- **My Community**: Community features (formerly "My Circle")
- **Dashboard**: Learning schedule and progress
- **Messages**: Messaging system
- **Menu6**: Additional menu item

### User System
- **Alex**: Student/Teacher roles
- **Jamie**: Creator/Instructor/Student/Teacher roles
- Toggle between users in Profile section

### Content Areas
1. **Browse**: Search and browse courses/instructors
2. **Dashboard**: Learning schedule and progress tracking
3. **My Community**: Community discussions and posts
4. **Profile**: User management and settings

## 📊 Data Structure

### Instructors (7 total)
- Albert Einstein (Physics)
- Jane Doe (AI Strategy)
- Prof. Maria Rodriguez (Data Science)
- James Wilson (Full-Stack/DevOps)
- Dr. Priya Nair (AI Robotics)
- Prof. Elena Petrova (Medical AI)
- Mr. Samuel Lee (AI Coding Bootcamp)

### Courses (14 total)
- AI for Product Managers
- Node.js Backend Development
- Cloud Architecture with AWS
- Deep Learning Fundamentals
- Computer Vision with Python
- Natural Language Processing
- Data Science Fundamentals
- Business Intelligence & Analytics
- Full-Stack Web Development
- DevOps & CI/CD Mastery
- Microservices Architecture
- AI for Robotics Coding Lab
- AI for Medical Diagnostics Coding
- AI Coding Bootcamp: Python Projects

## 🔧 Key Functions

### Database Helpers
```javascript
getInstructorById(id)           // Find instructor by ID
getCourseById(id)               // Find course by ID
getAllInstructors()             // Get all instructors
getAllCourses()                 // Get all courses
getIndexedCourses()             // Courses with search indexing
getIndexedInstructors()         // Instructors with search indexing
```

### State Management
```javascript
// App.js - Global state
const [activeMenu, setActiveMenu] = useState('Browse');
const [currentUser, setCurrentUser] = useState(userA);

// MainContent.js - Content state
const [searchQuery, setSearchQuery] = useState('');
const [selectedInstructor, setSelectedInstructor] = useState(null);
const [selectedCourse, setSelectedCourse] = useState(null);
const [followedCommunities, setFollowedCommunities] = useState([]);
```

## 🎨 Design System

### Colors
- Primary: #1d9bf0 (Blue)
- Background: #ffffff (White)
- Text: #000000 (Black)
- Secondary: #536471 (Gray)

### Layout
- Sidebar: 240px (desktop), 88px (mobile)
- Main content: Responsive grid
- Typography: System fonts

## 🔄 Recent Changes
- Changed "My Circle" to "My Community" in sidebar menu
- Added comprehensive code documentation
- Enhanced database with detailed comments

## 🚨 Common Issues
1. **Menu not updating**: Check if `activeMenu` state is being passed correctly
2. **Search not working**: Verify `searchQuery` state and filtering logic
3. **Responsive issues**: Check CSS media queries in component files

## 📝 Development Notes
- All data is mock data in `database.js`
- No backend integration (frontend only)
- Uses React 18.2.0 with hooks
- Responsive design with CSS media queries
- Error boundaries for graceful error handling

## 🎯 Next Steps
1. Add real backend integration
2. Implement user authentication
3. Add video player functionality
4. Enhance search and filtering
5. Add real-time features
6. Implement progress tracking
7. Add payment integration
8. Create admin dashboard

## 📞 Key Files to Remember
- `App.js`: Main application logic
- `Sidebar.js`: Navigation component
- `MainContent.js`: Content router
- `database.js`: All mock data
- `CODEBASE_REVIEW.md`: Detailed documentation 