# TiddlyWiki Manager v3.1.0 发布说明

## 🎉 版本概览

v3.1.0 是一个**重要的修复版本**，解决了 v3.0.0 中遗留的关键问题，特别是表格视图状态判断和 GitHub 链接打开方式。

**发布日期**: 2025-10-29  
**版本类型**: 修复更新 (Bug Fix Release)

---

## 🔥 核心修复

### 1. ✅ 修复 GetWikiStatus 返回值类型错误

**这是 v3.1.0 最关键的修复！**

#### 问题描述（v3.0.0）

- 后端 `GetWikiStatus` 返回 `string` 类型
- 前端期望接收 `bool` 类型
- 导致类型不匹配，状态判断失败
- 表格视图无法正确显示 Wiki 运行状态

#### 根本原因

```go
// ❌ 错误的实现（v3.0.0）
func (a *App) GetWikiStatus(id string) string {
	return a.wikiService.GetStatus(id)
}
```

前端期望：

```typescript
const isRunning = await GetWikiStatus(wiki.id); // 期望 bool
statuses[wiki.id] = isRunning ? "running" : "stopped";
```

但实际返回的是 `string`，导致类型转换错误。

#### 解决方案（v3.1.0）

**修正返回值类型**：

```go
// ✅ 正确的实现（v3.1.0）
func (a *App) GetWikiStatus(id string) bool {
	status := a.wikiService.GetStatus(id)
	return status == "running"
}
```

现在：

- 返回 `true` 表示运行中
- 返回 `false` 表示已停止
- 与前端 TypeScript 类型完美匹配

#### 效果

- ✅ **表格视图状态正确显示**
- ✅ **启动/停止按钮正确切换**
- ✅ **类型安全，无类型转换错误**
- ✅ **状态实时同步**

---

### 2. ✅ 修复 GitHub 链接在系统默认浏览器打开

**用户强烈要求的功能！**

#### 问题描述（v3.0.0）

- GitHub 链接使用 `<a>` 标签
- 点击后在应用内 webview 中打开
- 用户无法使用系统默认浏览器
- 用户认为"很危险"

#### 解决方案（v3.1.0）

**使用 Wails BrowserOpenURL API**：

```tsx
// ✅ v3.1.0 实现
<button
  className="github-link"
  onClick={() => {
    const url = "https://github.com/dongrentianyu/TiddlyWiki-Go";
    (window as any).runtime.BrowserOpenURL(url);
  }}>
  dongrentianyu/TiddlyWiki-Go
</button>
```

**样式调整**：

```css
.github-link {
  color: #667eea;
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: underline;
}
```

#### 效果

- ✅ **在系统默认浏览器打开**
- ✅ **安全可靠**
- ✅ **符合用户习惯**

---

## 📋 完整更新列表

| 更新项目                  | v3.0.0                | v3.1.0            | 说明                    |
| ------------------------- | --------------------- | ----------------- | ----------------------- |
| 1. GetWikiStatus 返回类型 | ❌ string（类型错误） | ✅ bool           | 修复类型不匹配问题      |
| 2. 表格视图状态显示       | ❌ 不正确             | ✅ 正确           | 状态与实际进程同步      |
| 3. GitHub 链接打开方式    | ❌ 应用内 webview     | ✅ 系统默认浏览器 | 使用 BrowserOpenURL API |
| 4. 版本号                 | 3.0.0                 | 3.1.0             | 修复更新                |

---

## 🔧 技术改进

### 后端改进

**文件**: `app.go`

```go
// GetWikiStatus gets the status of a wiki (returns true if running)
func (a *App) GetWikiStatus(id string) bool {
	status := a.wikiService.GetStatus(id)
	return status == "running"
}

// GetAppVersion returns the application version
func (a *App) GetAppVersion() string {
	return "3.1.0"
}
```

### 前端改进

**文件**: `frontend/src/components/InfoPanel.tsx`

```tsx
<button
  className="github-link"
  onClick={() => {
    const url = "https://github.com/dongrentianyu/TiddlyWiki-Go";
    (window as any).runtime.BrowserOpenURL(url);
  }}>
  dongrentianyu/TiddlyWiki-Go
</button>
```

**文件**: `frontend/src/components/InfoPanel.css`

```css
.github-link {
  color: #667eea;
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: underline;
}
```

---

## 📦 构建信息

**文件名**: `TiddlyWiki-Manager-win64-v3.1.0.exe`  
**位置**: `build\bin\`  
**版本**: v3.1.0  
**构建日期**: 2025-10-29  
**大小**: ~10.3 MB

---

## 🔄 升级说明

### 从 v3.0.0 升级到 v3.1.0

**重要提示**: 强烈建议从 v3.0.0 升级，修复了关键的类型错误。

1. **下载新版本**

   - `TiddlyWiki-Manager-win64-v3.1.0.exe`

2. **关闭旧版本**

   - 退出应用程序
   - **如果有运行中的 Wiki，请先停止**

3. **替换文件**

   - 用新版本替换旧版本

4. **启动新版本**

   - 所有数据和配置自动保留
   - 检查表格视图，确认状态显示正确

5. **验证功能**
   - 测试启动/停止 Wiki，状态应立即更新
   - 测试 GitHub 链接，应在系统默认浏览器打开

---

## 💡 使用指南

### 表格视图状态显示

现在表格视图能够正确显示 Wiki 的实时状态：

1. **停止状态**

   - 显示 ⚫ 已停止
   - 显示 ▶️ 启动按钮

2. **运行状态**

   - 显示 🟢 运行中
   - 显示 ⏹️ 停止、🔄 重启、📱 应用内打开、🌐 浏览器打开按钮

3. **状态刷新**
   - 组件加载时自动刷新
   - 执行启动/停止/重启后自动刷新

### GitHub 链接使用

1. 切换到 **ℹ️ 信息** 标签页
2. 找到 **🔗 开源项目** 部分
3. 点击 **dongrentianyu/TiddlyWiki-Go** 链接
4. 链接将在系统默认浏览器中打开

---

## 🎯 版本对比

### v3.0.0 vs v3.1.0

| 特性                | v3.0.0            | v3.1.0            |
| ------------------- | ----------------- | ----------------- |
| GetWikiStatus 类型  | ❌ string（错误） | ✅ bool（正确）   |
| 表格视图状态显示    | ❌ 不正确         | ✅ 正确           |
| GitHub 链接打开方式 | ❌ 应用内 webview | ✅ 系统默认浏览器 |
| 功能可用性          | ⚠️ 部分功能异常   | ✅ 完全正常       |

---

## 🐛 已知问题

**无已知严重问题**

所有 v3.0.0 的关键 Bug 已在 v3.1.0 中修复。

如果发现任何问题，请访问 GitHub 提交 Issue：
https://github.com/dongrentianyu/TiddlyWiki-Go/issues

---

## 📝 相关链接

- **GitHub 仓库**: https://github.com/dongrentianyu/TiddlyWiki-Go
- **TiddlyWiki 官网**: https://tiddlywiki.com/
- **问题反馈**: https://github.com/dongrentianyu/TiddlyWiki-Go/issues

---

## 🙏 致谢

特别感谢用户的耐心和详细的反馈！您的"认真点，我的时间不多了"让我们意识到了问题的严重性，并快速修复了这些关键 Bug。

v3.1.0 现在是一个**真正稳定可用**的版本！

---

**TiddlyWiki Manager v3.1.0 - 修复关键 Bug，稳定可靠！**
