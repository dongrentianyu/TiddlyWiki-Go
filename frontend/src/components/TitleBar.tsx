import { useState, useEffect } from "react";
import {
  WindowMinimize,
  WindowToggleMaximize,
  WindowClose,
} from "../wailsjs/go/main/App";
import "./TitleBar.css";

interface TitleBarProps {
  onThemeToggle: () => void;
  isDarkMode: boolean;
  onLanguageToggle?: () => void;
  language?: "zh" | "en";
}

function TitleBar({
  onThemeToggle,
  isDarkMode,
  onLanguageToggle,
  language = "zh",
}: TitleBarProps) {
  const handleMinimize = async () => {
    try {
      await WindowMinimize();
    } catch (error) {
      console.error("Failed to minimize:", error);
    }
  };

  const handleMaximize = async () => {
    try {
      await WindowToggleMaximize();
    } catch (error) {
      console.error("Failed to maximize:", error);
    }
  };

  const handleClose = async () => {
    try {
      await WindowClose();
    } catch (error) {
      console.error("Failed to close:", error);
    }
  };

  return (
    <div className="title-bar draggable">
      <div className="title-bar-left">
        <div className="app-icon">🌟</div>
        <div className="app-title">TiddlyWiki Manager</div>
      </div>

      <div className="title-bar-right">
        {onLanguageToggle && (
          <button
            className="language-toggle-btn no-draggable"
            onClick={onLanguageToggle}
            title={language === "zh" ? "Switch to English" : "切换到中文"}
          >
            {language === "zh" ? "EN" : "中"}
          </button>
        )}
        <button
          className="theme-toggle-btn no-draggable"
          onClick={onThemeToggle}
          title={isDarkMode ? "切换到白天模式" : "切换到黑夜模式"}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
        <button
          className="window-btn minimize-btn no-draggable"
          onClick={handleMinimize}
          title="最小化"
        >
          −
        </button>
        <button
          className="window-btn maximize-btn no-draggable"
          onClick={handleMaximize}
          title="最大化"
        >
          □
        </button>
        <button
          className="window-btn close-btn no-draggable"
          onClick={handleClose}
          title="关闭"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default TitleBar;
