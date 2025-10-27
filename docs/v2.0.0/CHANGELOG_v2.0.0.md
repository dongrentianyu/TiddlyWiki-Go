# Changelog - Version 2.0.0

## 📅 发布日期：2025-10-27

## 🎯 主要更新

### ✅ 需求 1：创建 TiddlyWiki 后自动添加

- ✓ 通过软件创建的 Wiki 自动添加到管理器
- ✓ 自动检查并创建 tiddlers 文件夹
- ✓ 无需二次手动添加

### 🔍 需求 2：筛选功能改为独立页面

- ✓ 筛选从弹窗改为全屏页面
- ✓ 标签和分类按钮紧凑化设计
- ✓ 新增"无分类"筛选按钮
- ✓ 新增"无标签"筛选按钮
- ✓ 显示无分类和无标签的 Wiki 数量

### 📊 需求 3：多样化展示模式

- ✓ 按全部展示
- ✓ 按分类展示
- ✓ 按标签展示
- ✓ 按路径展示
- ✓ 按最近启动展示
- ✓ 卡片视图模式
- ✓ 列表视图模式
- ✓ 视图偏好自动保存

### ⚠️ 需求 4：端口占用检测与管理

- ✓ 启动时自动扫描 Wiki 端口占用状态
- ✓ 标题栏显示端口占用警告
- ✓ 提供关闭占用进程的按钮
- ✓ 显示进程 PID 信息
- ✓ 安全确认机制

### 🪟 需求 5：Wiki 窗口完善

- ✓ 支持最小化窗口
- ✓ 支持最大化窗口
- ✓ 支持关闭窗口
- ✓ 最小化后显示为任务栏
- ✓ 点击任务栏恢复窗口

### 🔢 需求 6：版本升级

- ✓ 版本号更新为 2.0.0
- ✓ wails.json 更新
- ✓ app.go 版本信息更新

## 🛠️ 技术实现

### 后端改进

```go
// 新增函数
- CheckPortsStatus() []services.PortInfo
- KillPortProcess(port int) error
- services.CheckPortsInUse(ports []int) []PortInfo
- services.GetProcessUsingPort(port int) string
- services.KillProcessByPID(pid string) error
- services.KillProcessOnPort(port int) error

// 改进函数
- CreateNewWiki(): 自动添加到管理器，自动创建tiddlers文件夹
```

### 前端改进

```typescript
// 新增状态
- displayMode: "all" | "category" | "tag" | "path" | "recent"
- viewMode: "card" | "list"
- portsInUse: PortInfo[]

// 新增功能
- checkPorts(): 检测端口占用
- handleKillPort(): 关闭占用端口的进程
- 改进filterWikis(): 支持无分类和无标签筛选
```

### UI 组件更新

```
FilterPanel.tsx    - 重构为全屏页面
WikiViewer.tsx     - 完整窗口控制（最小化/最大化/关闭）
WikiList.tsx       - 支持卡片和列表视图
WikiCard.tsx       - 列表模式布局
App.tsx           - 端口管理、视图切换、展示模式
```

## 📁 文件修改列表

### Go 文件

- `app.go` - 添加端口管理 API，更新版本
- `services/port_checker.go` - 端口检测和进程管理
- `services/process_service.go` - 改进 CreateNewWiki

### TypeScript 文件

- `frontend/src/App.tsx`
- `frontend/src/components/FilterPanel.tsx`
- `frontend/src/components/WikiViewer.tsx`
- `frontend/src/components/WikiList.tsx`
- `frontend/src/components/WikiCard.tsx`

### CSS 文件

- `frontend/src/App.css`
- `frontend/src/components/FilterPanel.css`
- `frontend/src/components/WikiViewer.css`
- `frontend/src/components/WikiList.css`
- `frontend/src/components/WikiCard.css`

### 配置文件

- `wails.json` - 版本 2.0.0

### 文档

- `RELEASE_v2.0.0.md` - 详细发布说明
- `CHANGELOG_v2.0.0.md` - 更新日志

## ✅ 测试状态

- ✓ Go 代码编译通过
- ✓ TypeScript 代码无 Lint 错误
- ✓ Wails 绑定生成成功
- ✓ 所有新增函数已暴露给前端

## 🎨 UI 改进

1. **端口警告提示** - 醒目的黄色警告标签，可点击查看详情
2. **视图切换按钮** - 简洁的图标式切换按钮
3. **展示模式选择** - 下拉菜单选择展示方式
4. **筛选页面** - 全屏页面，更大的操作空间
5. **任务栏** - 最小化窗口的悬浮任务栏

## 🚀 构建命令

```bash
# 开发模式
wails dev

# 构建Windows版本
wails build

# 生成绑定
wails generate module
```

## 📝 升级说明

从 1.x 版本升级到 2.0.0：

1. 现有配置完全兼容
2. 无需手动迁移数据
3. 首次启动会自动扫描端口
4. 视图模式默认为卡片视图
5. 展示模式默认为全部展示

## 🎯 下一版本预告 (v2.1.0)

- 批量操作功能
- Wiki 分组管理
- 自定义主题
- 配置导入/导出
- Wiki 模板功能

---

**完成时间**: 2025-10-27  
**所有需求**: ✅ 已完成  
**测试状态**: ✅ 通过
