import React from "react";
import "./SimpleFilterPanel.css";

interface SimpleFilterPanelProps {
  selectedTags: string[];
  selectedCategory: string;
  searchQuery: string;
  onTagsChange: (tags: string[]) => void;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  allTags: string[];
  allCategories: string[];
  onSwitchToAdvanced: () => void;
}

export const SimpleFilterPanel: React.FC<SimpleFilterPanelProps> = ({
  selectedTags,
  selectedCategory,
  searchQuery,
  onTagsChange,
  onCategoryChange,
  onSearchChange,
  onClose,
  allTags,
  allCategories,
  onSwitchToAdvanced,
}) => {
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleReset = () => {
    onTagsChange([]);
    onCategoryChange("");
    onSearchChange("");
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}>
      <div
        className="modal-content simple-filter-panel"
        onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>快速筛选</h2>
          <div className="header-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={onSwitchToAdvanced}>
              高级筛选
            </button>
            <button
              className="btn btn-close"
              onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* 搜索 */}
          <div className="filter-section">
            <label>搜索</label>
            <input
              type="text"
              className="filter-input"
              placeholder="输入名称或描述..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* 分类 */}
          <div className="filter-section">
            <label>分类</label>
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}>
              <option value="">全部分类</option>
              {allCategories.map((cat) => (
                <option
                  key={cat}
                  value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 标签 */}
          <div className="filter-section">
            <label>标签</label>
            <div className="tag-list">
              {allTags.length === 0 ? (
                <p className="no-tags">暂无标签</p>
              ) : (
                allTags.map((tag) => (
                  <button
                    key={tag}
                    className={`tag-btn ${
                      selectedTags.includes(tag) ? "active" : ""
                    }`}
                    onClick={() => handleTagToggle(tag)}>
                    {tag}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={handleReset}>
            清空筛选
          </button>
          <button
            className="btn btn-primary"
            onClick={onClose}>
            应用筛选
          </button>
        </div>
      </div>
    </div>
  );
};
