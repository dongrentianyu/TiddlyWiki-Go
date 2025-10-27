# Changelog v2.1.0

## 📅 发布日期

2025-10-27

## 🎯 改进内容

### Bug 修复

#### 修复选择文件夹崩溃 ✅

**文件**: `frontend/src/components/CreateWikiForm.tsx`

**修改**:

```typescript
// 修改前
const handleSelectFolder = async () => {
  try {
    const path = await SelectFolder();
    if (path) {
      setParentDir(path);
    }
  } catch (error) {
    console.error("Failed to select folder:", error);
  }
};

// 修改后
const handleSelectFolder = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    const path = await SelectFolder();
    if (path && path.trim() !== "") {
      setParentDir(path);
    }
  } catch (error) {
    console.error("Failed to select folder:", error);
    // 不显示错误，用户取消选择是正常行为
  }
};
```

**原因**: 缺少事件阻止传播，导致 modal 关闭

**影响**: 用户可以正常选择文件夹

---

### 功能改进

#### 端口管理独立界面 ✅

**新增文件**:

- `frontend/src/components/PortManager.tsx`
- `frontend/src/components/PortManager.css`

**功能**:

- 独立的端口管理页面
- 实时显示端口状态
- 分类显示占用/可用端口
- 一键关闭进程
- 安全提示

**移除**:

- Alert 弹窗方式的端口管理

---

#### 支持同时打开多个 Wiki ✅

**修改文件**:

- `frontend/src/App.tsx`
- `frontend/src/components/WikiList.tsx`
- `frontend/src/components/WikiCard.tsx`

**改动**:

1. 移除 WikiViewer 组件
2. 移除 onOpenWiki prop
3. 直接使用 BrowserOpenURL 打开 Wiki
4. 合并"应用内"和"浏览器"按钮为单一"打开"按钮

**优势**:

- 可以同时打开无限个 Wiki
- 利用浏览器多标签页
- 更好的性能

---

#### UI 简化与优化 ✅

**移除内容**:

```typescript
// App.tsx
- "共 {filteredWikis.length} 个 Wiki"
- ⚠️ emoji
- 🔍 emoji
- ℹ️ emoji
- ✨ emoji
- ➕ emoji
- 所有其他emoji

// WikiList.tsx
- "我的 TiddlyWiki ({wikis.length})"
- 🔄 emoji

// FilterPanel.tsx
- "筛选 Wiki" 标题
```

**新增内容**:

- SVG 图标（Feather Icons 风格）
- Tooltip 提示
- 简洁的文本

**CSS 改进**:

- 新增 `.control-row-full`
- 优化按钮间距
- 统一图标样式

---

### 文档整理

#### 新增文档结构 ✅

```
docs/
├── v2.0.0/
│   ├── RELEASE_v2.0.0.md
│   ├── CHANGELOG_v2.0.0.md
│   ├── UPGRADE_TO_v2.0.0.md
│   ├── BUILD_v2.0.0.md
│   ├── IMPLEMENTATION_SUMMARY_v2.0.0.md
│   └── BUILD_COMPLETE_v2.0.0.md
└── v2.1.0/
    ├── RELEASE_v2.1.0.md
    └── CHANGELOG_v2.1.0.md
```

**移动文件**:

- 所有 v2.0.0 文档移至 `docs/v2.0.0/`
- 新建 `docs/v2.1.0/` 存放新版本文档

---

## 📝 完整修改列表

### Go 后端

- `app.go` - 版本号更新为 2.1.0
- `wails.json` - 版本号更新为 2.1.0

### React 前端

**修改的文件**:

1. `App.tsx` - 主要 UI 改进

   - 移除 WikiViewer
   - 添加 PortManager
   - 简化文本
   - SVG 图标替代 emoji

2. `CreateWikiForm.tsx` - Bug 修复

   - 修复选择文件夹崩溃

3. `WikiList.tsx` - 接口简化

   - 移除 onOpenWiki prop
   - 移除标题文本
   - SVG 图标

4. `WikiCard.tsx` - 打开方式改进
   - 移除 onOpenWiki
   - 直接使用 BrowserOpenURL
   - 合并打开按钮
   - SVG 图标

**新增的文件**:

1. `PortManager.tsx` - 端口管理页面
2. `PortManager.css` - 端口管理样式

**修改的 CSS 文件**:

1. `WikiCard.css` - 新增 `.control-row-full`

### 文档

- 移动所有 v2.0.0 文档到 `docs/v2.0.0/`
- 创建 `docs/v2.1.0/RELEASE_v2.1.0.md`
- 创建 `docs/v2.1.0/CHANGELOG_v2.1.0.md`

---

## 🔄 升级指南

### 从 v2.0.0 升级到 v2.1.0

**数据兼容**: 完全兼容，无需任何操作

**主要变化**:

1. Wiki 现在在浏览器中打开
2. 端口管理有专门的页面
3. UI 更简洁

**操作变化**:

- "应用内"和"浏览器"按钮合并为"打开"
- 端口警告点击打开管理页面而非 alert
- 选择文件夹功能已修复

---

## ✅ 测试清单

- [x] 选择文件夹功能正常
- [x] 端口管理页面正常显示
- [x] 可以同时打开多个 Wiki
- [x] 所有 SVG 图标显示正常
- [x] UI 简洁优雅
- [x] 文档已整理

---

## 🎯 下一版本规划

### v2.2.0 计划功能

1. 批量操作

   - 批量启动/停止
   - 批量删除
   - 批量标签修改

2. 自定义主题

   - 主题配色方案
   - 自定义颜色
   - 主题导入/导出

3. Wiki 分组
   - 创建分组
   - 分组管理
   - 分组折叠/展开

---

**版本**: 2.1.0  
**发布**: 2025-10-27  
**状态**: ✅ 完成
