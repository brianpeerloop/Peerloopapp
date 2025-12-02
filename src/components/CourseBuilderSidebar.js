import React from 'react';
import { useDrag } from 'react-dnd';
import { 
  FaBook,
  FaFileAlt,
  FaVideo,
  FaImage,
  FaLink,
  FaQuestionCircle,
  FaComments,
  FaCode,
  FaChartBar
} from 'react-icons/fa';
import './CourseBuilderSidebar.css';

// Draggable Tool Item Component
const DraggableTool = ({ type, icon, label, description, onAddModule, onAddLesson, onAddContent }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TOOL',
    item: { type, icon, label },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        if (item.type === 'module') {
          onAddModule();
        } else if (item.type === 'lesson') {
          onAddLesson(dropResult.moduleId);
        } else {
          onAddContent(item.type);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`tool-item ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="tool-icon">{icon}</div>
      <div className="tool-content">
        <div className="tool-label">{label}</div>
        <div className="tool-description">{description}</div>
      </div>
    </div>
  );
};

const CourseBuilderSidebar = ({ onAddModule, onAddLesson, onAddContent }) => {
  const tools = [
    {
      type: 'module',
      icon: <FaBook />,
      label: 'Module',
      description: 'Container for lessons'
    },
    {
      type: 'lesson',
      icon: <FaFileAlt />,
      label: 'Lesson',
      description: 'Individual content block'
    },
    {
      type: 'video',
      icon: <FaVideo />,
      label: 'Video',
      description: 'Upload or embed video'
    },
    {
      type: 'image',
      icon: <FaImage />,
      label: 'Image',
      description: 'Add images or graphics'
    },
    {
      type: 'link',
      icon: <FaLink />,
      label: 'Link',
      description: 'Embed external content'
    },
    {
      type: 'quiz',
      icon: <FaQuestionCircle />,
      label: 'Quiz',
      description: 'Assessment template'
    },
    {
      type: 'discussion',
      icon: <FaComments />,
      label: 'Discussion',
      description: 'Student interaction'
    },
    {
      type: 'code',
      icon: <FaCode />,
      label: 'Code Block',
      description: 'Code examples'
    },
    {
      type: 'chart',
      icon: <FaChartBar />,
      label: 'Chart',
      description: 'Data visualization'
    }
  ];

  return (
    <div className="course-builder-sidebar">
      <div className="sidebar-header">
        <h3>Toolbox</h3>
        <p>Drag items to build your course</p>
      </div>
      
      <div className="tools-section">
        <div className="section-title">Course Structure</div>
        <div className="tools-grid">
          {tools.slice(0, 2).map((tool) => (
            <DraggableTool
              key={tool.type}
              {...tool}
              onAddModule={onAddModule}
              onAddLesson={onAddLesson}
              onAddContent={onAddContent}
            />
          ))}
        </div>
      </div>

      <div className="tools-section">
        <div className="section-title">Content Types</div>
        <div className="tools-grid">
          {tools.slice(2, 6).map((tool) => (
            <DraggableTool
              key={tool.type}
              {...tool}
              onAddModule={onAddModule}
              onAddLesson={onAddLesson}
              onAddContent={onAddContent}
            />
          ))}
        </div>
      </div>

      <div className="tools-section">
        <div className="section-title">Interactive Elements</div>
        <div className="tools-grid">
          {tools.slice(6).map((tool) => (
            <DraggableTool
              key={tool.type}
              {...tool}
              onAddModule={onAddModule}
              onAddLesson={onAddLesson}
              onAddContent={onAddContent}
            />
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="quick-tips">
          <h4>Quick Tips</h4>
          <ul>
            <li>Drag modules to organize content</li>
            <li>Add lessons within modules</li>
            <li>Use assessments to test knowledge</li>
            <li>Preview as students see it</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilderSidebar; 