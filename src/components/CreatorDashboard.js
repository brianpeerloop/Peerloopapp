import React, { useState } from 'react';
import { 
  FaGraduationCap, 
  FaDollarSign, 
  FaChalkboardTeacher, 
  FaUsers, 
  FaChartLine,
  FaCalendarAlt,
  FaArrowRight,
  FaArrowUp,
  FaVideo,
  FaCheckCircle,
  FaBell,
  FaChevronDown,
  FaCog,
  FaBook,
  FaClipboardList
} from 'react-icons/fa';

const CreatorDashboard = ({ isDarkMode = true, currentUser = null }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Navigation tabs
  const navTabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'students', label: 'Students', icon: FaUsers },
    { id: 'certifications', label: 'Certifications', icon: FaGraduationCap, badge: 3 },
    { id: 'payouts', label: 'Payouts', icon: FaDollarSign, badge: 2 },
    { id: 'student-teachers', label: 'Student-Teachers', icon: FaChalkboardTeacher, badge: 1 },
    { id: 'sessions', label: 'Sessions', icon: FaCalendarAlt },
    { id: 'content', label: 'Course Content', icon: FaBook },
    { id: 'analytics', label: 'Analytics', icon: FaClipboardList },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];
  // Mock data for the dashboard
  const dashboardData = {
    courseName: "AI Prompting Mastery",
    creatorName: currentUser?.name || "Guy",
    
    // Action items
    actionItems: [
      { type: 'certification', count: 3, label: 'certification requests waiting', icon: FaGraduationCap },
      { type: 'payout', count: 2, label: 'payouts ready for approval', icon: FaDollarSign },
      { type: 'application', count: 1, label: 'Student-Teacher application', icon: FaChalkboardTeacher }
    ],
    
    // Key metrics
    metrics: [
      { value: 24, label: 'Students', sublabel: 'Enrolled', change: '+4', changeLabel: 'this week', icon: FaUsers },
      { value: 18, label: 'Active', sublabel: 'Learners', change: '+2', changeLabel: 'this week', icon: FaChartLine },
      { value: '$10,800', label: 'Revenue', sublabel: '(Total)', change: '+$1,800', changeLabel: 'this week', icon: FaDollarSign },
      { value: 5, label: 'S-Teachers', sublabel: 'Active', change: '+1', changeLabel: 'this week', icon: FaChalkboardTeacher },
      { value: '75%', label: 'Completion', sublabel: 'Rate', change: '+5%', changeLabel: 'vs last wk', icon: FaCheckCircle }
    ],
    
    // Upcoming sessions
    sessions: [
      { time: 'Dec 6, 2024 · 10:00 AM', student: 'Sarah Johnson', teacher: 'Marcus Chen', module: 'Module 3' },
      { time: 'Dec 6, 2024 · 2:00 PM', student: 'Mike Chen', teacher: 'Jessica Torres', module: 'Module 2' },
      { time: 'Dec 7, 2024 · 7:00 PM', student: 'Alex Rivera', teacher: 'Marcus Chen', module: 'Module 4' }
    ],
    
    // Module progress
    moduleProgress: [
      { name: 'Module 1', completed: 24, total: 24 },
      { name: 'Module 2', completed: 18, total: 24 },
      { name: 'Module 3', completed: 12, total: 24 },
      { name: 'Module 4', completed: 6, total: 24 },
      { name: 'Module 5', completed: 3, total: 24 }
    ],
    
    // Revenue breakdown
    revenue: {
      totalCollected: 3600,
      enrollments: 8,
      pricePerEnrollment: 450,
      creatorEarnings: 540,
      platformFee: 540,
      stPayouts: 2520
    }
  };

  const bgPrimary = isDarkMode ? '#000' : '#fff';
  const bgSecondary = isDarkMode ? '#16181c' : '#f8fafc';
  const bgCard = isDarkMode ? '#16181c' : '#fff';
  const textPrimary = isDarkMode ? '#e7e9ea' : '#0f172a';
  const textSecondary = isDarkMode ? '#71767b' : '#64748b';
  const borderColor = isDarkMode ? '#2f3336' : '#e2e8f0';
  const accentBlue = '#1d9bf0';
  const accentGreen = '#00ba7c';
  const accentOrange = '#f97316';
  const accentRed = '#ef4444';

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
          ∞ <span style={{ color: textPrimary }}>Creator</span>
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
                padding: '8px 14px',
                background: activeTab === tab.id ? (isDarkMode ? '#2f3336' : '#e2e8f0') : 'transparent',
                border: 'none',
                borderRadius: 8,
                color: activeTab === tab.id ? accentBlue : textSecondary,
                fontSize: 13,
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
            background: accentBlue,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700
          }}>
            {dashboardData.creatorName.charAt(0)}
          </div>
          {dashboardData.creatorName}
          <FaChevronDown style={{ fontSize: 10, color: textSecondary }} />
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: 24 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            color: textPrimary, 
            margin: '0 0 8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            👋 Welcome back, {dashboardData.creatorName}
          </h1>
          <p style={{ 
            fontSize: 16, 
            color: textSecondary, 
            margin: 0 
          }}>
            {dashboardData.courseName}
          </p>
        </div>

      {/* Action Required Section - Twitter Style */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ 
          fontSize: 15, 
          fontWeight: 700, 
          color: textPrimary, 
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <FaBell style={{ color: accentRed }} /> Action Required
        </div>
        
        {dashboardData.actionItems.map((item, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '12px 0',
              borderBottom: index < dashboardData.actionItems.length - 1 ? `1px solid ${borderColor}` : 'none',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: isDarkMode ? '#2f3336' : '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              flexShrink: 0
            }}>
              <item.icon style={{ color: accentBlue, fontSize: 16 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: 2
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ 
                    fontWeight: 700, 
                    color: textPrimary, 
                    fontSize: 15 
                  }}>
                    {item.type === 'certification' && 'Certifications'}
                    {item.type === 'payout' && 'Payouts'}
                    {item.type === 'application' && 'Applications'}
                  </span>
                  <span style={{ 
                    color: textSecondary, 
                    fontSize: 14 
                  }}>
                    · {item.count} pending
                  </span>
                </div>
                <span style={{ 
                  color: accentBlue, 
                  fontSize: 13
                }}>
                  Review →
                </span>
              </div>
              <p style={{ 
                color: textSecondary, 
                fontSize: 14, 
                margin: 0,
                lineHeight: 1.4
              }}>
                {item.count} {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Key Metrics */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ 
          fontSize: 13, 
          fontWeight: 700, 
          color: textSecondary, 
          margin: '0 0 12px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          📊 Key Metrics
        </h2>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 10
        }}>
          {dashboardData.metrics.map((metric, index) => (
            <div 
              key={index}
              style={{
                background: bgCard,
                borderRadius: 8,
                padding: '10px 14px',
                border: `1px solid ${borderColor}`,
                textAlign: 'center',
                minWidth: 90
              }}
            >
              <div style={{ 
                fontSize: 18, 
                fontWeight: 700, 
                color: textPrimary,
                marginBottom: 2
              }}>
                {metric.value}
              </div>
              <div style={{ 
                fontSize: 11, 
                color: textSecondary,
                marginBottom: 1
              }}>
                {metric.label}
              </div>
              <div style={{ 
                fontSize: 10, 
                color: textSecondary,
                marginBottom: 4
              }}>
                {metric.sublabel}
              </div>
              <div style={{ 
                fontSize: 10, 
                color: accentGreen,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}>
                <FaArrowUp style={{ fontSize: 8 }} />
                {metric.change}
                <span style={{ color: textSecondary, marginLeft: 4 }}>{metric.changeLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions - Twitter Style */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ 
          fontSize: 15, 
          fontWeight: 700, 
          color: textPrimary, 
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          📅 Upcoming Sessions
        </div>
        
        {dashboardData.sessions.map((session, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '12px 0',
              borderBottom: index < dashboardData.sessions.length - 1 ? `1px solid ${borderColor}` : 'none',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: isDarkMode ? '#2f3336' : '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              flexShrink: 0
            }}>
              <FaVideo style={{ color: accentBlue, fontSize: 16 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: 2
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ 
                    fontWeight: 700, 
                    color: textPrimary, 
                    fontSize: 15 
                  }}>
                    {session.student}
                  </span>
                  <span style={{ 
                    color: textSecondary, 
                    fontSize: 14 
                  }}>
                    · {session.time}
                  </span>
                </div>
                <span style={{ 
                  color: accentBlue, 
                  fontSize: 13
                }}>
                  Join →
                </span>
              </div>
              <p style={{ 
                color: textSecondary, 
                fontSize: 14, 
                margin: 0,
                lineHeight: 1.4
              }}>
                {session.module} with {session.teacher}
              </p>
            </div>
          </div>
        ))}
        
        <div style={{ 
          paddingTop: 12,
          borderTop: `1px solid ${borderColor}`,
          marginTop: 4
        }}>
          <span style={{ 
            color: accentBlue, 
            fontSize: 13,
            cursor: 'pointer'
          }}>
            View All Sessions →
          </span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 24
      }}>
        {/* Student Progress Snapshot */}
        <div>
          <h2 style={{ 
            fontSize: 14, 
            fontWeight: 700, 
            color: textSecondary, 
            margin: '0 0 16px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            📈 Student Progress Snapshot
          </h2>
          <div style={{
            background: bgCard,
            borderRadius: 12,
            padding: 20,
            border: `1px solid ${borderColor}`
          }}>
            {dashboardData.moduleProgress.map((module, index) => {
              const percentage = Math.round((module.completed / module.total) * 100);
              return (
                <div key={index} style={{ marginBottom: index < dashboardData.moduleProgress.length - 1 ? 16 : 0 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: 6,
                    fontSize: 13,
                    color: textPrimary
                  }}>
                    <span>{module.name}</span>
                    <span style={{ color: textSecondary }}>{module.completed} completed</span>
                  </div>
                  <div style={{
                    height: 8,
                    background: isDarkMode ? '#2f3336' : '#e2e8f0',
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background: accentBlue,
                      borderRadius: 4,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue This Month */}
        <div>
          <h2 style={{ 
            fontSize: 14, 
            fontWeight: 700, 
            color: textSecondary, 
            margin: '0 0 16px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            💰 Revenue This Month
          </h2>
          <div style={{
            background: bgCard,
            borderRadius: 12,
            padding: 20,
            border: `1px solid ${borderColor}`
          }}>
            <div style={{ 
              fontSize: 14, 
              color: textSecondary, 
              marginBottom: 16 
            }}>
              Total Collected: <strong style={{ color: textPrimary, fontSize: 18 }}>
                ${dashboardData.revenue.totalCollected.toLocaleString()}
              </strong>
              <span style={{ fontSize: 12, marginLeft: 8 }}>
                ({dashboardData.revenue.enrollments} enrollments × ${dashboardData.revenue.pricePerEnrollment})
              </span>
            </div>
            
            <div style={{ 
              borderTop: `1px solid ${borderColor}`, 
              paddingTop: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: 14
              }}>
                <span style={{ color: accentGreen }}>Your Earnings (15%):</span>
                <strong style={{ color: accentGreen }}>${dashboardData.revenue.creatorEarnings}</strong>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: 14
              }}>
                <span style={{ color: textSecondary }}>Platform Fee (15%):</span>
                <span style={{ color: textSecondary }}>${dashboardData.revenue.platformFee}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: 14
              }}>
                <span style={{ color: textSecondary }}>S-T Payouts (70%):</span>
                <span style={{ color: textSecondary }}>${dashboardData.revenue.stPayouts.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ 
              marginTop: 20, 
              paddingTop: 16, 
              borderTop: `1px solid ${borderColor}`,
              textAlign: 'center'
            }}>
              <button style={{
                background: 'none',
                border: 'none',
                color: accentBlue,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}>
                View Full Revenue Report <FaArrowRight style={{ fontSize: 12 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;




