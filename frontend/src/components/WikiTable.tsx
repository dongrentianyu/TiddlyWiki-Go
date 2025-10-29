import { Wiki } from "../types/wiki";
import { useState } from "react";
import "./WikiTable.css";

interface WikiTableProps {
  wikis: Wiki[];
  onEdit: (wiki: Wiki) => void;
  onDelete: (id: string) => void;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onOpenWiki: (wiki: Wiki) => void;
  getStatus: (id: string) => string;
}

export function WikiTable({
  wikis,
  onEdit,
  onDelete,
  onStart,
  onStop,
  onOpenWiki,
  getStatus,
}: WikiTableProps) {
  const [sortBy, setSortBy] = useState<keyof Wiki>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
            <th onClick={() => handleSort("name")}>
              名称 {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th>状态</th>
            <th onClick={() => handleSort("port")}>
              端口 {sortBy === "port" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("category")}>
              分类 {sortBy === "category" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th>标签</th>
            <th onClick={() => handleSort("path")}>
              路径 {sortBy === "path" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th>描述</th>
            <th>操作</th>
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
                <td
                  className="wiki-path"
                  title={wiki.path}>
                  {wiki.path.split(/[/\\]/).pop()}
                </td>
                <td className="wiki-description">{wiki.description || "-"}</td>
                <td className="wiki-actions">
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
                        className="btn-table-action btn-open"
                        onClick={() => onOpenWiki(wiki)}
                        title="打开">
                        🔗
                      </button>
                      <button
                        className="btn-table-action btn-stop"
                        onClick={() => onStop(wiki.id)}
                        title="停止">
                        ⏹️
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
                    className="btn-table-action btn-delete"
                    onClick={() => onDelete(wiki.id)}
                    title="删除">
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
