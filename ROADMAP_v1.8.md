# TiddlyWiki Manager v1.8.0 规划

## 📋 待实现功能（来自 v1.7 需求）

基于用户反馈，以下功能将在 v1.8.0 中实现：

### 1. 筛选页面独立化 🔍

**当前状态**: 筛选是模态弹窗  
**目标**: 改为完整的独立页面

**具体需求**:

- [ ] 筛选作为独立路由页面（不是弹窗）
- [ ] 按钮尺寸更小，支持几十个标签的显示
- [ ] 支持按分类筛选标签
- [ ] 添加"无分类"按钮
- [ ] 添加"无标签"按钮

**技术方案**:

```tsx
// 需要添加路由系统
-MainView(Wiki列表) - FilterView(筛选页面) - SettingsView(设置页面);
```

---

### 2. 多样化展示模式 📊

**目标**: 提供多种查看和排序方式

**具体需求**:

#### 展示方式

- [ ] 卡片视图（当前）
- [ ] 列表视图（紧凑）

#### 分组方式

- [ ] 按标签分组
- [ ] 按分类分组
- [ ] 按文件路径分组
- [ ] 按最近启动时间排序

**UI 设计**:

```
Header: [卡片/列表] [分组: 标签▼] [排序: 时间▼]

按标签分组:
  📌 学习 (3个Wiki)
    - Wiki1
    - Wiki2
    - Wiki3
  📌 工作 (2个Wiki)
    - Wiki4
    - Wiki5
```

**技术方案**:

```tsx
interface ViewConfig {
  mode: "card" | "list";
  groupBy: "none" | "tag" | "category" | "path";
  sortBy: "name" | "recent" | "port";
}
```

---

### 3. 启动时端口扫描 🔍

**目标**: 应用启动时自动检测端口占用

**具体需求**:

- [ ] 应用启动时扫描所有 Wiki 的端口
- [ ] 显示哪些端口被占用
- [ ] 提供"关闭进程"按钮
- [ ] 显示占用进程的信息

**UI 设计**:

```
启动时弹窗:
┌──────────────────────────────┐
│ ⚠️ 检测到端口占用              │
├──────────────────────────────┤
│ Wiki "MyWiki" 的端口 8080     │
│ 被进程 node.exe (PID 12345)  │
│ 占用                          │
│                               │
│ [关闭进程] [忽略] [更换端口]  │
└──────────────────────────────┘
```

**技术方案**:

```go
// services/port_scanner.go
type PortScanResult struct {
    WikiID  string
    Port    int
    InUse   bool
    Process *ProcessInfo
}

func ScanAllWikiPorts(wikis []Wiki) []PortScanResult
func KillProcessByPort(port int) error
```

---

### 4. 真正的多窗口支持 🪟

**当前状态**: WikiViewer 是覆盖层  
**目标**: 每个 Wiki 独立窗口

**具体需求**:

- [ ] 使用 Wails 的多窗口 API
- [ ] 每个 Wiki 打开新的 OS 窗口
- [ ] 窗口有最大化、最小化、关闭按钮
- [ ] 不影响主窗口操作
- [ ] 记住窗口位置和大小

**技术方案**:

```go
// app.go
func (a *App) OpenWikiInWindow(wikiID string) error {
    wiki, _ := a.wikiService.GetByID(wikiID)

    // 创建新窗口
    window := wruntime.WindowNew(a.ctx, wruntime.WindowOptions{
        Title:  wiki.Name,
        Width:  1200,
        Height: 800,
        URL:    fmt.Sprintf("http://localhost:%d", wiki.Port),
    })

    return nil
}
```

**注意事项**:

- Wails v2.8.0 的多窗口 API 可能有限制
- 可能需要升级到 Wails v2.10.2
- 或者使用 webview 嵌入

---

## 🔧 技术债务

### 1. 升级 Wails 版本

```
当前: v2.8.0
目标: v2.10.2
原因: 更好的多窗口支持
```

### 2. 添加路由系统

```tsx
// frontend需要React Router
npm install react-router-dom
```

### 3. 状态管理

```tsx
// 考虑使用Context或状态管理库
-当前展示模式 - 筛选状态 - 窗口状态;
```

---

## 📅 开发计划

### Phase 1: 基础架构 (1-2 天)

- [ ] 升级 Wails 到 v2.10.2
- [ ] 添加 React Router
- [ ] 设置状态管理

### Phase 2: 筛选页面 (1 天)

- [ ] 独立筛选路由
- [ ] 优化按钮尺寸
- [ ] 添加分类筛选逻辑

### Phase 3: 多样化展示 (2 天)

- [ ] 列表视图组件
- [ ] 分组逻辑实现
- [ ] 排序功能

### Phase 4: 端口扫描 (1 天)

- [ ] 端口扫描服务
- [ ] 进程管理功能
- [ ] UI 集成

### Phase 5: 多窗口 (2 天)

- [ ] 研究 Wails 多窗口 API
- [ ] 实现窗口管理
- [ ] 窗口状态持久化

---

## ⚠️ 风险评估

### 高风险项

1. **多窗口支持**: Wails 版本兼容性问题
2. **进程管理**: Windows 权限问题

### 中风险项

1. **路由系统**: 可能影响现有代码
2. **状态管理**: 重构现有状态逻辑

### 低风险项

1. **筛选页面**: 主要是 UI 改动
2. **多样化展示**: 增量开发

---

## 📝 备注

由于功能复杂度和开发时间考虑，v1.7.0 只实现了最关键的"自动添加 Wiki"功能。

其余功能将在 v1.8.0 中完整实现，预计需要 5-7 天开发时间。

---

**当前版本**: v1.7.0  
**下一版本**: v1.8.0  
**预计发布**: 待定


