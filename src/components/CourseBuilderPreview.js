import React, { useState } from 'react';
import { 
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaEye,
  FaEyeSlash,
  FaMobile,
  FaDesktop
} from 'react-icons/fa';
import './CourseBuilderPreview.css';

const CourseBuilderPreview = ({ courseData, previewMode }) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  // Get all lessons from all modules
  const allLessons = courseData.modules.flatMap(module => 
    module.lessons.map(lesson => ({
      ...lesson,
      moduleTitle: module.title
    }))
  );

  const currentLesson = allLessons[currentLessonIndex];
  const currentModule = courseData.modules[currentModuleIndex];

  const nextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const prevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const togglePreviewDevice = () => {
    setPreviewDevice(previewDevice === 'desktop' ? 'mobile' : 'desktop');
  };

  if (!previewMode) {
    return (
      <div className="course-builder-preview">
        <div className="preview-header">
          <h3>Preview</h3>
          <p>Click "Preview" to see how students will experience your course</p>
        </div>
        <div className="preview-placeholder">
          <div className="preview-icon">
            <FaEye />
          </div>
          <h4>Student View</h4>
          <p>Preview your course as students will see it</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`course-builder-preview ${previewDevice}`}>
      <div className="preview-header">
        <div className="preview-controls">
          <button 
            className="device-toggle"
            onClick={togglePreviewDevice}
            title={`Switch to ${previewDevice === 'desktop' ? 'mobile' : 'desktop'} view`}
          >
            {previewDevice === 'desktop' ? <FaMobile /> : <FaDesktop />}
          </button>
          <div className="preview-title">
            <h3>Student Preview</h3>
            <span className="preview-subtitle">
              {currentLessonIndex + 1} of {allLessons.length} lessons
            </span>
          </div>
        </div>
        
        <div className="preview-navigation">
          <button 
            className="nav-btn"
            onClick={prevLesson}
            disabled={currentLessonIndex === 0}
          >
            <FaStepBackward />
          </button>
          <button 
            className="play-btn"
            onClick={togglePlay}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button 
            className="nav-btn"
            onClick={nextLesson}
            disabled={currentLessonIndex === allLessons.length - 1}
          >
            <FaStepForward />
          </button>
        </div>
      </div>

      <div className="preview-content">
        {courseData.modules.length === 0 ? (
          <div className="preview-empty">
            <h4>No Course Content</h4>
            <p>Add modules and lessons to see the preview</p>
          </div>
        ) : (
          <div className="preview-lesson">
            <div className="lesson-header">
              <div className="lesson-breadcrumb">
                {currentModule?.title} / {currentLesson?.title}
              </div>
              <div className="lesson-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${((currentLessonIndex + 1) / allLessons.length) * 100}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {Math.round(((currentLessonIndex + 1) / allLessons.length) * 100)}% Complete
                </span>
              </div>
            </div>

            <div className="lesson-content">
              {currentLesson ? (
                <>
                  <h2>{currentLesson.title}</h2>
                  
                  {currentLesson.content && currentLesson.content.length > 0 ? (
                    <div className="content-items">
                      {currentLesson.content.map((item, index) => (
                        <div key={index} className="content-item">
                          <div className="content-type-badge">{item.type}</div>
                          <div className="content-display">
                            {item.type === 'video' && (
                              <div className="video-placeholder">
                                <FaPlay />
                                <span>Video: {item.title || 'Untitled Video'}</span>
                              </div>
                            )}
                            {item.type === 'image' && (
                              <div className="image-placeholder">
                                <span>Image: {item.title || 'Untitled Image'}</span>
                              </div>
                            )}
                            {item.type === 'link' && (
                              <div className="link-placeholder">
                                <span>Link: {item.url}</span>
                              </div>
                            )}
                            {item.type === 'quiz' && (
                              <div className="quiz-placeholder">
                                <span>Quiz: {item.title || 'Assessment'}</span>
                              </div>
                            )}
                            {item.type === 'text' && (
                              <div className="text-content">
                                <p>{item.content || 'Text content will appear here...'}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-content">
                      <p>No content added to this lesson yet.</p>
                      <p>Add videos, images, or text to see them here.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-lesson">
                  <h3>No Lesson Selected</h3>
                  <p>Select a lesson from the course structure to preview it.</p>
                </div>
              )}
            </div>

            <div className="lesson-navigation">
              <button 
                className="nav-btn secondary"
                onClick={prevLesson}
                disabled={currentLessonIndex === 0}
              >
                Previous Lesson
              </button>
              <button 
                className="nav-btn primary"
                onClick={nextLesson}
                disabled={currentLessonIndex === allLessons.length - 1}
              >
                Next Lesson
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseBuilderPreview; 