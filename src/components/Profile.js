import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ currentUser, onSwitchUser, onMenuChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser?.name) return 'AS';
    return currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Alex Sanders',
    handle: currentUser?.username || '@alexsanders',
    email: `${(currentUser?.name || 'alex').toLowerCase().replace(/\s+/g, '.')}@peerloop.com`,
    bio: currentUser?.bio || 'Lifelong learner passionate about education.',
    location: currentUser?.location || 'San Francisco, CA',
    website: currentUser?.website || 'https://peerloop.com'
  });

  // Render back button header
  const renderHeader = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '1px solid var(--border-color, #2f3336)',
      position: 'sticky',
      top: 0,
      background: 'var(--bg-primary, #000)',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => onMenuChange('My Community')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary, #e7e9ea)',
            fontSize: 20,
            cursor: 'pointer',
            padding: 8,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
          title="Go back"
        >
          ←
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary, #e7e9ea)' }}>
            {profileData.name}
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary, #71767b)' }}>
            {currentUser?.stats?.coursesCompleted || 12} courses completed
          </p>
        </div>
      </div>
      
      {/* Edit Profile Button */}
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-color, #536471)',
            color: 'var(--text-primary, #e7e9ea)',
            padding: '8px 16px',
            borderRadius: 20,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          Edit profile
        </button>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleSave}
            style={{
              background: '#1d9bf0',
              border: 'none',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 20,
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color, #536471)',
              color: 'var(--text-primary, #e7e9ea)',
              padding: '8px 16px',
              borderRadius: 20,
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Profile saved:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
  };


  const renderOverview = () => (
    <div className="profile-overview">
      {/* Profile Header Banner - X.com Style */}
      <div style={{
        background: 'linear-gradient(135deg, #1d9bf0 0%, #0284c7 100%)',
        height: 150,
        borderRadius: '16px 16px 0 0',
        marginBottom: -60,
        position: 'relative'
      }} />
      
      {/* Avatar and Basic Info */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, padding: '0 24px', marginBottom: 20 }}>
        {/* Large Avatar */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: '#1d9bf0',
          border: '4px solid var(--bg-primary, #fff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 40,
          fontWeight: 700,
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {getUserInitials()}
        </div>
        
        {/* Name and Handle */}
        <div style={{ flex: 1, paddingBottom: 8 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
            {profileData.name}
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary, #64748b)', fontSize: 15 }}>
            {profileData.handle}
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {currentUser?.roles?.map(role => (
              <span key={role} style={{
                background: role === 'teacher' ? '#10b981' : role === 'student' ? '#1d9bf0' : role === 'creator' ? '#8b5cf6' : '#f59e0b',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'capitalize'
              }}>
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-details" style={{ padding: '0 24px' }}>
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Handle</label>
              <input 
                type="text" 
                value={profileData.handle}
                onChange={(e) => setProfileData({...profileData, handle: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea 
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input 
                type="url" 
                value={profileData.website}
                onChange={(e) => setProfileData({...profileData, website: e.target.value})}
              />
            </div>
          </div>
        ) : (
          <div className="profile-info-display">
            <p className="profile-bio" style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--text-primary, #334155)', marginBottom: 16 }}>
              {profileData.bio}
            </p>
            
            <div className="profile-meta" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16, color: 'var(--text-secondary, #64748b)', fontSize: 14 }}>
              <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                📍 {profileData.location}
              </div>
              <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                🔗 <a href={profileData.website} target="_blank" rel="noopener noreferrer" style={{ color: '#1d9bf0' }}>{profileData.website}</a>
              </div>
              <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                📅 Joined {currentUser?.joinedDate || 'March 2024'}
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: 16, 
              marginBottom: 24,
              padding: 16,
              background: 'var(--bg-secondary, #f8fafc)',
              borderRadius: 12
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1d9bf0' }}>{currentUser?.stats?.coursesCompleted || 12}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary, #64748b)' }}>Courses Done</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{currentUser?.stats?.coursesTeaching || 3}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary, #64748b)' }}>Teaching</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>{currentUser?.stats?.studentsHelped || 47}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary, #64748b)' }}>Students Helped</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#8b5cf6' }}>{currentUser?.stats?.hoursLearned || 156}h</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary, #64748b)' }}>Hours Learned</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#ec4899' }}>⭐ {currentUser?.stats?.avgRating || 4.9}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary, #64748b)' }}>Avg Rating</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#14b8a6' }}>${currentUser?.stats?.totalEarnings?.toLocaleString() || '2,340'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary, #64748b)' }}>Earned</div>
              </div>
            </div>

            {/* Expertise Tags */}
            {currentUser?.expertise && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary, #0f172a)' }}>Expertise</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {currentUser.expertise.map(skill => (
                    <span key={skill} style={{
                      background: 'var(--bg-secondary, #e2e8f0)',
                      color: 'var(--text-primary, #475569)',
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

            {/* Currently Learning */}
            {currentUser?.currentlyLearning && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary, #0f172a)' }}>📚 Currently Learning</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {currentUser.currentlyLearning.map(course => (
                    <div key={course} style={{
                      background: 'var(--bg-secondary, #f0f9ff)',
                      border: '1px solid #bae6fd',
                      padding: '12px 16px',
                      borderRadius: 8,
                      fontSize: 14,
                      color: '#0369a1'
                    }}>
                      {course}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {currentUser?.achievements && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary, #0f172a)' }}>🏆 Achievements</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {currentUser.achievements.map(achievement => (
                    <div key={achievement.id} style={{
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      border: '1px solid #fbbf24',
                      padding: '12px 16px',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      minWidth: 200
                    }}>
                      <span style={{ fontSize: 24 }}>{achievement.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#92400e' }}>{achievement.name}</div>
                        <div style={{ fontSize: 12, color: '#a16207' }}>{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="profile" style={{ background: 'var(--bg-primary, #000)', minHeight: '100vh' }}>
      {renderHeader()}
      <div className="profile-main" style={{ padding: 0 }}>
        {renderOverview()}
      </div>
    </div>
  );
};

export default Profile; 