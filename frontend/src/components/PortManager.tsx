import { useState, useEffect } from "react";
import { CheckPortsStatus, KillPortProcess } from "../wailsjs/go/main/App";
import "./PortManager.css";

interface PortInfo {
  port: number;
  inUse: boolean;
  processId: string;
}

interface PortManagerProps {
  onClose: () => void;
  onRefresh?: () => void;
}

function PortManager({ onClose, onRefresh }: PortManagerProps) {
  const [ports, setPorts] = useState<PortInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [killing, setKilling] = useState<number | null>(null);

  useEffect(() => {
    loadPorts();
  }, []);

  const loadPorts = async () => {
    setLoading(true);
    try {
      const result = await CheckPortsStatus();
      setPorts(result || []);
    } catch (error) {
      console.error("Failed to check ports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKillProcess = async (port: number, pid: string) => {
    if (
      !confirm(
        `确定要关闭端口 ${port} 的进程吗？\n\n进程ID: ${
          pid || "未知"
        }\n\n注意：如果该进程是通过本软件启动的 TiddlyWiki，请使用停止按钮而不是此功能。`
      )
    ) {
      return;
    }

    setKilling(port);
    try {
      await KillPortProcess(port);
      await loadPorts();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      alert("关闭进程失败：" + error);
    } finally {
      setKilling(null);
    }
  };

  const inUsePorts = ports.filter((p) => p.inUse);
  const availablePorts = ports.filter((p) => !p.inUse);

  return (
    <div className="port-manager-page">
      <div className="port-manager-header">
        <h2>端口管理</h2>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={loadPorts}
            disabled={loading}>
            {loading ? "检测中..." : "刷新"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={onClose}>
            返回
          </button>
        </div>
      </div>

      <div className="port-manager-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>正在检测端口状态...</p>
          </div>
        ) : (
          <>
            {inUsePorts.length > 0 && (
              <div className="port-section">
                <h3 className="section-title occupied">
                  占用中的端口 ({inUsePorts.length})
                </h3>
                <div className="port-list">
                  {inUsePorts.map((port) => (
                    <div
                      key={port.port}
                      className="port-item occupied">
                      <div className="port-info">
                        <div className="port-number">端口 {port.port}</div>
                        <div className="port-pid">
                          进程ID: {port.processId || "未知"}
                        </div>
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleKillProcess(port.port, port.processId)
                        }
                        disabled={killing === port.port}>
                        {killing === port.port ? "关闭中..." : "关闭进程"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {availablePorts.length > 0 && (
              <div className="port-section">
                <h3 className="section-title available">
                  可用端口 ({availablePorts.length})
                </h3>
                <div className="port-list">
                  {availablePorts.map((port) => (
                    <div
                      key={port.port}
                      className="port-item available">
                      <div className="port-info">
                        <div className="port-number">端口 {port.port}</div>
                        <div className="port-status">空闲</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ports.length === 0 && !loading && (
              <div className="empty-state">
                <p>未检测到任何Wiki端口</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="port-manager-footer">
        <div className="info-text">
          <strong>提示：</strong>
          <ul>
            <li>通过软件启动的Wiki请使用"停止"按钮而非关闭进程</li>
            <li>关闭系统进程可能导致不可预期的问题</li>
            <li>建议关闭前确认进程用途</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PortManager;
