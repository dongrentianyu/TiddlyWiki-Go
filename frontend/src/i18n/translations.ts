export type Language = 'zh' | 'en';

export interface Translations {
  // Header
  appName: string;
  wikiCount: string;
  portsInUse: string;

  // Buttons
  newWiki: string;
  addWiki: string;
  refresh: string;
  expandAll: string;
  collapseAll: string;
  prevPage: string;
  nextPage: string;

  // Tabs
  tabWikiList: string;
  tabFilter: string;
  tabInfo: string;

  // View modes
  cardView: string;
  listView: string;

  // Display modes
  displayAll: string;
  displayByCategory: string;
  displayByTag: string;
  displayByPath: string;
  displayRecent: string;

  // Wiki actions
  start: string;
  stop: string;
  restart: string;
  edit: string;
  delete: string;
  export: string;
  openInApp: string;
  openInBrowser: string;
  folder: string;
  vscode: string;
  github: string;
  infoFile: string;
  exportHTML: string;

  // Form labels
  name: string;
  path: string;
  port: string;
  username: string;
  category: string;
  tags: string;
  description: string;

  // Status
  running: string;
  stopped: string;

  // Messages
  exportSuccess: string;
  exportFailed: string;
  deleteConfirm: string;
  noWikis: string;
  noWikisHint: string;

  // Pagination
  itemsPerPage: string;
  pageInfo: string;
  totalItems: string;
}

export const translations: Record<Language, Translations> = {
  zh: {
    // Header
    appName: 'TiddlyWiki Manager',
    wikiCount: '共 {count} 个 Wiki',
    portsInUse: '{count} 端口占用',

    // Buttons
    newWiki: '✨ 新建',
    addWiki: '➕ 添加',
    refresh: '刷新',
    expandAll: '展开全部',
    collapseAll: '折叠全部',
    prevPage: '上一页',
    nextPage: '下一页',

    // Tabs
    tabWikiList: '📚 Wiki 列表',
    tabFilter: '🔍 筛选',
    tabInfo: 'ℹ️ 信息',

    // View modes
    cardView: '卡片视图',
    listView: '列表视图',

    // Display modes
    displayAll: '全部展示',
    displayByCategory: '按分类',
    displayByTag: '按标签',
    displayByPath: '按路径',
    displayRecent: '最近启动',

    // Wiki actions
    start: '▶️ 启动',
    stop: '⏹️ 停止',
    restart: '🔄 重启',
    edit: '✏️',
    delete: '🗑️',
    export: '📦',
    openInApp: '应用内',
    openInBrowser: '浏览器',
    folder: '📂 文件夹',
    vscode: '💻 VSCode',
    github: '🐙 GitHub',
    infoFile: '📄 Info 文件',
    exportHTML: '📦 导出 HTML',

    // Form labels
    name: '名称',
    path: '路径',
    port: '端口号',
    username: '用户名',
    category: '分类',
    tags: '标签',
    description: '描述',

    // Status
    running: '🟢 运行中',
    stopped: '⚫ 已停止',

    // Messages
    exportSuccess: '导出成功！\n文件保存在：{path}',
    exportFailed: '导出失败：',
    deleteConfirm: '确定要删除这个 TiddlyWiki 吗？',
    noWikis: '还没有 TiddlyWiki',
    noWikisHint: '点击右上角的"添加新 Wiki"按钮开始吧！',

    // Pagination
    itemsPerPage: '每页显示:',
    pageInfo: '第 {current} / {total} 页',
    totalItems: '共 {count} 项',
  },

  en: {
    // Header
    appName: 'TiddlyWiki Manager',
    wikiCount: '{count} Wikis',
    portsInUse: '{count} Ports in Use',

    // Buttons
    newWiki: '✨ New',
    addWiki: '➕ Add',
    refresh: 'Refresh',
    expandAll: 'Expand All',
    collapseAll: 'Collapse All',
    prevPage: 'Previous',
    nextPage: 'Next',

    // Tabs
    tabWikiList: '📚 Wiki List',
    tabFilter: '🔍 Filter',
    tabInfo: 'ℹ️ Info',

    // View modes
    cardView: 'Card View',
    listView: 'List View',

    // Display modes
    displayAll: 'All',
    displayByCategory: 'By Category',
    displayByTag: 'By Tag',
    displayByPath: 'By Path',
    displayRecent: 'Recent',

    // Wiki actions
    start: '▶️ Start',
    stop: '⏹️ Stop',
    restart: '🔄 Restart',
    edit: '✏️',
    delete: '🗑️',
    export: '📦',
    openInApp: 'In App',
    openInBrowser: 'Browser',
    folder: '📂 Folder',
    vscode: '💻 VSCode',
    github: '🐙 GitHub',
    infoFile: '📄 Info File',
    exportHTML: '📦 Export HTML',

    // Form labels
    name: 'Name',
    path: 'Path',
    port: 'Port',
    username: 'Username',
    category: 'Category',
    tags: 'Tags',
    description: 'Description',

    // Status
    running: '🟢 Running',
    stopped: '⚫ Stopped',

    // Messages
    exportSuccess: 'Export successful!\nFile saved at: {path}',
    exportFailed: 'Export failed: ',
    deleteConfirm: 'Are you sure you want to delete this TiddlyWiki?',
    noWikis: 'No TiddlyWikis Yet',
    noWikisHint: 'Click the "Add Wiki" button in the top right to get started!',

    // Pagination
    itemsPerPage: 'Items per page:',
    pageInfo: 'Page {current} / {total}',
    totalItems: '{count} items',
  },
};

export function t(key: keyof Translations, lang: Language, params?: Record<string, string | number>): string {
  let text = translations[lang][key];

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, String(value));
    });
  }

  return text;
}

