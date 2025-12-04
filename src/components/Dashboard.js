import React, { useState } from 'react';
import './Dashboard.css';
import { FaChevronLeft, FaChevronRight, FaVideo } from 'react-icons/fa';
import { coursesDatabase, getInstructorById } from '../data/database';

const Dashboard = ({ isDarkMode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  // Generate demo sessions with specific dates
  const generateSessions = () => {
    const sessions = [];
    const baseDate = new Date();
    
    // Today's sessions
    sessions.push({
      id: 1,
      title: 'Node.js Backend Development',
      instructor: 'Albert Einstein',
      instructorHandle: '@AlbertEinstein',
      module: 'Module 5: REST APIs',
      date: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 14, 0),
      type: 'learning',
      sessionType: '1-on-1 Session'
    });
    sessions.push({
      id: 2,
      title: 'AI for Product Managers',
      instructor: 'Sarah Chen',
      instructorHandle: '@SarahChen',
      module: '1-on-1 Session',
      date: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 16, 30),
      type: 'teaching',
      sessionType: '1-on-1 Session'
    });

    // Tomorrow
    const tomorrow = new Date(baseDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    sessions.push({
      id: 3,
      title: 'Cloud Architecture with AWS',
      instructor: 'Jane Doe',
      instructorHandle: '@JaneDoe',
      module: 'Module 3: AWS Lambda',
      date: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 15, 0),
      type: 'learning',
      sessionType: 'Group Session'
    });

    // Day after tomorrow
    const dayAfter = new Date(baseDate);
    dayAfter.setDate(dayAfter.getDate() + 2);
    sessions.push({
      id: 4,
      title: 'AI for Product Managers',
      instructor: 'Tom Bradley',
      instructorHandle: '@TomBradley',
      module: 'Group Session (4 students)',
      date: new Date(dayAfter.getFullYear(), dayAfter.getMonth(), dayAfter.getDate(), 11, 0),
      type: 'teaching',
      sessionType: 'Group Session'
    });
    sessions.push({
      id: 5,
      title: 'Node.js Backend Development',
      instructor: 'Albert Einstein',
      instructorHandle: '@AlbertEinstein',
      module: 'Module 6: Authentication',
      date: new Date(dayAfter.getFullYear(), dayAfter.getMonth(), dayAfter.getDate(), 15, 0),
      type: 'learning',
      sessionType: '1-on-1 Session'
    });

    // 3 days from now
    const threeDays = new Date(baseDate);
    threeDays.setDate(threeDays.getDate() + 3);
    sessions.push({
      id: 6,
      title: 'Deep Learning Fundamentals',
      instructor: 'Albert Einstein',
      instructorHandle: '@AlbertEinstein',
      module: 'Module 2: Neural Networks',
      date: new Date(threeDays.getFullYear(), threeDays.getMonth(), threeDays.getDate(), 13, 0),
      type: 'learning',
      sessionType: '1-on-1 Session'
    });
    sessions.push({
      id: 7,
      title: 'AI for Product Managers',
      instructor: 'Amy Foster',
      instructorHandle: '@AmyFoster',
      module: '1-on-1 Session',
      date: new Date(threeDays.getFullYear(), threeDays.getMonth(), threeDays.getDate(), 17, 0),
      type: 'teaching',
      sessionType: '1-on-1 Session'
    });

    // Add more scattered sessions for calendar display
    for (let i = 4; i <= 20; i++) {
      const futureDate = new Date(baseDate);
      futureDate.setDate(futureDate.getDate() + i);
      if (Math.random() > 0.5) {
        sessions.push({
          id: 100 + i,
          title: i % 2 === 0 ? 'Node.js Backend Development' : 'AI for Product Managers',
          instructor: i % 2 === 0 ? 'Albert Einstein' : 'Jane Doe',
          instructorHandle: i % 2 === 0 ? '@AlbertEinstein' : '@JaneDoe',
          module: `Module ${i % 5 + 1}`,
          date: new Date(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), 10 + (i % 8), 0),
          type: i % 3 === 0 ? 'teaching' : 'learning',
          sessionType: i % 2 === 0 ? '1-on-1 Session' : 'Group Session'
        });
      }
    }

    return sessions.sort((a, b) => a.date - b.date);
  };

  const sessions = generateSessions();

  // Stats
  const stats = {
    inProgress: 3,
    completed: 12,
    sessionsThisMonth: sessions.length,
    earningsThisMonth: 1247
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPrevMonthDays = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  };

  const isToday = (day, month, year) => {
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const getSessionsForDay = (day, month, year) => {
    return sessions.filter(s => 
      s.date.getDate() === day && 
      s.date.getMonth() === month && 
      s.date.getFullYear() === year
    );
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDayLabel = (date) => {
    const diffDays = Math.floor((date - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 0 || (date.getDate() === today.getDate() && date.getMonth() === today.getMonth())) {
      return 'TODAY';
    } else if (diffDays === 1 || (date.getDate() === today.getDate() + 1 && date.getMonth() === today.getMonth())) {
      return `TOMORROW · ${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
    }
  };

  // Group sessions by day
  const groupSessionsByDay = () => {
    const grouped = {};
    const upcomingSessions = sessions.filter(s => s.date >= new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    
    upcomingSessions.forEach(session => {
      const dateKey = session.date.toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: session.date,
          sessions: []
        };
      }
      grouped[dateKey].sessions.push(session);
    });

    return Object.values(grouped).slice(0, 5); // Show next 5 days with sessions
  };

  const groupedSessions = groupSessionsByDay();

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const prevMonthDaysCount = getPrevMonthDays(currentDate);
    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="calendar-cell other-month">
          <span className="day-number">{prevMonthDaysCount - i}</span>
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const daySessions = getSessionsForDay(day, currentDate.getMonth(), currentDate.getFullYear());
      const isCurrentDay = isToday(day, currentDate.getMonth(), currentDate.getFullYear());
      const learningSessions = daySessions.filter(s => s.type === 'learning');
      const teachingSessions = daySessions.filter(s => s.type === 'teaching');

      days.push(
        <div 
          key={day} 
          className={`calendar-cell ${isCurrentDay ? 'today' : ''}`}
        >
          <span className={`day-number ${isCurrentDay ? 'today-number' : ''}`}>{day}</span>
          <div className="session-dots">
            {learningSessions.slice(0, 2).map((_, idx) => (
              <span key={`l-${idx}`} className="session-dot learning" title="Learning session"></span>
            ))}
            {teachingSessions.slice(0, 2).map((_, idx) => (
              <span key={`t-${idx}`} className="session-dot teaching" title="Teaching session"></span>
            ))}
          </div>
        </div>
      );
    }

    // Next month days
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div key={`next-${i}`} className="calendar-cell other-month">
          <span className="day-number">{i}</span>
        </div>
      );
    }

    return days;
  };

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      {/* Minimalist Stats Bar */}
      <div className="stats-bar">
        <span className="stat-item">
          <span className="stat-icon">📚</span>
          <span className="stat-value">{stats.inProgress}</span>
          <span className="stat-label">in progress</span>
        </span>
        <span className="stat-divider">·</span>
        <span className="stat-item">
          <span className="stat-icon">✅</span>
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">completed</span>
        </span>
        <span className="stat-divider">·</span>
        <span className="stat-item">
          <span className="stat-icon">👥</span>
          <span className="stat-value">{stats.sessionsThisMonth}</span>
          <span className="stat-label">sessions</span>
        </span>
        <span className="stat-divider">·</span>
        <span className="stat-item">
          <span className="stat-icon">💰</span>
          <span className="stat-value">${stats.earningsThisMonth.toLocaleString()}</span>
          <span className="stat-label">this month</span>
        </span>
      </div>

      {/* Full Width Calendar */}
      <div className="calendar-container">
        <div className="calendar-nav">
          <h2 className="calendar-title">
            {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="calendar-nav-buttons">
            <button onClick={prevMonth} className="nav-btn">
              <FaChevronLeft />
            </button>
            <button onClick={nextMonth} className="nav-btn">
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="calendar-days">
            {renderCalendar()}
          </div>
        </div>

        <div className="calendar-legend">
          <span className="legend-item">
            <span className="session-dot learning"></span>
            Learning Sessions
          </span>
          <span className="legend-item">
            <span className="session-dot teaching"></span>
            Teaching Sessions
          </span>
        </div>
      </div>

      {/* Upcoming Sessions List */}
      <div className="sessions-list">
        <h2 className="sessions-title">Upcoming Sessions</h2>

        {groupedSessions.map((group, groupIdx) => (
          <div key={groupIdx} className="session-group">
            <div className="session-date-header">
              {formatDayLabel(group.date)}
            </div>
            
            {group.sessions.map(session => {
              const isSessionToday = session.date.getDate() === today.getDate() && 
                                     session.date.getMonth() === today.getMonth();
              return (
                <div key={session.id} className="session-item">
                  <div className={`session-type-indicator ${session.type}`}></div>
                  <div className="session-time">{formatTime(session.date)}</div>
                  <div className="session-details">
                    <div className="session-course-title">{session.title}</div>
                    <div className="session-meta">
                      {session.type === 'learning' ? 'with' : 'Teaching'} {session.instructorHandle} · {session.module}
                    </div>
                  </div>
                  <button className={`session-action-btn ${isSessionToday ? 'join' : 'details'}`}>
                    {isSessionToday ? (
                      <>
                        <FaVideo style={{ marginRight: 4 }} />
                        Join
                      </>
                    ) : (
                      'Details'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ))}

        <button className="show-more-btn">Show More Sessions...</button>
      </div>
    </div>
  );
};

export default Dashboard;
