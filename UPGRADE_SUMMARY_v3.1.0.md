# TiddlyWiki Manager v3.1.0 升级摘要

## 🚀 快速概览

**版本**: v3.0.0 → v3.1.0  
**发布日期**: 2025-10-29  
**更新类型**: 重要修复更新 (Bug Fix Release)

---

## ⚡ 核心修复

### 1. 🔥 修复 GetWikiStatus 返回类型错误

**问题**: v3.0.0 中后端返回 string，前端期望 bool，导致表格视图状态显示异常

**修复**:

```go
// 修改前 (v3.0.0)
func (a *App) GetWikiStatus(id string) string {
    return a.wikiService.GetStatus(id)
}

// 修改后 (v3.1.0)
func (a *App) GetWikiStatus(id string) bool {
    status := a.wikiService.GetStatus(id)
    return status == "running"
}
```

**影响**:

- ✅ 表格视图状态正确显示
- ✅ 启动/停止按钮正确切换
- ✅ 类型安全，无转换错误

---

### 2. ✅ 修复 GitHub 链接打开方式

**问题**: v3.0.0 中 GitHub 链接在应用内 webview 打开，用户认为"很危险"

**修复**:

```tsx
// 修改前 (v3.0.0)
<a href="..." className="github-link">...</a>

// 修改后 (v3.1.0)
<button
  className="github-link"
  onClick={() => {
    const url = "https://github.com/dongrentianyu/TiddlyWiki-Go";
    (window as any).runtime.BrowserOpenURL(url);
  }}>
  dongrentianyu/TiddlyWiki-Go
</button>
```

**影响**:

- ✅ 在系统默认浏览器打开
- ✅ 安全可靠
- ✅ 符合用户习惯

---

## 📋 变更文件列表

### 后端文件

1. **app.go**

   - 修改 `GetWikiStatus` 返回值类型：`string` → `bool`
   - 更新版本号：`3.0.0` → `3.1.0`

2. **wails.json**
   - 更新版本号：`3.0.0` → `3.1.0`

### 前端文件

1. **frontend/src/components/InfoPanel.tsx**

   - 修改 GitHub 链接为按钮+BrowserOpenURL

2. **frontend/src/components/InfoPanel.css**
   - 调整 `.github-link` 样式以适配按钮

### 文档文件

1. **docs/v3.1.0/RELEASE_v3.1.0.md** - 新建
2. **README.md** - 更新版本信息
3. **UPGRADE_SUMMARY_v3.1.0.md** - 新建

---

## 🔄 升级步骤

### 从 v3.0.0 升级

1. **下载新版本**

   ```
   TiddlyWiki-Manager-win64-v3.1.0.exe
   ```

2. **关闭旧版本**

   - 退出应用
   - 停止所有运行中的 Wiki

3. **替换文件**

   - 用 v3.1.0 替换 v3.0.0

4. **启动新版本**

   - 所有数据自动保留
   - 检查表格视图状态显示

5. **验证功能**
   - 测试 Wiki 启动/停止
   - 测试 GitHub 链接打开

---

## 📊 版本对比

| 功能               | v3.0.0            | v3.1.0            | 改进         |
| ------------------ | ----------------- | ----------------- | ------------ |
| GetWikiStatus 类型 | ❌ string（错误） | ✅ bool（正确）   | 修复类型错误 |
| 表格视图状态       | ❌ 显示异常       | ✅ 显示正确       | 完全修复     |
| GitHub 链接        | ❌ 应用内 webview | ✅ 系统默认浏览器 | 用户体验提升 |
| 整体稳定性         | ⚠️ 部分功能异常   | ✅ 完全正常       | 大幅提升     |

---

## ⚠️ 破坏性变更

**无破坏性变更**

所有修改都是内部实现优化，不影响用户数据和配置。

---

## 💡 使用建议

1. **强烈建议从 v3.0.0 升级**

   - v3.0.0 存在关键的类型错误
   - v3.1.0 完全修复了这些问题

2. **升级后验证**

   - 检查表格视图，确认状态显示正确
   - 测试启动/停止 Wiki 功能
   - 测试 GitHub 链接是否在浏览器打开

3. **如遇问题**
   - 查看日志文件（logs 目录）
   - 访问 GitHub 提交 Issue

---

## 📝 相关链接

- **GitHub 仓库**: https://github.com/dongrentianyu/TiddlyWiki-Go
- **v3.1.0 完整发布说明**: docs/v3.1.0/RELEASE_v3.1.0.md
- **问题反馈**: https://github.com/dongrentianyu/TiddlyWiki-Go/issues

---

**TiddlyWiki Manager v3.1.0 - 认真修复，稳定可靠！**
