# TiddlyWiki Manager v2.9.1 发布说明

## 🎉 版本概览

v2.9.1 是一个**细节优化**版本，专注于提升用户体验和界面完善度。

**发布日期**: 2025-10-29

---

## ✨ 更新内容

### 1. ✅ GitHub 链接优化

**改进前**:

- GitHub 链接在新窗口打开（`target="_blank"`）
- 可能带来安全隐患

**改进后**:

- ✅ 在当前窗口打开
- ✅ 更安全可靠
- ✅ 用户体验更一致

```tsx
// 移除了 target="_blank" 和 rel="noopener noreferrer"
<a
  href="https://github.com/dongrentianyu/TiddlyWiki-Go"
  className="github-link">
  dongrentianyu/TiddlyWiki-Go
</a>
```

---

### 2. ✅ 表格视图功能增强

**新增按钮**:

**停止状态时**:

- ▶️ **启动**

**运行状态时**:

- ⏹️ **停止**
- 🔄 **重启** _(新增)_
- 📱 **应用内打开** _(新增)_
- 🌐 **浏览器打开** _(新增)_

**始终显示**:

- ✏️ **编辑**
- 📄 **导出 HTML**
- 📁 **打开文件夹**
- 🗑️ **删除**

**总计**: 最多 **8 个按钮** 同时显示（运行状态时）

**技术实现**:

- ✅ 增加操作列宽度至 28%
- ✅ 设置最小宽度 280px
- ✅ 按钮居中对齐
- ✅ 重启功能：先停止，等待 500ms，再启动

```typescript
onRestart={async (id) => {
  await StopWiki(id);
  await new Promise((resolve) => setTimeout(resolve, 500));
  await StartWiki(id);
  await loadWikis();
}}
```

---

### 3. ✅ 筛选面板优化

**新增"无标签"选项**:

- ✅ 在标签筛选区域第一个位置
- ✅ 使用特殊标识 `__NONE__`
- ✅ 与其他标签一样可点击切换

**样式间隔优化**:

- ✅ 筛选区块间距：32px → 40px
- ✅ 底部操作按钮间距优化
- ✅ 整体视觉更舒适

```tsx
<button
  className={`filter-tag-btn ${localTags.includes("__NONE__") ? "active" : ""}`}
  onClick={() => toggleTag("__NONE__")}>
  无标签
</button>
```

---

### 4. ✅ 窗口可缩放

**改进前**:

- 窗口大小固定
- 无法调整尺寸

**改进后**:

- ✅ 允许自由缩放
- ✅ 最小宽度：800px
- ✅ 最小高度：600px
- ✅ 初始大小：1200x800

**技术实现**:

```go
err := wails.Run(&options.App{
    Title:     "TiddlyWiki Manager",
    Width:     1200,
    Height:    800,
    MinWidth:  800,
    MinHeight: 600,
    DisableResize: false,
})
```

---

## 📋 完整更新列表

| 更新项目           | 状态 | 说明                         |
| ------------------ | ---- | ---------------------------- |
| 1. GitHub 链接优化 | ✅   | 在当前窗口打开，移除 target  |
| 2. 表格视图增强    | ✅   | 增加重启、应用内、浏览器按钮 |
| 3. 筛选面板优化    | ✅   | 添加无标签选项，增加间距     |
| 4. 窗口可缩放      | ✅   | 允许调整窗口大小，设置最小值 |
| 5. 版本号更新      | ✅   | 2.9.0 → 2.9.1                |

---

## 🔧 技术改进

### 前端改进

1. **InfoPanel.tsx**

   - 移除 `target="_blank"` 属性
   - 移除 `rel="noopener noreferrer"` 属性

2. **WikiTable.tsx**

   - 新增 `onRestart` 回调
   - 新增 `onOpenInBrowser` 回调
   - 增加重启、应用内打开、浏览器打开按钮
   - 优化按钮布局

3. **FilterPanel2.tsx**

   - 添加"无标签"按钮
   - 调整间距

4. **FilterPanel2.css**

   - `filter-section` margin-bottom: 32px → 40px
   - `filter-actions` margin-top: 32px → 40px

5. **WikiTable.css**
   - `col-actions` width: 24% → 28%
   - 增加 `min-width: 280px`

### 后端改进

1. **main.go**
   - 添加 `MinWidth: 800`
   - 添加 `MinHeight: 600`
   - 更新窗口标题

---

## 📦 构建信息

**文件名**: `TiddlyWiki-Manager-win64-v2.9.1.exe`  
**位置**: `build\bin\`  
**版本**: v2.9.1  
**构建日期**: 2025-10-29  
**大小**: ~10.3 MB

---

## 🔄 升级说明

### 从 v2.9.0 升级到 v2.9.1

1. **下载新版本**

   - `TiddlyWiki-Manager-win64-v2.9.1.exe`

2. **关闭旧版本**

   - 退出应用程序

3. **替换文件**

   - 用新版本替换旧版本

4. **启动新版本**
   - 所有数据和配置自动保留

**注意**: 这是一个小版本更新，无需特殊操作。

---

## 💡 使用提示

### 表格视图新功能

1. **重启 Wiki**

   - 点击 🔄 按钮
   - 系统会先停止，等待 0.5 秒，再启动
   - 适用于需要重新加载配置的场景

2. **应用内打开**

   - 点击 📱 按钮
   - 在应用内窗口中打开 Wiki
   - 可以同时打开多个 Wiki

3. **浏览器打开**
   - 点击 🌐 按钮
   - 在系统默认浏览器中打开
   - 适合需要浏览器特性的场景

### 筛选无标签 Wiki

1. 切换到 **🔍 筛选** 标签页
2. 在标签筛选区域点击 **无标签** 按钮
3. 点击 **✅ 应用筛选**
4. 只显示没有标签的 Wiki

### 调整窗口大小

1. 拖动窗口边缘或角落
2. 最小可缩小到 800x600
3. 可放大到任意尺寸
4. 适应不同屏幕尺寸

---

## 🐛 已知问题

**无已知严重问题**

如果发现任何问题，请访问 GitHub 提交 Issue：
https://github.com/dongrentianyu/TiddlyWiki-Go/issues

---

## 🎯 下一步计划

1. 完善中英文翻译
2. 筛选方案历史保存
3. 批量操作功能
4. Wiki 模板管理

---

## 📝 相关链接

- **GitHub 仓库**: https://github.com/dongrentianyu/TiddlyWiki-Go
- **TiddlyWiki 官网**: https://tiddlywiki.com/
- **问题反馈**: https://github.com/dongrentianyu/TiddlyWiki-Go/issues

---

## 🙏 致谢

感谢用户的细致反馈，帮助我们不断完善产品体验！

---

**TiddlyWiki Manager v2.9.1 - 更完善的 Wiki 管理工具！**
