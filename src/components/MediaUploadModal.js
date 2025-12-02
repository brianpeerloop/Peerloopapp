import React, { useState, useRef } from 'react';
import { 
  FaTimes,
  FaUpload,
  FaLink,
  FaVideo,
  FaImage,
  FaFileAlt,
  FaYoutube,
  FaVimeo,
  FaPlay,
  FaEye
} from 'react-icons/fa';
import './MediaUploadModal.css';

const MediaUploadModal = ({ type, onClose, onAddContent }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedTitle, setEmbedTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const newFiles = Array.from(files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploaded: true
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
    }, 1000);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleEmbed = () => {
    if (embedUrl.trim()) {
      const content = {
        type: 'link',
        url: embedUrl,
        title: embedTitle || 'Embedded Content',
        embedType: getEmbedType(embedUrl)
      };
      onAddContent(content);
    }
  };

  const getEmbedType = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    if (url.includes('docs.google.com')) return 'google-docs';
    return 'link';
  };

  const handleAddContent = (content) => {
    onAddContent(content);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type) => {
    if (type.startsWith('video/')) return <FaVideo />;
    if (type.startsWith('image/')) return <FaImage />;
    return <FaFileAlt />;
  };

  const getTypeLabel = (type) => {
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('image/')) return 'Image';
    return 'File';
  };

  return (
    <div className="media-upload-modal-overlay" onClick={onClose}>
      <div className="media-upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add {type === 'video' ? 'Video' : type === 'image' ? 'Image' : 'Content'}</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <FaUpload />
            Upload
          </button>
          <button 
            className={`tab-btn ${activeTab === 'embed' ? 'active' : ''}`}
            onClick={() => setActiveTab('embed')}
          >
            <FaLink />
            Embed
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'upload' && (
            <div className="upload-section">
              <div 
                className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={type === 'video' ? 'video/*' : type === 'image' ? 'image/*' : '*/*'}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                
                <div className="upload-icon">
                  <FaUpload />
                </div>
                <h4>Drag files here or click to browse</h4>
                <p>Maximum file size: 100MB</p>
                {isUploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div className="progress-fill"></div>
                    </div>
                    <span>Uploading...</span>
                  </div>
                )}
              </div>

              {uploadedFiles.length > 0 && (
                <div className="uploaded-files">
                  <h4>Uploaded Files</h4>
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="file-item">
                      <div className="file-icon">
                        {getTypeIcon(file.type)}
                      </div>
                      <div className="file-info">
                        <div className="file-name">{file.name}</div>
                        <div className="file-size">{formatFileSize(file.size)}</div>
                      </div>
                      <div className="file-actions">
                        <button 
                          className="add-btn"
                          onClick={() => handleAddContent({
                            type: getTypeLabel(file.type).toLowerCase(),
                            title: file.name,
                            url: file.url,
                            size: file.size
                          })}
                        >
                          Add
                        </button>
                        <button 
                          className="remove-btn"
                          onClick={() => removeFile(file.id)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="embed-section">
              <div className="embed-inputs">
                <div className="input-group">
                  <label>URL</label>
                  <input
                    type="url"
                    placeholder="Paste YouTube, Vimeo, or other URL..."
                    value={embedUrl}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Title (optional)</label>
                  <input
                    type="text"
                    placeholder="Enter a title for this content..."
                    value={embedTitle}
                    onChange={(e) => setEmbedTitle(e.target.value)}
                  />
                </div>
              </div>

              {embedUrl && (
                <div className="embed-preview">
                  <h4>Preview</h4>
                  <div className="preview-content">
                    {embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be') ? (
                      <div className="youtube-preview">
                        <FaYoutube />
                        <span>YouTube Video</span>
                      </div>
                    ) : embedUrl.includes('vimeo.com') ? (
                      <div className="vimeo-preview">
                        <FaVimeo />
                        <span>Vimeo Video</span>
                      </div>
                    ) : embedUrl.includes('docs.google.com') ? (
                      <div className="docs-preview">
                        <FaFileAlt />
                        <span>Google Docs</span>
                      </div>
                    ) : (
                      <div className="link-preview">
                        <FaLink />
                        <span>External Link</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="embed-actions">
                <button 
                  className="embed-btn"
                  onClick={handleEmbed}
                  disabled={!embedUrl.trim()}
                >
                  <FaLink />
                  Embed Content
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaUploadModal; 