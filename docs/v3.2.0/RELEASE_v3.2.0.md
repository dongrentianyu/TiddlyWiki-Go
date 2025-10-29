# TiddlyWiki Manager v3.2.0 发布说明

## 🎉 版本概览

v3.2.0 是一个**重要的改进版本**，修复了卡片/列表视图启动按钮消失的问题，全面重新设计了筛选界面，并修复了选择文件夹导致应用退出的严重 Bug。

**发布日期**: 2025-10-29  
**版本类型**: 改进更新 (Improvement Release)

---

## 🔥 核心修复

### 1. ✅ 修复卡片视图和列表视图启动按钮消失

**这是 v3.2.0 最重要的修复！**

#### 问题描述（v3.1.0）

- 卡片视图和列表视图中启动按钮完全消失
- 用户无法启动已停止的 Wiki
- 状态判断逻辑错误：将 bool 值错误地转换为字符串

#### 根本原因

```typescript
// ❌ 错误的实现（v3.1.0）
const checkStatus = async () => {
  try {
    const st = await GetWikiStatus(wiki.id); // 返回 bool
    setStatus(st as "running" | "stopped"); // 错误的类型转换
  } catch (error) {
    console.error("Failed to get status:", error);
  }
};
```

GetWikiStatus 返回的是`bool`类型（true/false），但代码尝试直接将其作为字符串类型（"running"/"stopped"）使用，导致状态判断失败。

#### 解决方案（v3.2.0）

**正确的类型转换**：

```typescript
// ✅ 正确的实现（v3.2.0）
const checkStatus = async () => {
  try {
    const isRunning = await GetWikiStatus(wiki.id);
    setStatus(isRunning ? "running" : "stopped"); // 正确转换为字符串
  } catch (error) {
    console.error("Failed to get status:", error);
    setStatus("stopped"); // 出错时默认为停止状态
  }
};
```

#### 效果

- ✅ **卡片视图启动按钮正常显示**
- ✅ **列表视图启动按钮正常显示**
- ✅ **状态实时更新（每 2 秒检查一次）**
- ✅ **启动/停止/重启按钮正确切换**

---

### 2. 🎨 全面重新设计筛选界面 CSS

**用户强烈要求的功能！**

#### 问题描述（v3.1.0）

- 筛选界面样式简陋，"太难看了"
- 缺乏视觉层次感
- 没有交互动画和反馈
- 整体美观度极低

#### 解决方案（v3.2.0）

**现代化设计语言**：

1. **渐变背景和卡片效果**

   ```css
   .filter-panel2 {
     background: linear-gradient(
       135deg,
       rgba(102, 126, 234, 0.05) 0%,
       rgba(118, 75, 162, 0.05) 100%
     );
     border-radius: 16px;
     box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
   }
   ```

2. **分组卡片式设计**

   ```css
   .filter-section {
     padding: 30px;
     background: var(--bg-secondary);
     border-radius: 12px;
     transition: all 0.3s ease;
     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
   }

   .filter-section:hover {
     transform: translateY(-2px);
     box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
   }
   ```

3. **高级按钮动画效果**

   ```css
   /* 分类按钮光波扫过效果 */
   .filter-category-btn::before {
     content: "";
     background: linear-gradient(
       90deg,
       transparent,
       rgba(102, 126, 234, 0.1),
       transparent
     );
     transition: left 0.5s;
   }

   /* 标签按钮涟漪扩散效果 */
   .filter-tag-btn::after {
     border-radius: 50%;
     background: rgba(102, 126, 234, 0.2);
     transition: width 0.6s, height 0.6s;
   }
   ```

4. **操作按钮大幅强化**

   ```css
   .btn-filter {
     padding: 16px 36px;
     font-size: 16px;
     font-weight: 700;
     text-transform: uppercase;
     letter-spacing: 0.5px;
   }

   .btn-apply {
     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4);
   }
   ```

#### 视觉改进

- ✅ **渐变背景** - 柔和的紫色渐变
- ✅ **卡片化布局** - 每个筛选区域独立卡片
- ✅ **动画交互** - hover 时平滑动画反馈
- ✅ **统一配色** - 紫色主题，视觉协调
- ✅ **增大间距** - 更舒适的视觉体验
- ✅ **阴影层次** - 立体感更强
- ✅ **响应式设计** - 移动端适配

---

### 3. 🐛 修复新建 Wiki 时选择文件夹导致应用退出

**严重的用户体验问题！**

#### 问题描述（v3.1.0）

- 点击"选择文件夹"按钮后应用直接退出
- 用户无法正常创建新的 Wiki
- 错误处理不完善

#### 根本原因

- 类型定义不精确
- 错误捕获不完善
- 缺少详细日志

#### 解决方案（v3.2.0）

**改进的错误处理**：

```typescript
// ✅ v3.2.0 实现
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
    console.error("Failed to select folder:", error);
    // 用户取消选择是正常行为，不显示错误
    if (error && error.toString && !error.toString().includes("cancel")) {
      console.warn("Folder selection error:", error);
    }
  }
};
```

#### 改进点

- ✅ **精确的类型定义** - `React.MouseEvent<HTMLButtonElement>`
- ✅ **详细的日志记录** - 成功和失败都有日志
- ✅ **区分取消和错误** - 用户取消不显示错误
- ✅ **防止事件冒泡** - preventDefault + stopPropagation

---

## 📋 完整更新列表

| 更新项目                  | v3.1.0      | v3.2.0  | 说明                           |
| ------------------------- | ----------- | ------- | ------------------------------ |
| 1. 卡片/列表视图启动按钮  | ❌ 消失     | ✅      | 修复 bool 到 string 的转换错误 |
| 2. 筛选界面 CSS 设计      | ❌ 简陋     | ✅ 美观 | 全面重新设计，现代化 UI        |
| 3. 选择文件夹导致应用退出 | ❌ 严重 Bug | ✅      | 改进错误处理和类型定义         |
| 4. 筛选界面动画效果       | ❌ 无       | ✅      | 光波、涟漪等高级动画           |
| 5. 筛选界面卡片布局       | ❌ 无       | ✅      | 独立卡片，hover 效果           |
| 6. 筛选界面响应式设计     | ⚠️ 部分     | ✅      | 完整的移动端适配               |
| 7. 版本号                 | 3.1.0       | 3.2.0   | 改进更新                       |

---

## 🎨 筛选界面设计亮点

### 渐变背景

- 柔和的紫色渐变（#667eea → #764ba2）
- 透明度 5%，不干扰内容阅读

### 卡片式布局

- 每个筛选区域独立卡片
- hover 时上浮 2px，阴影增强
- 圆角 12px，柔和现代

### 按钮动画

- **分类按钮**：光波从左扫过效果
- **标签按钮**：从中心扩散的涟漪效果
- **操作按钮**：中心扩散的白色光晕

### 交互反馈

- hover 时按钮上浮和放大
- 点击时轻微缩小效果
- 平滑过渡动画（0.3s cubic-bezier）

### 颜色系统

- 主色：#667eea（紫蓝）
- 副色：#764ba2（紫红）
- 选中状态：渐变背景
- 未选中：透明背景+边框

---

## 🔧 技术改进

### 前端改进

**文件**: `frontend/src/components/WikiCard.tsx`

```typescript
const checkStatus = async () => {
  try {
    const isRunning = await GetWikiStatus(wiki.id);
    setStatus(isRunning ? "running" : "stopped");
  } catch (error) {
    console.error("Failed to get status:", error);
    setStatus("stopped");
  }
};
```

**文件**: `frontend/src/components/FilterPanel2.css`

- 新增渐变背景
- 新增卡片 hover 效果
- 新增按钮动画效果
- 新增响应式布局
- 改进间距和排版

**文件**: `frontend/src/components/CreateWikiForm.tsx`

```typescript
const handleSelectFolder = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    const path = await SelectFolder();
    console.log("Selected folder:", path);
    if (path && path.trim() !== "") {
      setParentDir(path);
    }
  } catch (error: any) {
    // 改进的错误处理
    if (error && !error.toString().includes("cancel")) {
      console.warn("Folder selection error:", error);
    }
  }
};
```

### 后端改进

**文件**: `app.go`

```go
// GetAppVersion returns the application version
func (a *App) GetAppVersion() string {
	return "3.2.0"
}
```

---

## 📦 构建信息

**文件名**: `TiddlyWiki-Manager-win64-v3.2.0.exe`  
**位置**: `build\bin\`  
**版本**: v3.2.0  
**构建日期**: 2025-10-29  
**大小**: ~10.3 MB

---

## 🔄 升级说明

### 从 v3.1.0 升级到 v3.2.0

**重要提示**: 强烈建议升级，修复了启动按钮消失的严重问题！

1. **下载新版本**

   - `TiddlyWiki-Manager-win64-v3.2.0.exe`

2. **关闭旧版本**

   - 退出应用程序
   - **如果有运行中的 Wiki，请先停止**

3. **替换文件**

   - 用新版本替换旧版本

4. **启动新版本**

   - 所有数据和配置自动保留
   - 检查卡片视图，确认启动按钮显示
   - 查看筛选界面的新设计

5. **验证功能**
   - 测试启动/停止 Wiki
   - 体验新的筛选界面
   - 测试新建 Wiki 功能

---

## 💡 使用指南

### 卡片/列表视图操作

1. **停止状态**

   - 显示 ⚫ 已停止 标签
   - 显示 ▶️ 启动 按钮（绿色，全宽）

2. **运行状态**

   - 显示 🟢 运行中 标签
   - 显示 ⏹️ 停止 + 🔄 重启 按钮
   - 显示 应用内打开 + 浏览器打开 按钮

3. **状态自动刷新**
   - 每 2 秒自动检查一次状态
   - 执行操作后延迟 1-2 秒刷新

### 筛选界面使用

1. **搜索栏**

   - 输入关键词搜索 Wiki 名称、描述、路径
   - focus 时会上浮并增强阴影

2. **分类筛选**

   - 点击分类按钮筛选
   - hover 时光波扫过效果
   - 选中时渐变紫色背景

3. **标签筛选**

   - 点击标签按钮添加/移除
   - hover 时涟漪扩散效果
   - 支持多标签同时筛选
   - 包含"无标签"选项

4. **应用筛选**
   - 点击"应用筛选"按钮生效
   - 点击"重置"按钮清空所有筛选

### 新建 Wiki 操作

1. 点击"新建 Wiki"按钮
2. 点击"📁 选择"按钮选择父目录
3. 输入 Wiki 名称（仅英文字母和数字）
4. 点击"创建"按钮
5. 如果取消选择文件夹，应用不会退出

---

## 🎯 版本对比

### v3.1.0 vs v3.2.0

| 特性             | v3.1.0          | v3.2.0      |
| ---------------- | --------------- | ----------- |
| 卡片视图启动按钮 | ❌ 不显示       | ✅ 正常显示 |
| 列表视图启动按钮 | ❌ 不显示       | ✅ 正常显示 |
| 筛选界面设计     | ❌ 简陋         | ✅ 现代美观 |
| 筛选界面动画     | ❌ 无           | ✅ 丰富     |
| 选择文件夹功能   | ❌ 导致退出     | ✅ 正常工作 |
| 整体可用性       | ⚠️ 部分功能异常 | ✅ 完全正常 |

---

## 🐛 已知问题

**无已知严重问题**

所有 v3.1.0 的严重 Bug 已在 v3.2.0 中修复。

如果发现任何问题，请访问 GitHub 提交 Issue：
https://github.com/dongrentianyu/TiddlyWiki-Go/issues

---

## 📝 相关链接

- **GitHub 仓库**: https://github.com/dongrentianyu/TiddlyWiki-Go
- **TiddlyWiki 官网**: https://tiddlywiki.com/
- **问题反馈**: https://github.com/dongrentianyu/TiddlyWiki-Go/issues

---

## 🙏 致谢

特别感谢用户的持续反馈！

- "为什么卡片视图和列表视图没有启动按钮了" - 帮助我们发现关键 Bug
- "筛选界面太难看了" - 推动我们全面重新设计 UI
- "选择文件夹就会退出应用" - 帮助我们修复严重的用户体验问题

v3.2.0 是一个**真正改进后稳定可用**的版本！

---

**TiddlyWiki Manager v3.2.0 - 修复 Bug，美化 UI，稳定可靠！**
