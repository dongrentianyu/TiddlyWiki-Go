# TiddlyWiki Manager v3.0.0 发布说明

## 🎉 版本概览

v3.0.0 是一个**全新的重要版本**，包含了重大的架构改进和功能完善。这是继 v2.x 系列之后的全新里程碑版本。

**发布日期**: 2025-10-29  
**版本类型**: 重大更新 (Major Release)

---

## 🔥 核心修复

### 1. ✅ 彻底修复表格视图状态判断逻辑

**这是 v3.0.0 最重要的修复！**

#### 问题描述（v2.9.1）

- 表格视图状态判断逻辑错误
- 所有 Wiki 默认显示为"运行中"
- 启动按钮不显示
- 无法正确启动和停止 Wiki

#### 根本原因

```typescript
// ❌ 错误的逻辑（v2.9.1）
getStatus={(id) => {
  const wiki = wikis.find((w) => w.id === id);
  return wiki ? "running" : "stopped"; // 只要找到 wiki 就返回 running
}}
```

这个逻辑完全错误！只要 wiki 存在于列表中就返回 "running"，根本没有检查进程状态。

#### 解决方案（v3.0.0）

**完全重写状态管理逻辑**：

```typescript
// ✅ 正确的逻辑（v3.0.0）
export function WikiTable({ wikis, ... }: WikiTableProps) {
  const [wikiStatuses, setWikiStatuses] = useState<{ [key: string]: string }>({});

  // 使用 useEffect 异步加载真实状态
  useEffect(() => {
    const loadStatuses = async () => {
      const statuses: { [key: string]: string } = {};
      for (const wiki of wikis) {
        try {
          const isRunning = await GetWikiStatus(wiki.id); // 调用后端 API
          statuses[wiki.id] = isRunning ? "running" : "stopped";
        } catch (error) {
          statuses[wiki.id] = "stopped";
        }
      }
      setWikiStatuses(statuses);
    };
    loadStatuses();
  }, [wikis]);

  const getStatus = (id: string) => wikiStatuses[id] || "stopped";
}
```

#### 技术改进

1. **异步状态加载**

   - 使用 `GetWikiStatus(id)` 调用后端真实检查进程状态
   - 使用 `useEffect` 在组件加载时获取状态
   - 使用 `useState` 存储状态

2. **状态缓存**

   - 将所有 wiki 状态缓存在 `wikiStatuses` 对象中
   - 避免重复调用后端 API
   - 当 `wikis` 列表变化时重新加载

3. **错误处理**
   - 如果获取状态失败，默认返回 "stopped"
   - 避免崩溃

#### 效果

- ✅ **正确显示启动按钮**（停止状态时）
- ✅ **正确显示运行按钮**（运行状态时）
- ✅ **状态与实际进程同步**
- ✅ **可以正常启动和停止 Wiki**

---

## ✨ 功能完善

### 2. ✅ GitHub 链接安全优化

**已在 v2.9.1 完成，v3.0.0 确认保留**

- 在当前窗口打开，而非新窗口
- 移除 `target="_blank"` 属性
- 更安全可靠

### 3. ✅ 表格视图完整按钮支持

**已在 v2.9.1 完成，v3.0.0 确认正常工作**

**停止状态时（1 个按钮）**:

- ▶️ 启动

**运行状态时（4 个按钮）**:

- ⏹️ 停止
- 🔄 重启
- 📱 应用内打开
- 🌐 浏览器打开

**始终显示（4 个按钮）**:

- ✏️ 编辑
- 📄 导出 HTML
- 📁 打开文件夹
- 🗑️ 删除

**重启功能优化**:

```typescript
onRestart={async (id) => {
  await RestartWiki(id); // 使用后端的 RestartWiki API
  await loadWikis();
}}
```

### 4. ✅ 筛选面板完整功能

**已在 v2.9.1 完成，v3.0.0 确认正常工作**

- 无标签筛选选项（`__NONE__`）
- 优化的间距（40px）
- 清晰的分类和标签筛选

### 5. ✅ 窗口可自由缩放

**已在 v2.9.1 完成，v3.0.0 确认正常工作**

- 最小宽度：800px
- 最小高度：600px
- 初始大小：1200x800
- 可自由拖动调整大小

---

## 📋 完整更新列表

| 更新项目                | v2.9.1      | v3.0.0 | 说明                             |
| ----------------------- | ----------- | ------ | -------------------------------- |
| 1. 表格视图状态判断逻辑 | ❌ 严重 Bug | ✅     | 完全重写，正确使用 GetWikiStatus |
| 2. GitHub 链接安全      | ✅          | ✅     | 在当前窗口打开                   |
| 3. 表格视图完整按钮     | ✅          | ✅     | 8 个按钮，功能完整               |
| 4. 筛选面板无标签选项   | ✅          | ✅     | 正常工作                         |
| 5. 窗口可缩放           | ✅          | ✅     | 正常工作                         |
| 6. 重启功能             | ⚠️ 简陋     | ✅     | 使用后端 RestartWiki API         |
| 7. 进程终止             | ✅          | ✅     | taskkill 强制终止进程树          |
| 8. 导出 HTML 时间戳     | ✅          | ✅     | 只保留时间戳版本                 |
| 9. 版本号               | 2.9.1       | 3.0.0  | 重大版本更新                     |

---

## 🔧 技术改进

### 前端架构改进

1. **WikiTable.tsx**

   - **新增**: `useState` 管理状态缓存
   - **新增**: `useEffect` 异步加载状态
   - **新增**: `GetWikiStatus` 导入
   - **移除**: 同步的 `getStatus` prop
   - **改进**: 使用真实后端 API 检查状态

2. **App.tsx**

   - **移除**: 错误的 `getStatus` 实现
   - **简化**: WikiTable props
   - **改进**: 使用 `RestartWiki` API

3. **状态管理**
   - **v2.9.1**: 错误的同步判断
   - **v3.0.0**: 正确的异步加载和缓存

### 后端 API 确认

1. **GetWikiStatus(id)** - 检查 Wiki 是否运行
2. **StartWiki(id)** - 启动 Wiki
3. **StopWiki(id)** - 停止 Wiki（使用 taskkill）
4. **RestartWiki(id)** - 重启 Wiki
5. **ExportWikiToHTML(id)** - 导出 HTML（带时间戳）

---

## 📦 构建信息

**文件名**: `TiddlyWiki-Manager-win64-v3.0.0.exe`  
**位置**: `build\bin\`  
**版本**: v3.0.0  
**构建日期**: 2025-10-29  
**大小**: ~10.3 MB

---

## 🔄 升级说明

### 从 v2.x 升级到 v3.0.0

**重要提示**: 这是一个重大版本更新，包含架构改进。

1. **下载新版本**

   - `TiddlyWiki-Manager-win64-v3.0.0.exe`

2. **关闭旧版本**

   - 退出应用程序
   - **如果有运行中的 Wiki，请先停止**

3. **替换文件**

   - 用新版本替换旧版本

4. **启动新版本**

   - 所有数据和配置自动保留
   - 检查表格视图，确认状态显示正确

5. **验证功能**
   - 测试启动/停止 Wiki
   - 测试表格视图状态显示
   - 测试重启功能

---

## 💡 使用指南

### 表格视图正确使用

1. **查看状态**

   - 🟢 运行中 - 显示停止、重启、应用内打开、浏览器打开按钮
   - ⚫ 已停止 - 显示启动按钮

2. **启动 Wiki**

   - 停止状态时点击 ▶️ 按钮
   - 等待状态变为运行中
   - 显示运行相关按钮

3. **停止 Wiki**

   - 运行状态时点击 ⏹️ 按钮
   - 进程彻底终止（使用 taskkill）
   - 端口立即释放

4. **重启 Wiki**
   - 运行状态时点击 🔄 按钮
   - 使用后端 `RestartWiki` API
   - 自动重新加载配置

### 状态刷新

- 状态会在以下情况自动刷新：
  - 组件加载时
  - wikis 列表变化时
  - 执行启动/停止/重启后

### 筛选无标签 Wiki

1. 切换到 **🔍 筛选** 标签页
2. 点击 **无标签** 按钮（第一个）
3. 点击 **✅ 应用筛选**
4. 查看所有无标签 Wiki

---

## 🐛 已知问题

**无已知严重问题**

所有 v2.x 的重大 Bug 已在 v3.0.0 中修复。

如果发现任何问题，请访问 GitHub 提交 Issue：
https://github.com/dongrentianyu/TiddlyWiki-Go/issues

---

## 🎯 版本对比

### v2.9.1 vs v3.0.0

| 特性         | v2.9.1      | v3.0.0      |
| ------------ | ----------- | ----------- |
| 表格视图状态 | ❌ 错误     | ✅ 正确     |
| 启动按钮     | ❌ 不显示   | ✅ 显示     |
| 状态判断     | ❌ 同步错误 | ✅ 异步正确 |
| 重启功能     | ⚠️ 简陋     | ✅ 完善     |
| 架构质量     | 中等        | 优秀        |

---

## 📝 技术文档

### 状态管理流程

```
1. 用户打开表格视图
   ↓
2. WikiTable 组件加载
   ↓
3. useEffect 触发
   ↓
4. 遍历所有 wikis
   ↓
5. 调用 GetWikiStatus(wiki.id)
   ↓
6. 后端检查进程是否运行
   ↓
7. 返回 true/false
   ↓
8. 更新 wikiStatuses 状态
   ↓
9. 组件重新渲染，显示正确按钮
```

### 按钮显示逻辑

```typescript
{
  status === "stopped" ? (
    // 停止状态：显示启动按钮
    <button onClick={() => onStart(wiki.id)}>▶️</button>
  ) : (
    // 运行状态：显示停止、重启、打开按钮
    <>
      <button onClick={() => onStop(wiki.id)}>⏹️</button>
      <button onClick={() => onRestart(wiki.id)}>🔄</button>
      <button onClick={() => onOpenWiki(wiki)}>📱</button>
      <button onClick={() => onOpenInBrowser(wiki)}>🌐</button>
    </>
  );
}
```

---

## 🎯 下一步计划

1. 完善中英文翻译到所有组件
2. 筛选方案历史保存
3. 批量操作功能
4. Wiki 模板管理
5. 性能优化

---

## 📝 相关链接

- **GitHub 仓库**: https://github.com/dongrentianyu/TiddlyWiki-Go
- **TiddlyWiki 官网**: https://tiddlywiki.com/
- **问题反馈**: https://github.com/dongrentianyu/TiddlyWiki-Go/issues

---

## 🙏 致谢

特别感谢用户持续的反馈和测试，帮助我们发现并修复了表格视图状态判断的重大 Bug！

v3.0.0 是一个全新的里程碑，标志着 TiddlyWiki Manager 进入了更成熟的阶段。

---

**TiddlyWiki Manager v3.0.0 - 全新架构，稳定可靠！**
