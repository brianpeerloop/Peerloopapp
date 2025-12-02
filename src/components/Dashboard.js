import React, { useState } from 'react';
import './Dashboard.css';
import { FaCalendar, FaUser, FaBook, FaClock, FaVideo, FaFilter, FaPlus } from 'react-icons/fa';
import { coursesDatabase } from '../data/database';
import { getInstructorById } from '../data/database';

const getRandomFutureDate = (offset) => {
  const now = new Date();
  now.setDate(now.getDate() + offset);
  now.setHours(14 + (offset % 4), 0, 0, 0); // 2pm, 3pm, etc.
  return now;
};

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const currentDate = new Date();

  // Generate demo lessons from courses
  const lessons = coursesDatabase.slice(0, 5).map((course, idx) => {
    const instructor = getInstructorById(course.instructorId);
    const date = getRandomFutureDate(idx);
    return {
      id: course.id,
      title: course.title,
      instructor: instructor ? instructor.name : 'Unknown',
      date,
      time: formatTime(date),
      category: course.category,
      thumbnail: course.thumbnail,
      price: course.price,
      level: course.level,
      type: idx % 2 === 0 ? 'teaching' : 'learning',
      status: idx === 0 ? 'confirmed' : idx === 1 ? 'confirmed' : idx === 2 ? 'pending' : 'confirmed',
      earnings: idx % 2 === 0 ? 80 : 100,
    };
  });

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday(day) ? 'today' : ''}`}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  // Summary stats (demo values)
  const summary = {
    sessions: 6,
    teachingHours: 8,
    learningHours: 5,
    availableSlots: 4,
    teachingSessions: 4,
    learningSessions: 2,
    potentialEarnings: 320,
    learningInvestment: 200,
  };

  return (
    <div className="dashboard-page" style={{ background: '#fff', minHeight: '100vh', padding: '32px' }}>
      {/* Summary Cards */}
      <div className="dashboard-summary-cards">
        <div className="summary-card"><div className="summary-title">This Week</div><div className="summary-value">{summary.sessions}</div><div className="summary-label">sessions scheduled</div></div>
        <div className="summary-card"><div className="summary-title">Teaching Hours</div><div className="summary-value">{summary.teachingHours}</div><div className="summary-label">hours this week</div></div>
        <div className="summary-card"><div className="summary-title">Learning Hours</div><div className="summary-value">{summary.learningHours}</div><div className="summary-label">hours this week</div></div>
        <div className="summary-card"><div className="summary-title">Available Slots</div><div className="summary-value">{summary.availableSlots}</div><div className="summary-label">open for booking</div></div>
      </div>
      <div className="dashboard-main-row" style={{ display: 'flex', gap: '32px', marginTop: 32 }}>
        {/* Left: Schedule List */}
        <div style={{ flex: 2, minWidth: 0 }}>
          {/* Tabs */}
          <div className="dashboard-tabs">
            {['Upcoming', 'Available', 'History'].map(tab => (
              <button key={tab} className={`dashboard-tab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
            ))}
            <button className="dashboard-tab filter"><FaFilter /> Filter</button>
            <button className="dashboard-tab add-session"><FaPlus /> Add Session</button>
          </div>
          {/* Lessons List */}
          <div className="schedule-list">
            {lessons.map(lesson => (
              <div key={lesson.id} className="lesson-card">
                <div className="lesson-card-main">
                  <img src={lesson.thumbnail} alt={lesson.title} className="lesson-thumb" />
                  <div className="lesson-info">
                    <div className="lesson-title">
                      <span className={`lesson-type ${lesson.type}`}>{lesson.type}</span>
                      {lesson.title}
                    </div>
                    <div className="lesson-meta">
                      <span><FaUser style={{ marginRight: 4 }} /> {lesson.instructor}</span>
                      <span><FaBook style={{ marginRight: 4 }} /> {lesson.category}</span>
                    </div>
                    <div className="lesson-date">
                      <FaCalendar style={{ marginRight: 4 }} /> {formatDate(lesson.date)} &nbsp;
                      <FaClock style={{ marginRight: 4 }} /> {lesson.time}
                    </div>
                    <div className="lesson-status-row">
                      <span className={`lesson-status ${lesson.type}`}>{lesson.type}</span>
                      <span className={`lesson-status ${lesson.status}`}>{lesson.status}</span>
                      <span className="lesson-reschedule">Reschedule</span>
                      <span className="lesson-earnings">{lesson.type === 'teaching' ? `+$${lesson.earnings}` : lesson.type === 'learning' ? `-$${lesson.earnings}` : ''}</span>
                    </div>
                  </div>
                  <div className="lesson-actions">
                    <button className="join-btn"><FaVideo style={{ marginRight: 4 }} /> Join</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right: Sidebar */}
        <div style={{ flex: 1, minWidth: 320 }}>
          {/* Calendar */}
          <div className="calendar-section">
            <div className="calendar-header">
              <h2>Calendar</h2>
              <span className="calendar-month">{currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="calendar">
              <div className="calendar-weekdays">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
              </div>
              <div className="calendar-days">
                {renderCalendar()}
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="quick-actions">
            <div className="quick-actions-title">Quick Actions</div>
            <button className="quick-action-btn">Schedule Teaching Session</button>
            <button className="quick-action-btn">Book Learning Session</button>
            <button className="quick-action-btn">Set Availability</button>
          </div>
          {/* This Week Summary */}
          <div className="week-summary">
            <div className="week-summary-title">This Week Summary</div>
            <div className="week-summary-row"><span>Teaching sessions:</span> <span>{summary.teachingSessions}</span></div>
            <div className="week-summary-row"><span>Learning sessions:</span> <span>{summary.learningSessions}</span></div>
            <div className="week-summary-row"><span>Potential earnings:</span> <span style={{ color: '#16a34a' }}>${summary.potentialEarnings}</span></div>
            <div className="week-summary-row"><span>Learning investment:</span> <span style={{ color: '#2563eb' }}>${summary.learningInvestment}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 