# TiddlyWiki Manager v2.2.0 更新日志

## [2.2.0] - 2025-10-27

### ✨ 新增

#### 应用内窗口系统

- **WikiWindow 组件** - 全新的窗口组件

  - 独立的 Wiki 显示窗口
  - 完整的窗口控制（最小化、最大化、关闭）
  - 可拖动调整位置
  - 可调整窗口大小
  - Z-index 层级管理
  - 双击标题栏最大化

- **窗口管理系统** - App.tsx 中的窗口状态管理

  - `openWindows` 状态跟踪所有打开的窗口
  - `nextZIndex` 管理窗口层级
  - `handleOpenWiki()` - 创建新窗口
  - `handleCloseWindow()` - 关闭窗口
  - `handleMinimizeWindow()` - 最小化/恢复窗口
  - `handleFocusWindow()` - 窗口聚焦

- **最小化任务栏** - 底部任务栏
  - 显示所有最小化的窗口
  - 点击恢复窗口
  - 自动显示/隐藏
  - 窗口标题显示

### 🔄 修改

#### 组件更新

**App.tsx**:

- 添加 `WikiWindow` 导入
- 添加 `OpenWindow` 接口定义
- 添加窗口状态管理
- 添加窗口管理函数
- 添加 `onOpenWiki` 回调传递给 WikiList
- 渲染 WikiWindow 组件
- 渲染最小化任务栏

**WikiList.tsx**:

- 添加 `onOpenWiki` 属性
- 将 `onOpenWiki` 传递给 WikiCard

**WikiCard.tsx**:

- 添加 `onOpenWiki` 属性
- 修改 `handleOpenWiki()` 调用 `onOpenWiki` 而不是 `BrowserOpenURL`

**App.css**:

- 添加 `.minimized-taskbar` 样式
- 添加 `.minimized-window-btn` 样式
- 添加 `.minimized-window-title` 样式

#### 版本更新

**app.go**:

- `GetAppVersion()` 返回 "2.2.0"

**wails.json**:

- `version` 更新为 "2.2.0"

**main.go**:

- `Title` 更新为 "TiddlyWiki Manager v2.2.0"

### 🎨 样式

#### WikiWindow.css (新增)

- `.wiki-window` - 窗口基础样式
- `.wiki-window.maximized` - 最大化窗口样式
- `.wiki-window-titlebar` - 标题栏样式
- `.window-title-text` - 标题文本样式
- `.window-controls` - 控制按钮组样式
- `.window-control-btn` - 控制按钮样式
  - `.minimize` - 最小化按钮
  - `.maximize` - 最大化按钮
  - `.close` - 关闭按钮（hover 红色）
- `.wiki-window-content` - 内容区域样式
- `.wiki-iframe` - iframe 样式
- `.wiki-window-resize-handle` - 调整大小手柄

#### App.css (更新)

- `.minimized-taskbar` - 任务栏容器
- `.minimized-window-btn` - 任务栏窗口按钮
- `.minimized-window-title` - 窗口标题

### 📦 文件结构

#### 新增文件

```
frontend/src/components/
├── WikiWindow.tsx       # Wiki 窗口组件
└── WikiWindow.css       # 窗口样式

docs/v2.2.0/
├── RELEASE_v2.2.0.md    # 发布说明
└── CHANGELOG_v2.2.0.md  # 更新日志（本文件）
```

#### 修改文件

```
frontend/src/
├── App.tsx              # 添加窗口管理
├── App.css              # 添加任务栏样式
└── components/
    ├── WikiList.tsx     # 添加 onOpenWiki
    └── WikiCard.tsx     # 修改打开逻辑

app.go                   # 版本号 2.2.0
wails.json               # 版本号 2.2.0
main.go                  # 标题 v2.2.0
```

### 🔧 技术细节

#### 窗口拖动实现

```typescript
const handleTitleBarMouseDown = (e: React.MouseEvent) => {
  setIsDragging(true);
  setDragStart({
    x: e.clientX - position.x,
    y: e.clientY - position.y,
  });
};
```

#### 窗口调整大小

```typescript
const handleResizeMouseDown = (e: React.MouseEvent) => {
  setIsResizing(true);
  setResizeStart({
    x: e.clientX,
    y: e.clientY,
    width: size.width,
    height: size.height,
  });
};
```

#### Z-Index 管理

```typescript
const handleFocusWindow = (windowId: string) => {
  setOpenWindows((prev) =>
    prev.map((w) => (w.id === windowId ? { ...w, zIndex: nextZIndex } : w))
  );
  setNextZIndex((prev) => prev + 1);
};
```

### 📊 性能

- 每个窗口使用独立的 iframe
- 拖动和调整大小使用 React 状态管理
- 事件监听器在组件卸载时正确清理
- Z-index 递增避免冲突

### 🐛 已知问题

- 窗口位置和大小不会持久化（刷新后重置）
- 同一个 Wiki 可以打开多个窗口（无检查）
- 没有窗口数量限制（可能影响性能）

### ⚠️ 破坏性变更

无。此版本向后兼容 v2.1.0。

### 🔄 从 v2.1.0 升级

1. 直接使用新版本 exe 文件
2. 所有配置和数据保持不变
3. Wiki 打开方式自动切换为应用内窗口

### 📝 开发者注意事项

- `BrowserOpenURL` 不再用于打开 Wiki
- WikiCard 组件需要 `onOpenWiki` 回调
- WikiWindow 使用 `sandbox` iframe 确保安全

---

**发布日期**: 2025-10-27  
**构建时间**: 7.985 秒  
**可执行文件**: `build/bin/TiddlyWiki-Manager-win64-v2.2.0.exe`


