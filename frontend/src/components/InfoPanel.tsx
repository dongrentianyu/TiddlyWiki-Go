import { useState, useEffect } from "react";
import { GetAppVersion, GetPlatform } from "../wailsjs/go/main/App";
import { Wiki } from "../types/wiki";
import "./InfoPanel.css";

interface InfoPanelProps {
  wikis: Wiki[];
  onClose: () => void;
}

function InfoPanel({ wikis, onClose }: InfoPanelProps) {
  const [version, setVersion] = useState("");
  const [platform, setPlatform] = useState("");

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    try {
      const ver = await GetAppVersion();
      const plat = await GetPlatform();
      setVersion(ver);
      setPlatform(plat);
    } catch (error) {
      console.error("Failed to load app info:", error);
    }
  };

  // 计算统计信息
  const totalWikis = wikis.length;
  const uniquePaths = new Set(wikis.map((w) => w.path));
  const uniqueWikis = uniquePaths.size;

  return (
    <div className="info-panel">
      <div className="info-header">
        <h2>📊 应用信息</h2>
      </div>

      <div className="info-content">
        <div className="info-section">
          <h3>🔖 版本信息</h3>
          <div className="info-item">
            <span className="info-label">版本号:</span>
            <span className="info-value">v{version}</span>
          </div>
          <div className="info-item">
            <span className="info-label">平台:</span>
            <span className="info-value">{platform}</span>
          </div>
        </div>

        <div className="info-section">
          <h3>📈 统计信息</h3>
          <div className="info-item">
            <span className="info-label">所有 Wiki 数量:</span>
            <span className="info-value">{totalWikis}</span>
          </div>
          <div className="info-item">
            <span className="info-label">去重后 Wiki 数量:</span>
            <span className="info-value">{uniqueWikis}</span>
          </div>
          {totalWikis > uniqueWikis && (
            <div className="info-note">
              ℹ️ 有 {totalWikis - uniqueWikis} 个重复的 Wiki 路径
            </div>
          )}
        </div>

        <div className="info-section">
          <h3>💡 提示</h3>
          <ul className="info-tips">
            <li>点击侧边栏按钮可以展开/收起筛选面板</li>
            <li>支持多标签筛选和分类筛选</li>
            <li>每个 Wiki 可以配置独立的端口号</li>
            <li>运行日志保存在 logs 目录下</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default InfoPanel;
