import React, { useState } from 'react';
import { 
  FaChartLine,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaComments,
  FaUser,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaVideo,
  FaGraduationCap,
  FaClock,
  FaArrowUp
} from 'react-icons/fa';

const StudentTeacherDashboard = ({ isDarkMode = true }) => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(2025, 11, 9)); // Dec 9, 2025
  
  // Student-Teacher info
  const stInfo = {
    name: "Alex Sanders",
    courseName: "AI Prompting Mastery",
    initials: "AS"
  };
  
  // Navigation tabs
  const navTabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'calendar', label: 'Calendar', icon: FaCalendarAlt },
    { id: 'students', label: 'Students', icon: FaUsers, badge: 4 },
    { id: 'earnings', label: 'Earnings', icon: FaDollarSign },
    { id: 'messages', label: 'Messages', icon: FaComments, badge: 2 },
    { id: 'profile', label: 'Profile', icon: FaUser }
  ];
  
  // Quick stats
  const quickStats = {
    sessionsThisWeek: 8,
    activeStudents: 4,
    totalEarned: 2520
  };
  
  // Students with progress
  const students = [
    { id: 1, name: 'Sarah Johnson', initials: 'SJ', progress: 100, module: 3, status: 'ready_for_cert' },
    { id: 2, name: 'Mike Chen', initials: 'MC', progress: 60, module: 4, status: 'on_track' },
    { id: 3, name: 'Emma Wilson', initials: 'EW', progress: 20, module: 1, status: 'new' },
    { id: 4, name: 'David Kim', initials: 'DK', progress: 40, module: 2, status: 'on_track' }
  ];
  
  // Weekly availability - which slots are set as available
  // Key: "dayIndex-hour" (0=Mon, 6=Sun)
  const availability = {
    '0-10': true, '0-11': true,
    '1-10': true, '1-14': true, '1-19': true,
    '2-14': true, '2-19': true,
    '3-10': true,
    '4-10': true,
    '5-19': true
  };
  
  // Booked sessions for this week
  const bookedSessions = [
    { day: 0, hour: 10, student: 'Sarah Johnson', initials: 'SJ', module: 3, canJoin: true },
    { day: 0, hour: 11, student: 'Mike Chen', initials: 'MC', module: 4, canJoin: false },
    { day: 1, hour: 14, student: 'Emma Wilson', initials: 'EW', module: 1, canJoin: false },
    { day: 3, hour: 10, student: 'David Kim', initials: 'DK', module: 2, canJoin: false },
    { day: 4, hour: 10, student: 'David Kim', initials: 'DK', module: 2, canJoin: false },
    { day: 0, hour: 19, student: 'Alex Rivera', initials: 'AR', module: 5, canJoin: false }
  ];
  
  // Today's sessions (detailed view)
  const todaysSessions = [
    { 
      time: '10:00 AM', 
      student: 'Sarah Johnson', 
      initials: 'SJ',
      module: 'Module 3: Advanced Applications',
      progress: 100,
      status: 'ready_for_cert',
      startsIn: '45 min',
      canJoin: true
    },
    { 
      time: '11:00 AM', 
      student: 'Mike Chen', 
      initials: 'MC',
      module: 'Module 4: Specialization',
      progress: 60,
      status: 'on_track',
      startsIn: '1hr 45min',
      canJoin: false
    },
    { 
      time: '7:00 PM', 
      student: 'Alex Rivera', 
      initials: 'AR',
      module: 'Module 5: Certification Prep',
      progress: 80,
      status: 'final_module',
      startsIn: '9 hours',
      canJoin: false
    }
  ];

  // Colors
  const bgPrimary = isDarkMode ? '#000' : '#fff';
  const bgSecondary = isDarkMode ? '#16181c' : '#f8fafc';
  const bgCard = isDarkMode ? '#16181c' : '#fff';
  const textPrimary = isDarkMode ? '#e7e9ea' : '#0f172a';
  const textSecondary = isDarkMode ? '#71767b' : '#64748b';
  const borderColor = isDarkMode ? '#2f3336' : '#e2e8f0';
  const accentBlue = '#1d9bf0';
  const accentGreen = '#00ba7c';
  const accentRed = '#ef4444';
  const slotAvailable = isDarkMode ? '#2f3336' : '#e2e8f0';
  const slotBooked = isDarkMode ? '#1a3a5c' : '#dbeafe';

  // Helper functions
  const getDayName = (dayIndex) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[dayIndex];
  };
  
  const getDateForDay = (dayIndex) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + dayIndex);
    return date.getDate();
  };
  
  const formatWeekRange = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 6);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[currentWeekStart.getMonth()]} ${currentWeekStart.getDate()}-${endDate.getDate()}, ${currentWeekStart.getFullYear()}`;
  };
  
  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeekStart(newDate);
  };
  
  const getSessionForSlot = (dayIndex, hour) => {
    return bookedSessions.find(s => s.day === dayIndex && s.hour === hour);
  };
  
  const isSlotAvailable = (dayIndex, hour) => {
    return availability[`${dayIndex}-${hour}`] === true;
  };

  // Hours to display (9 AM to 8 PM)
  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const formatHour = (hour) => {
    if (hour === 12) return '12 PM';
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  return (
    <div style={{
      background: bgPrimary,
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Top Navigation Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 56,
        borderBottom: `1px solid ${borderColor}`,
        background: bgSecondary,
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ 
          fontSize: 20, 
          fontWeight: 700, 
          color: accentBlue,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          ∞ <span style={{ color: textPrimary }}>Teaching</span>
        </div>
        
        {/* Navigation Tabs */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4,
          flex: 1,
          marginLeft: 32,
          overflowX: 'auto'
        }}>
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                background: activeTab === tab.id ? (isDarkMode ? '#2f3336' : '#e2e8f0') : 'transparent',
                border: 'none',
                borderRadius: 8,
                color: activeTab === tab.id ? accentBlue : textSecondary,
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              <tab.icon style={{ fontSize: 14 }} />
              {tab.label}
              {tab.badge && (
                <span style={{
                  background: accentRed,
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 10,
                  marginLeft: 4
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* User Dropdown */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: 'transparent',
          border: `1px solid ${borderColor}`,
          borderRadius: 20,
          color: textPrimary,
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: accentGreen,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700
          }}>
            {stInfo.initials}
          </div>
          {stInfo.name}
          <FaChevronDown style={{ fontSize: 10, color: textSecondary }} />
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: 24 }}>
        {/* Calendar Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          background: bgCard,
          padding: '16px 20px',
          borderRadius: 12,
          border: `1px solid ${borderColor}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FaCalendarAlt style={{ color: accentBlue, fontSize: 20 }} />
            <div>
              <h1 style={{ 
                fontSize: 20, 
                fontWeight: 700, 
                color: textPrimary, 
                margin: 0 
              }}>
                My Schedule
              </h1>
              <p style={{ 
                fontSize: 13, 
                color: textSecondary, 
                margin: '4px 0 0 0' 
              }}>
                {stInfo.courseName}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <select style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: `1px solid ${borderColor}`,
              background: bgSecondary,
              color: textPrimary,
              fontSize: 13,
              cursor: 'pointer'
            }}>
              <option>Week</option>
              <option>Month</option>
            </select>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button 
                onClick={() => navigateWeek(-1)}
                style={{
                  padding: 8,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 8,
                  background: bgSecondary,
                  color: textSecondary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <FaChevronLeft style={{ fontSize: 12 }} />
              </button>
              <span style={{ 
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 600,
                color: textPrimary,
                minWidth: 140,
                textAlign: 'center'
              }}>
                {formatWeekRange()}
              </span>
              <button 
                onClick={() => navigateWeek(1)}
                style={{
                  padding: 8,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 8,
                  background: bgSecondary,
                  color: textSecondary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <FaChevronRight style={{ fontSize: 12 }} />
              </button>
            </div>
            
            <button style={{
              padding: '8px 16px',
              border: `1px solid ${borderColor}`,
              borderRadius: 8,
              background: bgSecondary,
              color: textPrimary,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer'
            }}>
              Today
            </button>
          </div>
        </div>
        
        {/* Main Grid: Calendar + Sidebar */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 280px',
          gap: 24
        }}>
          {/* Calendar Grid */}
          <div style={{
            background: bgCard,
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            overflow: 'hidden'
          }}>
            {/* Day Headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px repeat(7, 1fr)',
              borderBottom: `1px solid ${borderColor}`
            }}>
              <div style={{ padding: 12 }}></div>
              {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
                <div 
                  key={dayIndex}
                  style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    borderLeft: `1px solid ${borderColor}`,
                    background: dayIndex === 0 ? (isDarkMode ? '#1a3a5c' : '#dbeafe') : 'transparent'
                  }}
                >
                  <div style={{ 
                    fontSize: 12, 
                    color: textSecondary,
                    marginBottom: 4
                  }}>
                    {getDayName(dayIndex)}
                  </div>
                  <div style={{ 
                    fontSize: 18, 
                    fontWeight: 700,
                    color: dayIndex === 0 ? accentBlue : textPrimary
                  }}>
                    {getDateForDay(dayIndex)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Time Slots */}
            <div style={{ maxHeight: 480, overflowY: 'auto' }}>
              {hours.map(hour => (
                <div 
                  key={hour}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px repeat(7, 1fr)',
                    minHeight: 48,
                    borderBottom: `1px solid ${borderColor}`
                  }}
                >
                  {/* Time Label */}
                  <div style={{
                    padding: '8px 12px',
                    fontSize: 11,
                    color: textSecondary,
                    textAlign: 'right',
                    borderRight: `1px solid ${borderColor}`
                  }}>
                    {formatHour(hour)}
                  </div>
                  
                  {/* Day Cells */}
                  {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                    const session = getSessionForSlot(dayIndex, hour);
                    const available = isSlotAvailable(dayIndex, hour);
                    
                    return (
                      <div 
                        key={dayIndex}
                        style={{
                          borderLeft: `1px solid ${borderColor}`,
                          padding: 4,
                          background: dayIndex === 0 ? (isDarkMode ? 'rgba(29, 155, 240, 0.05)' : 'rgba(29, 155, 240, 0.03)') : 'transparent'
                        }}
                      >
                        {session ? (
                          // Booked Session
                          <div style={{
                            background: slotBooked,
                            borderRadius: 6,
                            padding: '6px 8px',
                            height: '100%',
                            cursor: 'pointer',
                            border: `1px solid ${accentBlue}`,
                            position: 'relative'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6
                            }}>
                              <div style={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                background: accentBlue,
                                color: '#fff',
                                fontSize: 9,
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {session.initials}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ 
                                  fontSize: 11, 
                                  fontWeight: 600, 
                                  color: textPrimary,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {session.student.split(' ')[0]}
                                </div>
                                <div style={{ 
                                  fontSize: 9, 
                                  color: textSecondary 
                                }}>
                                  M-{session.module}
                                </div>
                              </div>
                            </div>
                            {session.canJoin && (
                              <div style={{
                                position: 'absolute',
                                bottom: 4,
                                right: 4,
                                background: accentGreen,
                                color: '#fff',
                                fontSize: 8,
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: 4
                              }}>
                                JOIN
                              </div>
                            )}
                          </div>
                        ) : available ? (
                          // Available Slot
                          <div style={{
                            background: slotAvailable,
                            borderRadius: 6,
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px dashed ${borderColor}`
                          }}>
                            <span style={{ 
                              fontSize: 9, 
                              color: textSecondary,
                              fontWeight: 500
                            }}>
                              OPEN
                            </span>
                          </div>
                        ) : (
                          // Not Available
                          <div style={{ height: '100%' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '12px 16px',
              borderTop: `1px solid ${borderColor}`,
              background: bgSecondary
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: textSecondary }}>
                <div style={{ 
                  width: 16, 
                  height: 16, 
                  background: slotAvailable, 
                  borderRadius: 4,
                  border: `1px dashed ${borderColor}`
                }} />
                Available (open for booking)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: textSecondary }}>
                <div style={{ 
                  width: 16, 
                  height: 16, 
                  background: slotBooked, 
                  borderRadius: 4,
                  border: `1px solid ${accentBlue}`
                }} />
                Booked session
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: textSecondary }}>
                <div style={{ 
                  width: 16, 
                  height: 16, 
                  background: 'transparent', 
                  borderRadius: 4,
                  border: `1px solid ${borderColor}`
                }} />
                Not set
              </div>
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Quick Stats */}
            <div style={{
              background: bgCard,
              borderRadius: 12,
              padding: 16,
              border: `1px solid ${borderColor}`
            }}>
              <h3 style={{ 
                fontSize: 12, 
                fontWeight: 700, 
                color: textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                ⚡ Quick Stats
              </h3>
              <div style={{ fontSize: 12, color: textSecondary, marginBottom: 8 }}>
                This Week:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{
                  background: bgSecondary,
                  borderRadius: 8,
                  padding: 12,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: textPrimary }}>
                    {quickStats.sessionsThisWeek}
                  </div>
                  <div style={{ fontSize: 11, color: textSecondary }}>sessions scheduled</div>
                </div>
                <div style={{
                  background: bgSecondary,
                  borderRadius: 8,
                  padding: 12,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: textPrimary }}>
                    {quickStats.activeStudents}
                  </div>
                  <div style={{ fontSize: 11, color: textSecondary }}>students active</div>
                </div>
                <div style={{
                  background: bgSecondary,
                  borderRadius: 8,
                  padding: 12,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: accentGreen }}>
                    ${quickStats.totalEarned.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: textSecondary }}>earned (total)</div>
                </div>
              </div>
            </div>
            
            {/* Action Item */}
            <div style={{
              background: bgCard,
              borderRadius: 12,
              padding: 16,
              border: `1px solid ${borderColor}`
            }}>
              <h3 style={{ 
                fontSize: 12, 
                fontWeight: 700, 
                color: textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                🎓 Actions
              </h3>
              <div style={{
                background: isDarkMode ? 'rgba(0, 186, 124, 0.1)' : 'rgba(0, 186, 124, 0.1)',
                border: `1px solid ${accentGreen}`,
                borderRadius: 8,
                padding: 12
              }}>
                <div style={{ 
                  fontSize: 13, 
                  fontWeight: 600, 
                  color: textPrimary,
                  marginBottom: 4
                }}>
                  Sarah Johnson
                </div>
                <div style={{ 
                  fontSize: 11, 
                  color: textSecondary,
                  marginBottom: 8
                }}>
                  100% complete
                </div>
                <button style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: accentGreen,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}>
                  <FaGraduationCap style={{ fontSize: 12 }} />
                  Recommend for Cert →
                </button>
              </div>
            </div>
            
            {/* Availability */}
            <div style={{
              background: bgCard,
              borderRadius: 12,
              padding: 16,
              border: `1px solid ${borderColor}`
            }}>
              <h3 style={{ 
                fontSize: 12, 
                fontWeight: 700, 
                color: textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                ⚙️ Availability
              </h3>
              <div style={{ 
                fontSize: 20, 
                fontWeight: 700, 
                color: textPrimary,
                marginBottom: 4
              }}>
                10 hrs/week
              </div>
              <div style={{ 
                fontSize: 12, 
                color: textSecondary,
                marginBottom: 12
              }}>
                set for teaching
              </div>
              <button style={{
                width: '100%',
                padding: '10px 12px',
                background: 'transparent',
                color: accentBlue,
                border: `1px solid ${accentBlue}`,
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Edit Hours →
              </button>
            </div>
          </div>
        </div>
        
        {/* Today's Sessions */}
        <div style={{ marginTop: 24 }}>
          <div style={{
            background: bgCard,
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${borderColor}`,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <FaClock style={{ color: accentBlue }} />
              <span style={{ 
                fontSize: 15, 
                fontWeight: 700, 
                color: textPrimary 
              }}>
                Today's Sessions
              </span>
              <span style={{ 
                fontSize: 13, 
                color: textSecondary 
              }}>
                · Mon, Dec 9
              </span>
            </div>
            
            <div>
              {todaysSessions.map((session, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderBottom: index < todaysSessions.length - 1 ? `1px solid ${borderColor}` : 'none',
                    gap: 16
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: accentBlue,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {session.initials}
                  </div>
                  
                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8,
                      marginBottom: 4
                    }}>
                      <span style={{ 
                        fontSize: 15, 
                        fontWeight: 700, 
                        color: textPrimary 
                      }}>
                        {session.time}
                      </span>
                      <span style={{ 
                        fontSize: 15, 
                        fontWeight: 600, 
                        color: textPrimary 
                      }}>
                        {session.student}
                      </span>
                      <span style={{ color: textSecondary }}>·</span>
                      <span style={{ 
                        fontSize: 14, 
                        color: textSecondary 
                      }}>
                        {session.module}
                      </span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 12 
                    }}>
                      {/* Progress Bar */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8,
                        flex: 1
                      }}>
                        <span style={{ fontSize: 12, color: textSecondary }}>Progress:</span>
                        <div style={{
                          flex: 1,
                          maxWidth: 200,
                          height: 6,
                          background: isDarkMode ? '#2f3336' : '#e2e8f0',
                          borderRadius: 3,
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${session.progress}%`,
                            height: '100%',
                            background: session.progress === 100 ? accentGreen : accentBlue,
                            borderRadius: 3
                          }} />
                        </div>
                        <span style={{ 
                          fontSize: 12, 
                          fontWeight: 600,
                          color: session.progress === 100 ? accentGreen : textSecondary
                        }}>
                          {session.progress}%
                        </span>
                      </div>
                      
                      {/* Status Badge */}
                      {session.status === 'ready_for_cert' && (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: accentGreen,
                          background: isDarkMode ? 'rgba(0, 186, 124, 0.1)' : 'rgba(0, 186, 124, 0.1)',
                          padding: '4px 8px',
                          borderRadius: 4
                        }}>
                          📝 Ready for certification
                        </span>
                      )}
                      {session.status === 'on_track' && (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: accentBlue,
                          background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.1)',
                          padding: '4px 8px',
                          borderRadius: 4
                        }}>
                          📚 On track
                        </span>
                      )}
                      {session.status === 'final_module' && (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#f97316',
                          background: 'rgba(249, 115, 22, 0.1)',
                          padding: '4px 8px',
                          borderRadius: 4
                        }}>
                          🎯 Final module
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Time & Actions */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12,
                    flexShrink: 0
                  }}>
                    <span style={{ 
                      fontSize: 12, 
                      color: session.canJoin ? accentGreen : textSecondary,
                      fontWeight: session.canJoin ? 600 : 400
                    }}>
                      {session.canJoin ? '🟢 Starts in ' : 'Starts in '}{session.startsIn}
                    </span>
                    
                    {session.canJoin ? (
                      <button style={{
                        padding: '10px 20px',
                        background: accentGreen,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        <FaVideo style={{ fontSize: 12 }} />
                        Join Session
                      </button>
                    ) : (
                      <button style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        color: textSecondary,
                        border: `1px solid ${borderColor}`,
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}>
                        Prepare
                      </button>
                    )}
                    
                    <button style={{
                      padding: '10px 16px',
                      background: 'transparent',
                      color: accentBlue,
                      border: `1px solid ${borderColor}`,
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}>
                      View Student
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTeacherDashboard;



