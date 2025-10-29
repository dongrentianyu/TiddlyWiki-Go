# TiddlyWiki Manager v3.2.0 升级摘要

## 🚀 快速概览

**版本**: v3.1.0 → v3.2.0  
**发布日期**: 2025-10-29  
**更新类型**: 重要改进更新 (Improvement Release)

---

## ⚡ 核心修复

### 1. 🔥 修复卡片/列表视图启动按钮消失

**问题**: v3.1.0 中卡片视图和列表视图的启动按钮完全不显示，用户无法启动 Wiki

**根本原因**: `GetWikiStatus` 返回 `bool` 类型，但代码错误地将其直接作为字符串使用

**修复**:

```typescript
// 修改前 (v3.1.0)
const checkStatus = async () => {
  const st = await GetWikiStatus(wiki.id); // 返回 bool
  setStatus(st as "running" | "stopped"); // ❌ 错误的类型转换
};

// 修改后 (v3.2.0)
const checkStatus = async () => {
  const isRunning = await GetWikiStatus(wiki.id);
  setStatus(isRunning ? "running" : "stopped"); // ✅ 正确转换
};
```

**影响**:

- ✅ 卡片视图启动按钮恢复正常
- ✅ 列表视图启动按钮恢复正常
- ✅ 状态每 2 秒自动刷新

---

### 2. 🎨 全面重新设计筛选界面 CSS

**问题**: v3.1.0 的筛选界面"太难看了，几乎看不出有改进的痕迹"

**修复**: 应用现代化设计语言，全面重写 CSS

**设计改进**:

1. **渐变背景**

   ```css
   background: linear-gradient(
     135deg,
     rgba(102, 126, 234, 0.05) 0%,
     rgba(118, 75, 162, 0.05) 100%
   );
   box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
   ```

2. **卡片式布局**

   ```css
   .filter-section {
     padding: 30px;
     border-radius: 12px;
     transition: all 0.3s ease;
   }

   .filter-section:hover {
     transform: translateY(-2px);
   }
   ```

3. **高级动画效果**
   - 分类按钮：光波从左扫过
   - 标签按钮：中心扩散涟漪
   - 操作按钮：白色光晕效果

**影响**:

- ✅ 现代化、美观的 UI 设计
- ✅ 丰富的交互动画反馈
- ✅ 统一的紫色主题配色
- ✅ 响应式移动端适配

---

### 3. 🐛 修复选择文件夹导致应用退出

**问题**: v3.1.0 中点击"选择文件夹"按钮后应用直接退出，非常愚蠢

**修复**:

```typescript
// 修改后 (v3.2.0)
const handleSelectFolder = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    const path = await SelectFolder();
    console.log("Selected folder:", path);
    if (path && path.trim() !== "") {
      setParentDir(path);
    } else {
      console.log("User cancelled folder selection");
    }
  } catch (error: any) {
    // 区分用户取消和真正的错误
    if (error && !error.toString().includes("cancel")) {
      console.warn("Folder selection error:", error);
    }
  }
};
```

**改进点**:

- 精确的类型定义
- 详细的日志记录
- 区分取消和错误
- 防止事件冒泡

**影响**:

- ✅ 选择文件夹功能正常工作
- ✅ 取消选择不再导致退出
- ✅ 错误处理更完善

---

## 📋 变更文件列表

### 前端文件

1. **frontend/src/components/WikiCard.tsx**

   - 修复 `checkStatus` 函数中的类型转换错误
   - 添加错误时的默认状态处理

2. **frontend/src/components/FilterPanel2.css**

   - 全面重写 CSS 样式（新增约 150 行）
   - 添加渐变背景和卡片布局
   - 添加光波、涟漪等动画效果
   - 添加响应式设计

3. **frontend/src/components/CreateWikiForm.tsx**
   - 改进 `handleSelectFolder` 的错误处理
   - 添加详细日志记录
   - 精确的 TypeScript 类型定义

### 后端文件

1. **app.go**

   - 更新版本号：`3.1.0` → `3.2.0`

2. **wails.json**
   - 更新版本号：`3.1.0` → `3.2.0`

### 文档文件

1. **docs/v3.2.0/RELEASE_v3.2.0.md** - 新建
2. **README.md** - 更新版本信息
3. **UPGRADE_SUMMARY_v3.2.0.md** - 新建

---

## 🔄 升级步骤

### 从 v3.1.0 升级

1. **下载新版本**

   ```
   TiddlyWiki-Manager-win64-v3.2.0.exe
   ```

2. **关闭旧版本**

   - 退出应用
   - 停止所有运行中的 Wiki

3. **替换文件**

   - 用 v3.2.0 替换 v3.1.0

4. **启动新版本**

   - 所有数据自动保留
   - 检查卡片视图启动按钮
   - 体验新的筛选界面

5. **验证功能**
   - 测试 Wiki 启动/停止（卡片和列表视图）
   - 查看筛选界面的新设计和动画
   - 测试新建 Wiki 选择文件夹功能

---

## 📊 版本对比

| 功能              | v3.1.0      | v3.2.0      | 改进         |
| ----------------- | ----------- | ----------- | ------------ |
| 卡片视图启动按钮  | ❌ 不显示   | ✅ 正常显示 | 修复类型转换 |
| 列表视图启动按钮  | ❌ 不显示   | ✅ 正常显示 | 修复类型转换 |
| 筛选界面 CSS 设计 | ❌ 简陋     | ✅ 现代美观 | 全面重新设计 |
| 筛选界面动画效果  | ❌ 无       | ✅ 丰富     | 光波、涟漪等 |
| 筛选界面卡片布局  | ❌ 无       | ✅ 有       | 独立卡片     |
| 选择文件夹功能    | ❌ 导致退出 | ✅ 正常     | 改进错误处理 |
| 整体可用性        | ⚠️ 部分异常 | ✅ 完全正常 | 大幅提升     |

---

## 🎨 筛选界面设计亮点

### 视觉设计

- **渐变背景**: 柔和的紫色渐变（#667eea → #764ba2）
- **卡片布局**: 每个筛选区域独立卡片，hover 上浮
- **统一配色**: 紫色主题贯穿始终
- **阴影层次**: 多层次阴影营造立体感

### 交互动画

- **分类按钮**: 光波从左扫过（0.5s 过渡）
- **标签按钮**: 中心扩散涟漪（0.6s 过渡）
- **操作按钮**: 白色光晕扩散（0.6s 过渡）
- **所有按钮**: hover 上浮+放大，点击轻微缩小

### 响应式设计

- 移动端（<768px）自动适配
- 按钮变全宽
- 减小内边距
- 操作按钮垂直排列

---

## ⚠️ 破坏性变更

**无破坏性变更**

所有修改都是内部实现优化和 UI 美化，不影响用户数据和配置。

---

## 💡 使用建议

1. **强烈建议从 v3.1.0 升级**

   - v3.1.0 存在启动按钮消失的严重问题
   - v3.2.0 完全修复了这些问题

2. **升级后体验新功能**

   - 尝试卡片/列表视图启动 Wiki
   - 打开筛选界面，体验新的动画效果
   - 测试新建 Wiki 功能

3. **如遇问题**
   - 查看日志文件（logs 目录）
   - 访问 GitHub 提交 Issue
   - 确认浏览器控制台是否有错误

---

## 📝 相关链接

- **GitHub 仓库**: https://github.com/dongrentianyu/TiddlyWiki-Go
- **v3.2.0 完整发布说明**: docs/v3.2.0/RELEASE_v3.2.0.md
- **问题反馈**: https://github.com/dongrentianyu/TiddlyWiki-Go/issues

---

**TiddlyWiki Manager v3.2.0 - 认真改进，美化 UI，稳定可靠！**
