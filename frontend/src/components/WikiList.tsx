import { Wiki } from "../types/wiki";
import WikiCard from "./WikiCard";
import "./WikiList.css";
import { useState } from "react";

interface WikiListProps {
  wikis: Wiki[];
  viewMode: "card" | "list";
  displayMode?: "all" | "category" | "tag" | "path" | "recent";
  onEdit: (wiki: Wiki) => void;
  onDelete: (id: string) => void;
  onOpenWiki: (wiki: Wiki) => void;
  onReload: () => void;
  onTagClick: (tag: string) => void;
  onCategoryClick: (category: string) => void;
}

function WikiList({
  wikis,
  viewMode,
  displayMode = "all",
  onEdit,
  onDelete,
  onOpenWiki,
  onReload,
  onTagClick,
  onCategoryClick,
}: WikiListProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  if (wikis.length === 0) {
    return (
      <div className="wiki-list-empty">
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h2>还没有 TiddlyWiki</h2>
          <p>点击右上角的"添加新 Wiki"按钮开始吧！</p>
        </div>
      </div>
    );
  }

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    if (displayMode === "category") {
      const categories = Array.from(
        new Set(wikis.map((w) => w.category || "未分类"))
      );
      setExpandedGroups(new Set(categories));
    } else if (displayMode === "tag") {
      const allTags = Array.from(new Set(wikis.flatMap((w) => w.tags || [])));
      const tagGroups = allTags.length > 0 ? allTags : ["无标签"];
      setExpandedGroups(new Set(tagGroups));
    }
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  // 按分类分组
  const renderByCategory = () => {
    const categorized = wikis.reduce((acc, wiki) => {
      const category = wiki.category || "未分类";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(wiki);
      return acc;
    }, {} as Record<string, Wiki[]>);

    return (
      <div className="wiki-groups">
        {Object.entries(categorized)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, categoryWikis]) => (
            <details
              key={category}
              className="wiki-group"
              open={expandedGroups.has(category)}>
              <summary
                onClick={(e) => {
                  e.preventDefault();
                  toggleGroup(category);
                }}>
                <svg
                  className={`expand-icon ${
                    expandedGroups.has(category) ? "expanded" : ""
                  }`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12">
                  <path
                    d="M 3 4 L 6 7 L 9 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
                <span className="group-title">
                  {category}
                  <span className="group-count">({categoryWikis.length})</span>
                </span>
              </summary>
              <div
                className={
                  viewMode === "card" ? "wiki-grid" : "wiki-list-view"
                }>
                {categoryWikis.map((wiki) => (
                  <WikiCard
                    key={wiki.id}
                    wiki={wiki}
                    viewMode={viewMode}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onOpenWiki={onOpenWiki}
                    onTagClick={onTagClick}
                    onCategoryClick={onCategoryClick}
                  />
                ))}
              </div>
            </details>
          ))}
      </div>
    );
  };

  // 按标签分组
  const renderByTag = () => {
    // 收集所有标签
    const tagToWikis: Record<string, Wiki[]> = {};
    const wikisWithoutTags: Wiki[] = [];

    wikis.forEach((wiki) => {
      if (!wiki.tags || wiki.tags.length === 0) {
        wikisWithoutTags.push(wiki);
      } else {
        wiki.tags.forEach((tag) => {
          if (!tagToWikis[tag]) {
            tagToWikis[tag] = [];
          }
          tagToWikis[tag].push(wiki);
        });
      }
    });

    const sortedTags = Object.keys(tagToWikis).sort();

    return (
      <div className="wiki-groups">
        {sortedTags.map((tag) => (
          <details
            key={tag}
            className="wiki-group"
            open={expandedGroups.has(tag)}>
            <summary
              onClick={(e) => {
                e.preventDefault();
                toggleGroup(tag);
              }}>
              <svg
                className={`expand-icon ${
                  expandedGroups.has(tag) ? "expanded" : ""
                }`}
                width="12"
                height="12"
                viewBox="0 0 12 12">
                <path
                  d="M 3 4 L 6 7 L 9 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              <span className="group-title">
                {tag}
                <span className="group-count">({tagToWikis[tag].length})</span>
              </span>
            </summary>
            <div
              className={viewMode === "card" ? "wiki-grid" : "wiki-list-view"}>
              {tagToWikis[tag].map((wiki) => (
                <WikiCard
                  key={wiki.id}
                  wiki={wiki}
                  viewMode={viewMode}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onOpenWiki={onOpenWiki}
                  onTagClick={onTagClick}
                  onCategoryClick={onCategoryClick}
                />
              ))}
            </div>
          </details>
        ))}
        {wikisWithoutTags.length > 0 && (
          <details
            key="无标签"
            className="wiki-group"
            open={expandedGroups.has("无标签")}>
            <summary
              onClick={(e) => {
                e.preventDefault();
                toggleGroup("无标签");
              }}>
              <svg
                className={`expand-icon ${
                  expandedGroups.has("无标签") ? "expanded" : ""
                }`}
                width="12"
                height="12"
                viewBox="0 0 12 12">
                <path
                  d="M 3 4 L 6 7 L 9 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              <span className="group-title">
                无标签
                <span className="group-count">({wikisWithoutTags.length})</span>
              </span>
            </summary>
            <div
              className={viewMode === "card" ? "wiki-grid" : "wiki-list-view"}>
              {wikisWithoutTags.map((wiki) => (
                <WikiCard
                  key={wiki.id}
                  wiki={wiki}
                  viewMode={viewMode}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onOpenWiki={onOpenWiki}
                  onTagClick={onTagClick}
                  onCategoryClick={onCategoryClick}
                />
              ))}
            </div>
          </details>
        )}
      </div>
    );
  };

  // 默认渲染
  const renderDefault = () => {
    return (
      <div className={viewMode === "card" ? "wiki-grid" : "wiki-list-view"}>
        {wikis.map((wiki) => (
          <WikiCard
            key={wiki.id}
            wiki={wiki}
            viewMode={viewMode}
            onEdit={onEdit}
            onDelete={onDelete}
            onOpenWiki={onOpenWiki}
            onTagClick={onTagClick}
            onCategoryClick={onCategoryClick}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="wiki-list">
      <div className="wiki-list-header">
        <button
          className="btn btn-secondary btn-sm"
          onClick={onReload}
          title="刷新">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
        {(displayMode === "category" || displayMode === "tag") && (
          <div className="expand-controls">
            <button
              className="btn btn-secondary btn-sm"
              onClick={expandAll}
              title="全部展开">
              展开全部
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={collapseAll}
              title="全部折叠">
              折叠全部
            </button>
          </div>
        )}
      </div>
      {displayMode === "category" && renderByCategory()}
      {displayMode === "tag" && renderByTag()}
      {displayMode !== "category" && displayMode !== "tag" && renderDefault()}
    </div>
  );
}

export default WikiList;
