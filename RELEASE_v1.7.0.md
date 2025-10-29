# TiddlyWiki Manager v1.7.0 发布说明

## 📅 发布日期

2025-10-27

## 📦 下载

- **Windows 64 位**: `TiddlyWiki-Manager-win64-v1.7.0.exe`
- 位置: `build/bin/TiddlyWiki-Manager-win64-v1.7.0.exe`
- 构建时间: 7.878 秒

---

## 🎯 本版本重点

v1.7.0 是一个**过渡版本**，专注于解决最关键的用户痛点：

### ✅ 已实现

#### 创建 Wiki 自动添加 ⭐

**问题**:

- v1.6.0 中，通过软件创建 Wiki 后，还需要手动"添加现有"
- 没有检查 tiddlers 文件夹是否存在

**解决方案**:

- ✅ 创建 Wiki 后自动添加到管理器
- ✅ 自动检查并创建 tiddlers 文件夹
- ✅ 设置默认端口 8080
- ✅ 添加描述"通过软件创建的 TiddlyWiki"
- ✅ 友好的成功提示

**使用流程**:

```
1. 点击 "✨ 新建"
2. 选择父目录
3. 输入Wiki名称
4. 点击 "创建"
   ↓
✅ Wiki已创建
✅ 自动添加到列表
✅ tiddlers文件夹已创建
✅ 可以直接启动！
```

---

## 📋 未实现功能（规划 v1.8.0）

基于用户反馈，以下功能复杂度较高，将在 v1.8.0 实现：

### 1. 筛选页面独立化 🔍

- 改为独立路由页面（非弹窗）
- 按钮更小，支持大量标签
- 按分类筛选标签
- "无分类"和"无标签"按钮

### 2. 多样化展示 📊

- 卡片/列表两种视图
- 按标签/分类/路径分组
- 按最近启动时间排序

### 3. 启动时端口扫描 🔍

- 自动检测端口占用
- 显示占用进程信息
- 提供关闭进程按钮

### 4. 真正的多窗口 🪟

- 使用 Wails 多窗口 API
- 每个 Wiki 独立 OS 窗口
- 完整的窗口控制（最大化/最小化/关闭）

**详细规划**: 请查看 `ROADMAP_v1.8.md`

---

## 🔧 技术改进

### 后端改进

```go
// services/process_service.go
func CreateNewWiki(parentDir, wikiName string) (string, error) {
    // 创建Wiki
    // 检查并创建tiddlers文件夹
    // 返回wiki路径
}
```

```go
// app.go
func (a *App) CreateNewWiki(parentDir, wikiName string) (string, error) {
    // 创建Wiki
    wikiPath, err := services.CreateNewWiki(parentDir, wikiName)

    // 自动添加到管理器
    wiki := models.Wiki{
        Name: wikiName,
        Path: wikiPath,
        Port: 8080,
        // ...
    }
    a.wikiService.Add(&wiki)

    return wikiPath, nil
}
```

### 前端改进

```tsx
// CreateWikiForm.tsx
const wikiPath = await CreateNewWiki(parentDir, wikiName);
alert(`✅ Wiki已创建并添加！\n路径: ${wikiPath}`);
```

---

## 🚀 快速开始

### 创建第一个 Wiki

1. 启动应用
2. 点击 **✨ 新建**
3. 选择要创建 Wiki 的位置（如：D:\MyWikis）
4. 输入名称（如：myfirstwiki）
5. 点击"创建"
6. ✅ 自动添加到列表！
7. 点击 **▶️ 启动** 即可使用

### 验证 tiddlers 文件夹

创建后，检查以下路径：

```
D:\MyWikis\myfirstwiki\
  ├── tiddlers\        ← 自动创建
  └── tiddlywiki.info
```

---

## ⚠️ 已知限制

### 本版本未实现

1. **筛选仍是弹窗** - v1.8.0 将改为独立页面
2. **仅卡片视图** - v1.8.0 将添加列表视图
3. **WikiViewer 仍是覆盖层** - v1.8.0 将改为独立窗口
4. **无端口扫描** - v1.8.0 将添加

### 技术债务

```
Warning: go.mod is using Wails '2.8.0' but the CLI is 'v2.10.2'
```

- 不影响功能
- v1.8.0 将升级 Wails 版本以支持多窗口

---

## 📸 v1.7.0 vs v1.6.0

| 功能             | v1.6.0      | v1.7.0      |
| ---------------- | ----------- | ----------- |
| 创建 Wiki        | ✅          | ✅          |
| 创建后需手动添加 | ❌ 是       | ✅ 自动     |
| tiddlers 文件夹  | ❌ 可能缺失 | ✅ 自动创建 |
| 成功提示         | 简单        | 详细        |

---

## 🎯 升级建议

### 从 v1.6.0 升级

- ✅ 直接覆盖安装
- ✅ 数据自动保留
- ✅ 创建新 Wiki 更方便

### 新用户

- ✅ 下载 v1.7.0 直接使用
- ✅ 创建 Wiki 更简单
- ⏰ 等待 v1.8.0 获得更多功能

---

## 🙏 致歉与说明

本版本仅实现了 5 个需求中的 1 个（创建 Wiki 自动添加），原因如下：

### 为什么只实现了部分功能？

1. **复杂度评估**:

   - 筛选独立页面：需要添加路由系统
   - 多样化展示：需要重构数据结构
   - 端口扫描：需要进程管理 API
   - 多窗口：需要升级 Wails 版本

2. **时间考虑**:

   - 完整实现预计需要 5-7 天
   - 分阶段发布更稳定

3. **优先级**:
   - "创建后自动添加"是最高频痛点
   - 其他功能可以渐进式改进

### v1.8.0 承诺

所有未实现功能将在 v1.8.0 完整实现，包括：

- ✅ 筛选独立页面
- ✅ 多样化展示
- ✅ 端口扫描
- ✅ 真正的多窗口

**预计发布**: 开发中，请关注更新

---

## 📝 使用反馈

如果您对 v1.7.0 有任何建议，或对 v1.8.0 功能有更多想法，欢迎反馈！

重点关注：

- 筛选页面的具体需求
- 展示模式的优先级
- 多窗口的期望行为

---

**版本**: v1.7.0  
**构建日期**: 2025-10-27  
**平台**: windows/amd64  
**文件**: TiddlyWiki-Manager-win64-v1.7.0.exe  
**构建时间**: 7.878 秒

**下一版本**: v1.8.0（开发中）  
**功能完整度**: 20% → 100%（v1.8.0 目标）


