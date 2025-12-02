# Light Speed Learning Interface

A React-based learning platform interface that mimics the design patterns of X.com (Twitter) but is specifically designed for educational content. The application provides a comprehensive learning management system with course browsing, instructor profiles, community features, user dashboards, and now includes a powerful course builder.

## New Course Builder Features

### 🎯 Drag-and-Drop Course Builder
- **Full-screen editor** with left sidebar (toolbox), central canvas, and right preview pane
- **Drag-and-drop interface** for building course structure with modules and lessons
- **Real-time preview** showing how students will experience the course
- **Progress tracking** with visual indicators and completion status

### 🛠️ Course Creation Tools
- **Module Management**: Create and organize course modules with collapsible accordions
- **Lesson Builder**: Add individual lessons with various content types
- **Media Integration**: Upload videos, images, and documents or embed external content
- **Assessment Tools**: Add quizzes and interactive elements
- **Content Templates**: Pre-built templates for common course elements

### 📱 Responsive Design
- **Mobile-friendly** interface that adapts to different screen sizes
- **Touch-optimized** drag-and-drop for mobile devices
- **Preview modes** for desktop and mobile student views

### 🎨 Modern UI/UX
- **Clean, minimalist design** inspired by Notion and WordPress Gutenberg
- **Intuitive interface** for non-technical course creators
- **Visual feedback** with hover states, animations, and progress indicators
- **Color-coded status** (green for completed, yellow for drafts)

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Course Builder Usage

### Accessing the Course Builder
1. Navigate to the Creator Profile section
2. Click "Create New Course" or "Open Course Builder"
3. The full-screen course builder will open

### Building a Course
1. **Add Modules**: Drag "Module" from the toolbox to the canvas
2. **Add Lessons**: Drag "Lesson" into modules or use the "+" button
3. **Add Content**: Click on lessons to add videos, images, or other content
4. **Preview**: Use the preview pane to see how students will experience the course
5. **Save & Publish**: Use the top bar actions to save drafts or publish

### Content Types Supported
- **Videos**: Upload MP4, MOV, or embed YouTube/Vimeo
- **Images**: Upload JPG, PNG, GIF with automatic compression
- **Documents**: Upload PDFs, Word docs, or embed Google Docs
- **Links**: Embed external resources and websites
- **Quizzes**: Create assessments with multiple choice questions
- **Text**: Rich text content with formatting

## Project Structure

```
src/
├── components/
│   ├── CourseBuilder.js          # Main course builder component
│   ├── CourseBuilderCanvas.js    # Drag-and-drop canvas
│   ├── CourseBuilderSidebar.js   # Toolbox with draggable items
│   ├── CourseBuilderPreview.js   # Student preview pane
│   ├── MediaUploadModal.js       # Upload and embed modal
│   └── ... (other components)
├── data/
│   └── database.js              # Mock data and helper functions
└── ... (other files)
```

## Key Features

### For Course Creators
- **No coding required** - intuitive drag-and-drop interface
- **Real-time preview** - see changes as you build
- **Progress tracking** - visual indicators of course completion
- **Media management** - easy upload and embedding
- **Assessment tools** - built-in quiz and evaluation features

### For Students
- **Clean learning interface** - optimized for focus and engagement
- **Progress tracking** - visual completion indicators
- **Mobile responsive** - learn on any device
- **Interactive content** - videos, quizzes, and discussions

## Technology Stack

- **Frontend**: React 18.2.0 with hooks
- **Drag & Drop**: react-dnd library
- **Styling**: CSS with modern design patterns
- **Icons**: React Icons (FontAwesome)
- **State Management**: React hooks and context

## Development

### Available Scripts
- `npm start` - Start development server
- `npm build` - Create production build
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Adding New Features
1. Create new components in `src/components/`
2. Add corresponding CSS files
3. Update the main App.js if needed
4. Test thoroughly across different screen sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Design inspired by X.com (Twitter) interface patterns
- Course builder inspired by Notion and WordPress Gutenberg
- Icons provided by React Icons (FontAwesome) 