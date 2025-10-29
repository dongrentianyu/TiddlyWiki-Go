import { useState } from "react";
import "./FilterPanel2.css";
import { useTranslation } from "../i18n/useTranslation";

interface FilterPanel2Props {
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

export default function FilterPanel2({
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
}: FilterPanel2Props) {
  const { t } = useTranslation();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localTags, setLocalTags] = useState<string[]>(selectedTags);
  const [localCategory, setLocalCategory] = useState(selectedCategory);

  const handleApply = () => {
    onSearchChange(localSearch);
    onTagsChange(localTags);
    onCategoryChange(localCategory);
    onApply();
  };

  const handleReset = () => {
    setLocalSearch("");
    setLocalTags([]);
    setLocalCategory("");
    onSearchChange("");
    onTagsChange([]);
    onCategoryChange("");
  };

  const toggleTag = (tag: string) => {
    if (localTags.includes(tag)) {
      setLocalTags(localTags.filter((t) => t !== tag));
    } else {
      setLocalTags([...localTags, tag]);
    }
  };

  return (
    <div className="filter-panel2">
      <div className="filter-panel2-container">
        {/* Search Section */}
        <div className="filter-section">
          <label className="filter-label">🔍 搜索 Wiki</label>
          <input
            type="text"
            className="filter-search-input"
            placeholder="搜索 Wiki 名称、描述、路径..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        {/* Category Section */}
        <div className="filter-section">
          <label className="filter-label">
            📁 分类筛选
            {wikisWithoutCategory > 0 && (
              <span className="filter-hint">
                ({wikisWithoutCategory} 个未分类)
              </span>
            )}
          </label>
          <div className="filter-category-grid">
            <button
              className={`filter-category-btn ${
                localCategory === "" ? "active" : ""
              }`}
              onClick={() => setLocalCategory("")}>
              全部
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                className={`filter-category-btn ${
                  localCategory === cat ? "active" : ""
                }`}
                onClick={() => setLocalCategory(cat)}>
                {cat}
              </button>
            ))}
            {wikisWithoutCategory > 0 && (
              <button
                className={`filter-category-btn ${
                  localCategory === "__NONE__" ? "active" : ""
                }`}
                onClick={() => setLocalCategory("__NONE__")}>
                未分类
              </button>
            )}
          </div>
        </div>

        {/* Tags Section */}
        <div className="filter-section">
          <label className="filter-label">
            🏷️ 标签筛选
            {localTags.length > 0 && (
              <span className="filter-selected-count">
                ({localTags.length} 个已选)
              </span>
            )}
            {wikisWithoutTags > 0 && (
              <span className="filter-hint">({wikisWithoutTags} 个无标签)</span>
            )}
          </label>
          <div className="filter-tags-grid">
            <button
              className={`filter-tag-btn ${
                localTags.includes("__NONE__") ? "active" : ""
              }`}
              onClick={() => toggleTag("__NONE__")}>
              无标签
            </button>
            {allTags.length > 0 ? (
              allTags.map((tag) => (
                <button
                  key={tag}
                  className={`filter-tag-btn ${
                    localTags.includes(tag) ? "active" : ""
                  }`}
                  onClick={() => toggleTag(tag)}>
                  {tag}
                </button>
              ))
            ) : (
              <p className="filter-empty-hint">暂无其他标签</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="filter-actions">
          <button
            className="btn-filter btn-reset"
            onClick={handleReset}>
            🔄 重置
          </button>
          <button
            className="btn-filter btn-apply"
            onClick={handleApply}>
            ✅ 应用筛选
          </button>
        </div>
      </div>
    </div>
  );
}
