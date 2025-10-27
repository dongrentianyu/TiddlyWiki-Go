import { useState } from "react";
import "./WikiViewer.css";

interface WikiViewerProps {
  url: string;
  name: string;
  path: string;
  onClose: () => void;
}

function WikiViewer({ url, name, path, onClose }: WikiViewerProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Extract folder name from path
  const folderName = path.split(/[/\\]/).pop() || name;

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    if (isMaximized) {
      setIsMaximized(false);
    } else {
      setIsMaximized(true);
      setIsMinimized(false);
    }
  };

  const handleRestore = () => {
    setIsMinimized(false);
    setIsMaximized(false);
  };

  return (
    <div className="wiki-viewer-overlay">
      <div
        className={`wiki-viewer-container ${
          isMinimized ? "minimized" : isMaximized ? "maximized" : "normal"
        }`}>
        <div
          className="wiki-viewer-header"
          data-wails-drag>
          <div className="wiki-viewer-title">
            <span>📁</span>
            <span>{folderName}</span>
            <span className="wiki-url-small">{url}</span>
          </div>
          <div className="wiki-viewer-controls">
            <button
              className="btn-viewer-control"
              onClick={handleMinimize}
              title="最小化"
              data-wails-no-drag>
              —
            </button>
            <button
              className="btn-viewer-control"
              onClick={handleMaximize}
              title={isMaximized ? "还原" : "最大化"}
              data-wails-no-drag>
              {isMaximized ? "❐" : "□"}
            </button>
            <button
              className="btn-viewer-close"
              onClick={onClose}
              title="关闭"
              data-wails-no-drag>
              ✕
            </button>
          </div>
        </div>
        {!isMinimized && (
          <div className="wiki-viewer-content">
            <iframe
              src={url}
              title={name}
            />
          </div>
        )}
      </div>
      {isMinimized && (
        <div
          className="wiki-viewer-taskbar"
          onClick={handleRestore}>
          <span>📁</span>
          <span>{folderName}</span>
          <span className="taskbar-url">{url}</span>
        </div>
      )}
    </div>
  );
}

export default WikiViewer;
