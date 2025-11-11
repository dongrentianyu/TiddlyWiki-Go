import "./FilterPanel.css";
import React from "react";

interface FilterPanelProps {
  allTags: string[];
  allCategories: string[];
  selectedTags: string[];
  selectedCategory: string;
  searchQuery: string;
  onTagsChange: (tags: string[]) => void;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  onApply: () => void;
  wikisWithoutCategory: number;
  wikisWithoutTags: number;
}

function FilterPanel({
  allTags,
  allCategories,
  selectedTags,
  selectedCategory,
  searchQuery,
  onTagsChange,
  onCategoryChange,
  onSearchChange,
  onClose,
  onApply,
  wikisWithoutCategory,
  wikisWithoutTags,
}: FilterPanelProps) {
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleClearFilters = () => {
    onTagsChange([]);
    onCategoryChange("");
    onSearchChange("");
  };

  const hasActiveFilters =
    selectedTags.length > 0 || selectedCategory || searchQuery;

  return (
    <div className="filter-page">
      <div className="filter-page-header">
        <h2>🔍 筛选 Wiki</h2>
        <button
          className="btn btn-secondary"
          onClick={onClose}>
          ← 返回
        </button>
      </div>

      <div className="filter-page-content">
        <div className="filter-section">
          <label className="filter-label">🔎 搜索</label>
          <input
            type="text"
            className="search-input"
            placeholder="搜索名称或描述..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-section">
          <label className="filter-label">📁 分类</label>
          <div className="filter-items-container">
            <button
              className={`filter-item-btn ${
                selectedCategory === "" ? "active" : ""
              }`}
              onClick={() => onCategoryChange("")}>
              全部分类
            </button>
            <button
              className={`filter-item-btn ${
                selectedCategory === "无分类" ? "active" : ""
              }`}
              onClick={() => onCategoryChange("无分类")}>
              无分类 ({wikisWithoutCategory})
            </button>
            {allCategories.map((category) => (
              <button
                key={category}
                className={`filter-item-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => onCategoryChange(category)}>
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-label">🏷️ 标签</label>
          <div className="filter-items-container">
            <button
              className={`filter-item-btn ${
                selectedTags.includes("无标签") ? "active" : ""
              }`}
              onClick={() => {
                if (selectedTags.includes("无标签")) {
                  onTagsChange(selectedTags.filter((t) => t !== "无标签"));
                } else {
                  onTagsChange([...selectedTags, "无标签"]);
                }
              }}>
              无标签 ({wikisWithoutTags})
              {selectedTags.includes("无标签") && " ✓"}
            </button>
            {allTags.length === 0 ? (
              <p className="no-items">暂无标签</p>
            ) : (
              allTags.map((tag) => (
                <button
                  key={tag}
                  className={`filter-item-btn ${
                    selectedTags.includes(tag) ? "active" : ""
                  }`}
                  onClick={() => handleTagToggle(tag)}>
                  {tag}
                  {selectedTags.includes(tag) && " ✓"}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="filter-page-footer">
        {hasActiveFilters && (
          <button
            className="btn btn-secondary"
            onClick={handleClearFilters}>
            清除筛选
          </button>
        )}
        <button
          className="btn btn-primary"
          onClick={onApply}>
          应用筛选
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;
