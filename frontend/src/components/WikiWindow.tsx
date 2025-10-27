import React, { useState, useRef, useEffect } from "react";
import "./WikiWindow.css";

interface WikiWindowProps {
  id: string;
  title: string;
  url: string;
  onClose: () => void;
  onMinimize: () => void;
  zIndex: number;
  onFocus: () => void;
}

export const WikiWindow: React.FC<WikiWindowProps> = ({
  id,
  title,
  url,
  onClose,
  onMinimize,
  zIndex,
  onFocus,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({
    x: 100 + Math.random() * 200,
    y: 50 + Math.random() * 100,
  });
  const [size, setSize] = useState({ width: 1000, height: 700 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      } else if (isResizing) {
        const newWidth = Math.max(
          400,
          resizeStart.width + (e.clientX - resizeStart.x)
        );
        const newHeight = Math.max(
          300,
          resizeStart.height + (e.clientY - resizeStart.y)
        );
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).closest(".window-title-text")
    ) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
      onFocus();
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
    onFocus();
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    onFocus();
  };

  const windowStyle: React.CSSProperties = isMaximized
    ? {
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex,
      }
    : {
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
      };

  return (
    <div
      ref={windowRef}
      className={`wiki-window ${isMaximized ? "maximized" : ""}`}
      style={windowStyle}
      onMouseDown={onFocus}>
      <div
        className="wiki-window-titlebar"
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={handleMaximize}>
        <div className="window-title-text">{title}</div>
        <div className="window-controls">
          <button
            className="window-control-btn minimize"
            onClick={onMinimize}
            title="最小化">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12">
              <line
                x1="0"
                y1="6"
                x2="12"
                y2="6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <button
            className="window-control-btn maximize"
            onClick={handleMaximize}
            title={isMaximized ? "还原" : "最大化"}>
            {isMaximized ? (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12">
                <rect
                  x="2"
                  y="2"
                  width="8"
                  height="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="1"
                  y="1"
                  width="8"
                  height="8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            ) : (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12">
                <rect
                  x="1"
                  y="1"
                  width="10"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            )}
          </button>
          <button
            className="window-control-btn close"
            onClick={onClose}
            title="关闭">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12">
              <line
                x1="1"
                y1="1"
                x2="11"
                y2="11"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="11"
                y1="1"
                x2="1"
                y2="11"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="wiki-window-content">
        <iframe
          src={url}
          title={title}
          className="wiki-iframe"
          sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-popups allow-downloads"
        />
      </div>
      {!isMaximized && (
        <div
          className="wiki-window-resize-handle"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};
