import { useState, useEffect } from "react";
import TitleBar from "./components/TitleBar";
import WikiList from "./components/WikiList";
import { WikiTable } from "./components/WikiTable";
import WikiForm from "./components/WikiForm";
import CreateWikiForm from "./components/CreateWikiForm";
import FilterPanel2 from "./components/FilterPanel2";
import { SimpleFilterPanel } from "./components/SimpleFilterPanel";
import InfoPanel from "./components/InfoPanel";
import PortManager from "./components/PortManager";
import { WikiWindow } from "./components/WikiWindow";
import { Wiki } from "./types/wiki";
import { useTranslation } from "./i18n/useTranslation";
import {
  GetWikis,
  AddWiki,
  UpdateWiki,
  DeleteWiki,
  StartWiki,
  StopWiki,
  RestartWiki,
  GetWikiStatus,
  GetAllTags,
  GetAllCategories,
  GetAppVersion,
  GetPlatform,
  CheckPortsStatus,
} from "./wailsjs/go/main/App";
import "./App.css";

interface PortInfo {
  port: number;
  inUse: boolean;
  processId: string;
}

interface OpenWindow {
  id: string;
  wikiId: string;
  title: string;
  url: string;
  minimized: boolean;
  zIndex: number;
}

type DisplayMode = "all" | "category" | "tag" | "path" | "recent";
type ViewMode = "card" | "list" | "table";
type TabMode = "wikis" | "filter" | "info";

function App() {
  const { language, toggleLanguage, t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });
  const [wikis, setWikis] = useState<Wiki[]>([]);
  const [filteredWikis, setFilteredWikis] = useState<Wiki[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWiki, setEditingWiki] = useState<Wiki | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [showPortManager, setShowPortManager] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("all");
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem("viewMode");
    return (saved as ViewMode) || "card";
  });
  const [portsInUse, setPortsInUse] = useState<PortInfo[]>([]);
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1000);
  const [showSimpleFilter, setShowSimpleFilter] = useState(false);
  const [activeTab, setActiveTab] = useState<TabMode>("wikis");

  // 筛选记录保存
  const [filterHistory, setFilterHistory] = useState<
    Array<{
      tags: string[];
      category: string;
      search: string;
      timestamp: number;
    }>
  >(() => {
    const saved = localStorage.getItem("filterHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    loadWikis();
    loadTagsAndCategories();
    checkPorts();

    // Apply theme
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, []);

  useEffect(() => {
    // Update theme
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    filterWikis();

    // 保存筛选记录
    if (selectedTags.length > 0 || selectedCategory || searchQuery) {
      const newRecord = {
        tags: selectedTags,
        category: selectedCategory,
        search: searchQuery,
        timestamp: Date.now(),
      };

      setFilterHistory((prev) => {
        const updated = [
          newRecord,
          ...prev.filter(
            (r) => JSON.stringify(r) !== JSON.stringify(newRecord)
          ),
        ].slice(0, 10); // 保留最近10条

        localStorage.setItem("filterHistory", JSON.stringify(updated));
        return updated;
      });
    }
  }, [wikis, selectedTags, selectedCategory, searchQuery, displayMode]);

  const loadWikis = async () => {
    try {
      const data = await GetWikis();
      setWikis(data || []);
    } catch (error) {
      console.error("Failed to load wikis:", error);
    }
  };

  const loadTagsAndCategories = async () => {
    try {
      const tags = await GetAllTags();
      const categories = await GetAllCategories();
      setAllTags(tags || []);
      setAllCategories(categories || []);
    } catch (error) {
      console.error("Failed to load tags and categories:", error);
    }
  };

  const checkPorts = async () => {
    try {
      const ports = await CheckPortsStatus();
      setPortsInUse(ports || []);
    } catch (error) {
      console.error("Failed to check ports:", error);
    }
  };

  const filterWikis = () => {
    let filtered = [...wikis];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (wiki) =>
          wiki.name.toLowerCase().includes(query) ||
          wiki.description.toLowerCase().includes(query)
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      if (selectedTags.includes("无标签")) {
        // Include wikis without tags
        const withoutTags = filtered.filter(
          (wiki) => !wiki.tags || wiki.tags.length === 0
        );
        const withTags = filtered.filter((wiki) =>
          selectedTags
            .filter((tag) => tag !== "无标签")
            .every((tag) => wiki.tags.includes(tag))
        );
        filtered = [...new Set([...withoutTags, ...withTags])];
      } else {
        filtered = filtered.filter((wiki) =>
          selectedTags.every((tag) => wiki.tags.includes(tag))
        );
      }
    }

    // Category filter
    if (selectedCategory) {
      if (selectedCategory === "无分类") {
        filtered = filtered.filter(
          (wiki) => !wiki.category || wiki.category === ""
        );
      } else {
        filtered = filtered.filter(
          (wiki) => wiki.category === selectedCategory
        );
      }
    }

    // Display mode filter
    switch (displayMode) {
      case "recent":
        // Sort by most recently started (updatedAt)
        filtered = filtered.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
      case "path":
        // Sort by path
        filtered = filtered.sort((a, b) => a.path.localeCompare(b.path));
        break;
      // "all", "category", "tag" use default sorting
      default:
        break;
    }

    setFilteredWikis(filtered);
  };

  const handleAddWiki = async (
    wiki: Omit<Wiki, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await AddWiki(wiki as Wiki);
      await loadWikis();
      await loadTagsAndCategories();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add wiki:", error);
      alert("添加失败：" + error);
    }
  };

  const handleUpdateWiki = async (wiki: Wiki) => {
    try {
      await UpdateWiki(wiki);
      await loadWikis();
      await loadTagsAndCategories();
      setShowForm(false);
      setEditingWiki(null);
    } catch (error) {
      console.error("Failed to update wiki:", error);
      alert("更新失败：" + error);
    }
  };

  const handleDeleteWiki = async (id: string) => {
    if (!confirm("确定要删除这个 TiddlyWiki 吗？")) {
      return;
    }

    try {
      await DeleteWiki(id);
      await loadWikis();
      await loadTagsAndCategories();
    } catch (error) {
      console.error("Failed to delete wiki:", error);
      alert("删除失败：" + error);
    }
  };

  const handleEditWiki = (wiki: Wiki) => {
    setEditingWiki(wiki);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingWiki(null);
  };

  // Window management functions
  const handleOpenWiki = (wiki: Wiki) => {
    const url = `http://localhost:${wiki.port}`;
    const windowId = `window-${wiki.id}-${Date.now()}`;

    const newWindow: OpenWindow = {
      id: windowId,
      wikiId: wiki.id,
      title: wiki.name,
      url: url,
      minimized: false,
      zIndex: nextZIndex,
    };

    setOpenWindows((prev) => [...prev, newWindow]);
    setNextZIndex((prev) => prev + 1);
  };

  const handleCloseWindow = async (windowId: string, wikiId: string) => {
    // 关闭窗口
    setOpenWindows((prev) => prev.filter((w) => w.id !== windowId));

    // 自动停止Wiki服务器
    try {
      await StopWiki(wikiId);
      await loadWikis();

      // 检查端口并清理
      await checkPorts();

      // 显示通知
      const wiki = wikis.find((w) => w.id === wikiId);
      if (wiki) {
        alert(`✅ Wiki "${wiki.name}" 已停止\n端口 ${wiki.port} 已释放`);
      }
    } catch (error) {
      console.error("Failed to stop wiki:", error);
      alert("停止Wiki时出现错误，请手动检查进程");
    }
  };

  const handleMinimizeWindow = (windowId: string) => {
    setOpenWindows((prev) =>
      prev.map((w) =>
        w.id === windowId ? { ...w, minimized: !w.minimized } : w
      )
    );
  };

  const handleFocusWindow = (windowId: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, zIndex: nextZIndex } : w))
    );
    setNextZIndex((prev) => prev + 1);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const wikisWithoutCategory = wikis.filter(
    (w) => !w.category || w.category === ""
  ).length;
  const wikisWithoutTags = wikis.filter(
    (w) => !w.tags || w.tags.length === 0
  ).length;

  return (
    <div className="app">
      <TitleBar
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
        onLanguageToggle={toggleLanguage}
        language={language}
      />
      <header className="app-header">
        <div className="header-left">
          <h1>{t("appName")}</h1>
          <span className="wiki-count">
            {t("wikiCount", { count: filteredWikis.length })}
          </span>
          {portsInUse.filter((p) => p.inUse).length > 0 && (
            <span
              className="ports-warning"
              onClick={() => setShowPortManager(true)}
              title={
                language === "zh"
                  ? "点击查看端口详情"
                  : "Click to view port details"
              }>
              {t("portsInUse", {
                count: portsInUse.filter((p) => p.inUse).length,
              })}
            </span>
          )}
        </div>
        <div className="header-actions">
          {activeTab === "wikis" && (
            <>
              <div className="view-mode-switch">
                <button
                  className={`btn-view-mode ${
                    viewMode === "card" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("card")}
                  title={t("cardView")}>
                  ▦
                </button>
                <button
                  className={`btn-view-mode ${
                    viewMode === "list" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                  title={t("listView")}>
                  ☰
                </button>
                <button
                  className={`btn-view-mode ${
                    viewMode === "table" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("table")}
                  title={t("tableView")}>
                  ≡
                </button>
              </div>
              <select
                className="display-mode-select"
                value={displayMode}
                onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}>
                <option value="all">{t("displayAll")}</option>
                <option value="category">{t("displayByCategory")}</option>
                <option value="tag">{t("displayByTag")}</option>
                <option value="path">{t("displayByPath")}</option>
                <option value="recent">{t("displayRecent")}</option>
              </select>
            </>
          )}
          <button
            className="btn btn-success"
            onClick={() => setShowCreateForm(true)}>
            {t("newWiki")}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}>
            {t("addWiki")}
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <div className="tabs-nav">
          <button
            className={`tab-button ${activeTab === "wikis" ? "active" : ""}`}
            onClick={() => setActiveTab("wikis")}>
            {t("tabWikiList")}
          </button>
          <button
            className={`tab-button ${activeTab === "filter" ? "active" : ""}`}
            onClick={() => setActiveTab("filter")}>
            {t("tabFilter")}
          </button>
          <button
            className={`tab-button ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}>
            {t("tabInfo")}
          </button>
        </div>
      </div>

      <div className="app-content">
        <div className="main-content-full">
          {activeTab === "wikis" && viewMode === "table" ? (
            <WikiTable
              wikis={filteredWikis}
              onEdit={handleEditWiki}
              onDelete={handleDeleteWiki}
              onStart={async (id) => {
                try {
                  await StartWiki(id);
                  await loadWikis();
                } catch (error) {
                  alert("启动失败：" + error);
                }
              }}
              onStop={async (id) => {
                try {
                  await StopWiki(id);
                  await loadWikis();
                } catch (error) {
                  alert("停止失败：" + error);
                }
              }}
              onOpenWiki={handleOpenWiki}
              getStatus={(id) => {
                // 简单同步状态检查
                return "stopped"; // 实际应该异步获取
              }}
            />
          ) : activeTab === "wikis" ? (
            <WikiList
              wikis={filteredWikis}
              viewMode={viewMode}
              displayMode={displayMode}
              onEdit={handleEditWiki}
              onDelete={handleDeleteWiki}
              onOpenWiki={handleOpenWiki}
              onReload={() => {
                loadWikis();
                checkPorts();
              }}
              onTagClick={(tag) => {
                setSelectedTags([tag]);
                setActiveTab("filter");
              }}
              onCategoryClick={(category) => {
                setSelectedCategory(category);
                setActiveTab("filter");
              }}
            />
          ) : null}

          {activeTab === "filter" && (
            <FilterPanel2
              allTags={allTags}
              allCategories={allCategories}
              selectedTags={selectedTags}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onTagsChange={setSelectedTags}
              onCategoryChange={setSelectedCategory}
              onSearchChange={setSearchQuery}
              onClose={() => setActiveTab("wikis")}
              onApply={() => setActiveTab("wikis")}
              wikisWithoutCategory={wikisWithoutCategory}
              wikisWithoutTags={wikisWithoutTags}
            />
          )}

          {activeTab === "info" && (
            <InfoPanel
              wikis={wikis}
              onClose={() => setActiveTab("wikis")}
            />
          )}
        </div>
      </div>

      {showForm && (
        <WikiForm
          wiki={editingWiki}
          onSubmit={editingWiki ? handleUpdateWiki : handleAddWiki}
          onClose={handleCloseForm}
        />
      )}

      {showCreateForm && (
        <CreateWikiForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            loadWikis();
            checkPorts();
          }}
        />
      )}

      {showPortManager && (
        <PortManager
          onClose={() => setShowPortManager(false)}
          onRefresh={checkPorts}
        />
      )}

      {/* Wiki Windows */}
      {openWindows.map((window) =>
        !window.minimized ? (
          <WikiWindow
            key={window.id}
            id={window.id}
            title={window.title}
            url={window.url}
            onClose={() => handleCloseWindow(window.id, window.wikiId)}
            onMinimize={() => handleMinimizeWindow(window.id)}
            zIndex={window.zIndex}
            onFocus={() => handleFocusWindow(window.id)}
          />
        ) : null
      )}

      {/* Minimized windows taskbar */}
      {openWindows.some((w) => w.minimized) && (
        <div className="minimized-taskbar">
          {openWindows
            .filter((w) => w.minimized)
            .map((window) => (
              <button
                key={window.id}
                className="minimized-window-btn"
                onClick={() => handleMinimizeWindow(window.id)}
                title={window.title}>
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
                <span className="minimized-window-title">{window.title}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default App;
