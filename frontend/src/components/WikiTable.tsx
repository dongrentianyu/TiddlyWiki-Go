import { Wiki } from "../types/wiki";
import { useState, useEffect } from "react";
import {
  ExportWikiToHTML,
  OpenFolder,
  GetWikiStatus,
} from "../wailsjs/go/main/App";
import "./WikiTable.css";

interface WikiTableProps {
  wikis: Wiki[];
  onEdit: (wiki: Wiki) => void;
  onDelete: (id: string) => void;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onRestart: (id: string) => void;
  onOpenWiki: (wiki: Wiki) => void;
  onOpenInBrowser: (wiki: Wiki) => void;
}

export function WikiTable({
  wikis,
  onEdit,
  onDelete,
  onStart,
  onStop,
  onRestart,
  onOpenWiki,
  onOpenInBrowser,
}: WikiTableProps) {
  const [sortBy, setSortBy] = useState<keyof Wiki>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [wikiStatuses, setWikiStatuses] = useState<{ [key: string]: string }>(
    {}
  );

  // Load wiki statuses
  useEffect(() => {
    const loadStatuses = async () => {
      const statuses: { [key: string]: string } = {};
      for (const wiki of wikis) {
        try {
          const isRunning = await GetWikiStatus(wiki.id);
          statuses[wiki.id] = isRunning ? "running" : "stopped";
        } catch (error) {
          statuses[wiki.id] = "stopped";
        }
      }
      setWikiStatuses(statuses);
    };
    loadStatuses();
  }, [wikis]);

  const getStatus = (id: string) => wikiStatuses[id] || "stopped";

  const handleSort = (key: keyof Wiki) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const sortedWikis = [...wikis].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  return (
    <div className="wiki-table-container">
      <table className="wiki-table">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("name")}
              className="col-name">
              名称 {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="col-status">状态</th>
            <th
              onClick={() => handleSort("port")}
              className="col-port">
              端口 {sortBy === "port" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("category")}
              className="col-category">
              分类 {sortBy === "category" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="col-tags">标签</th>
            <th
              onClick={() => handleSort("path")}
              className="col-path">
              路径 {sortBy === "path" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="col-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          {sortedWikis.map((wiki) => {
            const status = getStatus(wiki.id);
            return (
              <tr
                key={wiki.id}
                className={status === "running" ? "running" : ""}>
                <td className="wiki-name">{wiki.name}</td>
                <td className="wiki-status">
                  <span className={`status-badge ${status}`}>
                    {status === "running" ? "🟢 运行中" : "⚫ 已停止"}
                  </span>
                </td>
                <td className="wiki-port">{wiki.port}</td>
                <td className="wiki-category">{wiki.category || "-"}</td>
                <td className="wiki-tags">
                  {wiki.tags && wiki.tags.length > 0
                    ? wiki.tags.join(", ")
                    : "-"}
                </td>
                <td className="wiki-path">
                  <div className="path-container">
                    <span
                      className="path-text"
                      title={wiki.path}>
                      {wiki.path}
                    </span>
                    <button
                      className="btn-copy-path"
                      onClick={() => {
                        navigator.clipboard.writeText(wiki.path);
                        alert("路径已复制！");
                      }}
                      title="复制路径">
                      📋
                    </button>
                  </div>
                </td>
                <td className="wiki-actions">
                  <div className="actions-grid">
                    {status === "stopped" ? (
                      <button
                        className="btn-table-action btn-start"
                        onClick={() => onStart(wiki.id)}
                        title="启动">
                        ▶️
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn-table-action btn-stop"
                          onClick={() => onStop(wiki.id)}
                          title="停止">
                          ⏹️
                        </button>
                        <button
                          className="btn-table-action btn-restart"
                          onClick={() => onRestart(wiki.id)}
                          title="重启">
                          🔄
                        </button>
                        <button
                          className="btn-table-action btn-open-app"
                          onClick={() => onOpenWiki(wiki)}
                          title="应用内打开">
                          📱
                        </button>
                        <button
                          className="btn-table-action btn-open-browser"
                          onClick={() => onOpenInBrowser(wiki)}
                          title="浏览器打开">
                          🌐
                        </button>
                      </>
                    )}
                    <button
                      className="btn-table-action btn-edit"
                      onClick={() => onEdit(wiki)}
                      title="编辑">
                      ✏️
                    </button>
                    <button
                      className="btn-table-action btn-export"
                      onClick={async () => {
                        try {
                          const outputPath = await ExportWikiToHTML(wiki.id);
                          const shouldOpen = confirm(
                            `导出成功！\n文件保存在：${outputPath}\n\n是否打开文件夹？`
                          );
                          if (shouldOpen) {
                            const folderPath = outputPath.substring(
                              0,
                              outputPath.lastIndexOf(
                                /[/\\]/.exec(outputPath)?.[0] || "/"
                              )
                            );
                            await OpenFolder(folderPath);
                          }
                        } catch (error) {
                          alert("导出失败：" + error);
                        }
                      }}
                      title="导出HTML">
                      📄
                    </button>
                    <button
                      className="btn-table-action btn-folder"
                      onClick={() => OpenFolder(wiki.path)}
                      title="打开文件夹">
                      📁
                    </button>
                    <button
                      className="btn-table-action btn-delete"
                      onClick={() => onDelete(wiki.id)}
                      title="删除">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
