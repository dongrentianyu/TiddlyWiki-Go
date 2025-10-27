import { useState, useEffect } from "react";
import { Wiki } from "../types/wiki";
import {
  StartWiki,
  StopWiki,
  RestartWiki,
  GetWikiStatus,
  OpenFolder,
  OpenVSCode,
  OpenGitHubDesktop,
  OpenInfoFile,
  OpenWikiInNewWindow,
} from "../wailsjs/go/main/App";
import { BrowserOpenURL } from "../wailsjs/runtime/runtime";
import "./WikiCard.css";

interface WikiCardProps {
  wiki: Wiki;
  viewMode: "card" | "list";
  onEdit: (wiki: Wiki) => void;
  onDelete: (id: string) => void;
  onOpenWiki: (wiki: Wiki) => void;
  onTagClick: (tag: string) => void;
  onCategoryClick: (category: string) => void;
}

function WikiCard({
  wiki,
  viewMode,
  onEdit,
  onDelete,
  onOpenWiki,
  onTagClick,
  onCategoryClick,
}: WikiCardProps) {
  const [status, setStatus] = useState<"running" | "stopped">("stopped");

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [wiki.id]);

  const checkStatus = async () => {
    try {
      const st = await GetWikiStatus(wiki.id);
      setStatus(st as "running" | "stopped");
    } catch (error) {
      console.error("Failed to get status:", error);
    }
  };

  const handleStart = async () => {
    try {
      await StartWiki(wiki.id);
      setTimeout(checkStatus, 1000);
    } catch (error) {
      alert("启动失败：" + error);
    }
  };

  const handleStop = async () => {
    try {
      await StopWiki(wiki.id);
      setTimeout(checkStatus, 1000);
    } catch (error) {
      alert("停止失败：" + error);
    }
  };

  const handleRestart = async () => {
    try {
      await RestartWiki(wiki.id);
      setTimeout(checkStatus, 2000);
    } catch (error) {
      alert("重启失败：" + error);
    }
  };

  const handleOpenWiki = () => {
    onOpenWiki(wiki);
  };

  const handleOpenInBrowser = () => {
    const url = `http://localhost:${wiki.port}`;
    BrowserOpenURL(url);
  };

  const handleOpenFolder = async () => {
    try {
      await OpenFolder(wiki.path);
    } catch (error) {
      alert("打开文件夹失败：" + error);
    }
  };

  const handleOpenVSCode = async () => {
    try {
      await OpenVSCode(wiki.path);
    } catch (error) {
      alert("打开 VSCode 失败：" + error);
    }
  };

  const handleOpenGitHub = async () => {
    try {
      await OpenGitHubDesktop(wiki.path);
    } catch (error) {
      alert("打开 GitHub Desktop 失败：" + error);
    }
  };

  const handleOpenInfo = async () => {
    try {
      await OpenInfoFile(wiki.path);
    } catch (error) {
      alert("打开 info 文件失败：" + error);
    }
  };

  return (
    <div
      className={`wiki-card ${status === "running" ? "running" : ""} ${
        viewMode === "list" ? "list-mode" : ""
      }`}>
      <div className="wiki-card-header">
        <div className="wiki-title">
          <h3>{wiki.name}</h3>
          <span className={`status-badge ${status}`}>
            {status === "running" ? "🟢 运行中" : "⚫ 已停止"}
          </span>
        </div>
        <div className="wiki-actions">
          <button
            className="btn-icon"
            onClick={() => onEdit(wiki)}
            title="编辑">
            ✏️
          </button>
          <button
            className="btn-icon"
            onClick={() => onDelete(wiki.id)}
            title="删除">
            🗑️
          </button>
        </div>
      </div>

      {wiki.description && (
        <p className="wiki-description">{wiki.description}</p>
      )}

      <div className="wiki-meta">
        <div className="meta-item">
          <span className="meta-label">端口:</span>
          <span className="meta-value">{wiki.port}</span>
        </div>
        {wiki.category && (
          <div className="meta-item">
            <span className="meta-label">分类:</span>
            <button
              className="category-badge clickable"
              onClick={() => onCategoryClick(wiki.category)}
              title="点击筛选此分类">
              {wiki.category}
            </button>
          </div>
        )}
      </div>

      {wiki.tags && wiki.tags.length > 0 && (
        <div className="wiki-tags">
          {wiki.tags.map((tag) => (
            <button
              key={tag}
              className="tag clickable"
              onClick={() => onTagClick(tag)}
              title="点击筛选此标签">
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="wiki-path">
        <span>📁 {wiki.path}</span>
      </div>

      <div className="wiki-controls">
        {/* 运行控制 */}
        <div className="control-row-two">
          {status === "stopped" ? (
            <button
              className="btn btn-success btn-sm btn-full"
              onClick={handleStart}>
              ▶️ 启动
            </button>
          ) : (
            <>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleStop}>
                ⏹️ 停止
              </button>
              <button
                className="btn btn-warning btn-sm"
                onClick={handleRestart}>
                🔄 重启
              </button>
            </>
          )}
        </div>

        {/* 打开 Wiki */}
        {status === "running" && (
          <div className="control-row-two">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleOpenWiki}
              title="在应用内窗口打开">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  ry="2"
                />
                <line
                  x1="3"
                  y1="9"
                  x2="21"
                  y2="9"
                />
              </svg>
              应用内
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={handleOpenInBrowser}
              title="在浏览器中打开">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                />
                <polyline points="12 16 16 12 12 8" />
                <line
                  x1="8"
                  y1="12"
                  x2="16"
                  y2="12"
                />
              </svg>
              浏览器
            </button>
          </div>
        )}

        {/* 工具按钮 */}
        <div className="control-row-two">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleOpenFolder}>
            📂 文件夹
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleOpenVSCode}>
            💻 VSCode
          </button>
        </div>

        <div className="control-row-two">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleOpenGitHub}>
            🐙 GitHub
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleOpenInfo}>
            📄 Info 文件
          </button>
        </div>
      </div>
    </div>
  );
}

export default WikiCard;
