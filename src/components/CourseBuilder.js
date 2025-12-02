import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './CourseBuilder.css';
import { 
  FaPlus,
  FaSave,
  FaEye,
  FaPlay,
  FaDownload,
  FaTimes,
  FaEdit,
  FaTrash,
  FaGripVertical,
  FaVideo,
  FaFileAlt,
  FaImage,
  FaLink,
  FaCheck,
  FaExclamationTriangle
} from 'react-icons/fa';
import CourseBuilderSidebar from './CourseBuilderSidebar';
import CourseBuilderCanvas from './CourseBuilderCanvas';
import CourseBuilderPreview from './CourseBuilderPreview';
import MediaUploadModal from './MediaUploadModal';

const CourseBuilder = ({ onBackToCreator }) => {
  const [courseData, setCourseData] = useState({
    title: 'Untitled Course',
    description: '',
    modules: [],
    status: 'draft',
    progress: 0
  });

  const [activeModal, setActiveModal] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Calculate course progress
  const calculateProgress = useCallback((modules) => {
    if (modules.length === 0) return 0;
    
    let totalElements = 0;
    let completedElements = 0;
    
    modules.forEach(module => {
      totalElements += 1; // Module itself
      if (module.lessons) {
        totalElements += module.lessons.length;
        module.lessons.forEach(lesson => {
          if (lesson.content && lesson.content.length > 0) {
            completedElements += 1;
          }
        });
      }
      if (module.completed) completedElements += 1;
    });
    
    return Math.round((completedElements / totalElements) * 100);
  }, []);

  // Update progress when course data changes
  useEffect(() => {
    const progress = calculateProgress(courseData.modules);
    setCourseData(prev => ({ ...prev, progress }));
  }, [courseData.modules, calculateProgress]);

  // Add new module
  const addModule = useCallback(() => {
    const newModule = {
      id: `module-${Date.now()}`,
      title: `Module ${courseData.modules.length + 1}`,
      description: '',
      lessons: [],
      completed: false,
      prerequisites: []
    };
    
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
  }, [courseData.modules.length]);

  // Add new lesson to module
  const addLesson = useCallback((moduleId) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module => {
        if (module.id === moduleId) {
          const newLesson = {
            id: `lesson-${Date.now()}`,
            title: `Lesson ${module.lessons.length + 1}`,
            content: [],
            completed: false,
            type: 'lesson'
          };
          return {
            ...module,
            lessons: [...module.lessons, newLesson]
          };
        }
        return module;
      })
    }));
  }, []);

  // Add content to lesson
  const addContentToLesson = useCallback((moduleId, lessonId, content) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: module.lessons.map(lesson => {
              if (lesson.id === lessonId) {
                return {
                  ...lesson,
                  content: [...lesson.content, content]
                };
              }
              return lesson;
            })
          };
        }
        return module;
      })
    }));
  }, []);

  // Update module or lesson
  const updateItem = useCallback((type, id, updates) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module => {
        if (type === 'module' && module.id === id) {
          return { ...module, ...updates };
        }
        if (type === 'lesson') {
          return {
            ...module,
            lessons: module.lessons.map(lesson => {
              if (lesson.id === id) {
                return { ...lesson, ...updates };
              }
              return lesson;
            })
          };
        }
        return module;
      })
    }));
  }, []);

  // Delete module or lesson
  const deleteItem = useCallback((type, id) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.filter(module => {
        if (type === 'module') {
          return module.id !== id;
        }
        return true;
      }).map(module => ({
        ...module,
        lessons: module.lessons.filter(lesson => {
          if (type === 'lesson') {
            return lesson.id !== id;
          }
          return true;
        })
      }))
    }));
  }, []);

  // Save draft
  const saveDraft = useCallback(() => {
    const updatedProgress = calculateProgress(courseData.modules);
    setCourseData(prev => ({
      ...prev,
      status: 'draft',
      progress: updatedProgress
    }));
    // Here you would typically save to backend
    console.log('Saving draft:', courseData);
  }, [courseData, calculateProgress]);

  // Publish course
  const publishCourse = useCallback(() => {
    const updatedProgress = calculateProgress(courseData.modules);
    setCourseData(prev => ({
      ...prev,
      status: 'published',
      progress: updatedProgress
    }));
    // Here you would typically publish to backend
    console.log('Publishing course:', courseData);
  }, [courseData, calculateProgress]);

  // Export course
  const exportCourse = useCallback(() => {
    // Here you would typically export to PDF
    console.log('Exporting course:', courseData);
  }, [courseData]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="course-builder">
        {/* Top Bar */}
        <div className="course-builder-topbar">
          <div className="topbar-left">
            <button className="back-btn" onClick={onBackToCreator}>
              <FaTimes />
              Back to Creator
            </button>
            <div className="course-title">
              <input
                type="text"
                value={courseData.title}
                onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter course title..."
                className="course-title-input"
              />
            </div>
          </div>
          
          <div className="topbar-center">
            <div className="progress-indicator">
              <div 
                className="progress-circle"
                style={{ '--progress': courseData.progress }}
              >
                <div className="progress-value">{courseData.progress}%</div>
                <div className="progress-label">Ready</div>
              </div>
              <div className="progress-message">
                {courseData.progress < 30 && 'Add Course Content'}
                {courseData.progress >= 30 && courseData.progress < 70 && 'Add Assessments'}
                {courseData.progress >= 70 && courseData.progress < 100 && 'Review & Polish'}
                {courseData.progress === 100 && 'Ready to Publish'}
              </div>
            </div>
          </div>
          
          <div className="topbar-right">
            <button className="action-btn save-btn" onClick={saveDraft}>
              <FaSave />
              Save Draft
            </button>
            <button className="action-btn preview-btn" onClick={() => setPreviewMode(!previewMode)}>
              <FaEye />
              Preview
            </button>
            <button className="action-btn publish-btn" onClick={publishCourse}>
              <FaPlay />
              Publish
            </button>
            <button className="action-btn export-btn" onClick={exportCourse}>
              <FaDownload />
              Export
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="course-builder-content">
          {/* Left Sidebar - Toolbox */}
          <CourseBuilderSidebar
            onAddModule={addModule}
            onAddLesson={addLesson}
            onAddContent={(type) => setActiveModal(type)}
          />

          {/* Central Canvas */}
          <CourseBuilderCanvas
            courseData={courseData}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
            onAddContentToLesson={addContentToLesson}
            onSelectModule={setSelectedModule}
            onSelectLesson={setSelectedLesson}
            selectedModule={selectedModule}
            selectedLesson={selectedLesson}
            onAddLesson={addLesson}
          />

          {/* Right Preview Pane */}
          <CourseBuilderPreview
            courseData={courseData}
            previewMode={previewMode}
          />
        </div>

        {/* Modals */}
        {activeModal && (
          <MediaUploadModal
            type={activeModal}
            onClose={() => setActiveModal(null)}
            onAddContent={(content) => {
              if (selectedLesson) {
                addContentToLesson(selectedModule.id, selectedLesson.id, content);
              }
              setActiveModal(null);
            }}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default CourseBuilder; 