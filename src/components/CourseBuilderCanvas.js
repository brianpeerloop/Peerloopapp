import React from 'react';
import { useDrop } from 'react-dnd';
import { 
  FaGripVertical,
  FaEdit,
  FaTrash,
  FaPlus,
  FaChevronDown,
  FaChevronRight,
  FaCheck,
  FaExclamationTriangle
} from 'react-icons/fa';
import './CourseBuilderCanvas.css';

// Draggable Module Component
const DraggableModule = ({ 
  module, 
  onUpdateItem, 
  onDeleteItem, 
  onSelectModule, 
  selectedModule,
  onAddLesson 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(module.title);

  const handleSave = () => {
    onUpdateItem('module', module.id, { title: editTitle });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(module.title);
    setIsEditing(false);
  };

  return (
    <div className={`module-card ${selectedModule?.id === module.id ? 'selected' : ''}`}>
      <div className="module-header">
        <div className="module-drag-handle">
          <FaGripVertical />
        </div>
        
        <div className="module-toggle" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
        </div>
        
        <div className="module-content" onClick={() => onSelectModule(module)}>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              className="module-title-input"
              autoFocus
            />
          ) : (
            <div className="module-title">{module.title}</div>
          )}
          
          <div className="module-status">
            {module.completed ? (
              <span className="status-completed">
                <FaCheck /> Complete
              </span>
            ) : (
              <span className="status-draft">
                <FaExclamationTriangle /> Draft
              </span>
            )}
          </div>
        </div>
        
        <div className="module-actions">
          <button 
            className="action-btn edit-btn"
            onClick={() => setIsEditing(true)}
            title="Edit module"
          >
            <FaEdit />
          </button>
          <button 
            className="action-btn add-btn"
            onClick={() => onAddLesson(module.id)}
            title="Add lesson"
          >
            <FaPlus />
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => onDeleteItem('module', module.id)}
            title="Delete module"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="module-lessons">
          {module.lessons.map((lesson) => (
            <DraggableLesson
              key={lesson.id}
              lesson={lesson}
              moduleId={module.id}
              onUpdateItem={onUpdateItem}
              onDeleteItem={onDeleteItem}
              onSelectLesson={onSelectLesson}
              selectedLesson={selectedLesson}
            />
          ))}
          
          {module.lessons.length === 0 && (
            <div className="empty-lessons">
              <p>No lessons yet. Add a lesson to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Draggable Lesson Component
const DraggableLesson = ({ 
  lesson, 
  moduleId, 
  onUpdateItem, 
  onDeleteItem, 
  onSelectLesson, 
  selectedLesson 
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(lesson.title);

  const handleSave = () => {
    onUpdateItem('lesson', lesson.id, { title: editTitle });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(lesson.title);
    setIsEditing(false);
  };

  return (
    <div className={`lesson-card ${selectedLesson?.id === lesson.id ? 'selected' : ''}`}>
      <div className="lesson-header">
        <div className="lesson-drag-handle">
          <FaGripVertical />
        </div>
        
        <div className="lesson-content" onClick={() => onSelectLesson(lesson)}>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              className="lesson-title-input"
              autoFocus
            />
          ) : (
            <div className="lesson-title">{lesson.title}</div>
          )}
          
          <div className="lesson-status">
            {lesson.content && lesson.content.length > 0 ? (
              <span className="status-completed">
                <FaCheck /> {lesson.content.length} items
              </span>
            ) : (
              <span className="status-draft">
                <FaExclamationTriangle /> Empty
              </span>
            )}
          </div>
        </div>
        
        <div className="lesson-actions">
          <button 
            className="action-btn edit-btn"
            onClick={() => setIsEditing(true)}
            title="Edit lesson"
          >
            <FaEdit />
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => onDeleteItem('lesson', lesson.id)}
            title="Delete lesson"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      {lesson.content && lesson.content.length > 0 && (
        <div className="lesson-content-preview">
          {lesson.content.map((item, index) => (
            <div key={index} className="content-item-preview">
              <span className="content-type">{item.type}</span>
              <span className="content-title">{item.title || item.url}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CourseBuilderCanvas = ({
  courseData,
  onUpdateItem,
  onDeleteItem,
  onAddContentToLesson,
  onSelectModule,
  onSelectLesson,
  selectedModule,
  selectedLesson,
  onAddLesson
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TOOL',
    drop: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      return { ...dropResult, moduleId: null };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop}
      className={`course-builder-canvas ${isOver ? 'drag-over' : ''}`}
    >
      <div className="canvas-header">
        <h2>Course Structure</h2>
        <p>Drag items from the toolbox to build your course</p>
      </div>
      
      <div className="canvas-content">
        {courseData.modules.length === 0 ? (
          <div className="empty-canvas">
            <div className="empty-state">
              <h3>Start Building Your Course</h3>
              <p>Drag a module from the toolbox to begin creating your course structure.</p>
              <div className="empty-actions">
                <button className="add-module-btn">
                  <FaPlus />
                  Add First Module
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="modules-list">
            {courseData.modules.map((module) => (
              <DraggableModule
                key={module.id}
                module={module}
                onUpdateItem={onUpdateItem}
                onDeleteItem={onDeleteItem}
                onSelectModule={onSelectModule}
                selectedModule={selectedModule}
                onAddLesson={onAddLesson}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseBuilderCanvas; 