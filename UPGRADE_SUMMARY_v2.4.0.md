# TiddlyWiki Manager v2.4.0 升级摘要

## 版本信息

- **版本号**: v2.4.0
- **发布日期**: 2025-10-29
- **升级类型**: 功能更新

## 新增功能

### 1. GitHub Actions 自动构建 ✅

- 添加 `.github/workflows/build.yml` 工作流
- 支持 Windows、macOS (AMD64/ARM64)、Linux 多平台构建
- 自动生成带版本号和平台号的构建文件
- 推送标签自动触发构建和发布

**影响**: 简化发布流程，提高构建效率

### 2. 进程管理优化 ✅

- 关闭 Wiki 窗口时自动停止相应进程
- 避免端口占用问题
- 改进用户体验

**影响**: 解决了长期存在的进程泄漏问题

### 3. Wiki 导出功能 ✅

- 新增导出 HTML 按钮
- 使用 `tiddlywiki --build index` 命令
- 自动定位输出文件
- 支持一键导出为静态 HTML

**文件变更**:

- `services/process_service.go`: 添加 `ExportWikiToHTML()` 函数
- `app.go`: 添加 `ExportWikiToHTML()` 接口
- `frontend/src/components/WikiCard.tsx`: 添加导出按钮

### 4. 用户名配置 ✅

- Wiki 模型新增 `username` 字段
- 启动时自动应用用户名参数
- 支持身份验证设置

**文件变更**:

- `models/wiki.go`: 添加 `Username string` 字段
- `services/process_service.go`: 启动时使用 username 参数
- `frontend/src/types/wiki.ts`: 添加 username 字段
- `frontend/src/components/WikiForm.tsx`: 添加用户名输入

### 5. Tabs 选项卡界面 ✅

- 全新的选项卡式布局
- 三个主要标签：Wiki 列表、筛选、信息
- 替换模态框，提升流畅度

**文件变更**:

- `frontend/src/App.tsx`: 重构界面布局
- `frontend/src/App.css`: 添加 tabs 样式

### 6. 分页功能 ✅

- 支持自定义每页显示数量（5/10/20/50/100）
- 显示页码和总页数
- 上一页/下一页导航
- 设置自动保存

**文件变更**:

- `frontend/src/components/WikiList.tsx`: 添加分页逻辑
- `frontend/src/components/WikiList.css`: 添加分页样式

### 7. 列表视图优化 ✅

- 减少列表项间距（12px → 8px）
- 优化显示密度
- 改进视觉效果

### 8. 中英文切换框架 ✅

- 创建国际化系统
- 添加语言切换按钮
- 提供中英文翻译
- 创建英文 README

**新增文件**:

- `frontend/src/i18n/translations.ts`: 翻译文件
- `frontend/src/i18n/LanguageContext.tsx`: 语言上下文
- `README_EN.md`: 英文文档

## 版本更新

- `wails.json`: 版本号 2.3.0 → 2.4.0
- `app.go`: `GetAppVersion()` 返回 "2.4.0"

## 文档更新

### 新增文档

- `docs/v2.4.0/CHANGELOG_v2.4.0.md`: 详细更新日志
- `docs/v2.4.0/RELEASE_v2.4.0.md`: 发布说明
- `docs/v2.4.0/BUILD_COMPLETE_v2.4.0.md`: 构建报告
- `README_EN.md`: 英文 README
- `UPGRADE_SUMMARY_v2.4.0.md`: 本文件

### 更新文档

- `README.md`: 更新版本信息，添加英文链接

## 数据迁移

### 自动迁移

现有数据会自动兼容，新增的 `username` 字段默认为空字符串。

### 设置迁移

- 主题设置：保持不变
- 视图模式：保持不变
- 新增：语言设置（默认中文）
- 新增：分页设置（默认 10 条/页）

## 升级步骤

### 方法 1: 覆盖安装（推荐）

1. 下载新版本安装包
2. 运行安装程序
3. 选择覆盖安装
4. 数据自动迁移

### 方法 2: 全新安装

1. 备份数据文件：
   - Windows: `C:\Users\<username>\.tiddlywiki-manager\data.json`
   - macOS: `/Users/<username>/.tiddlywiki-manager/data.json`
   - Linux: `/home/<username>/.tiddlywiki-manager/data.json`
2. 卸载旧版本
3. 安装新版本
4. 恢复数据文件（如需要）

## 兼容性

### 向后兼容

- ✅ 完全兼容 v2.3.0 的数据格式
- ✅ 自动添加新字段的默认值
- ✅ 保留所有现有功能

### 破坏性变更

- ⚠️ 关闭窗口行为改变：现在会自动停止进程
  - 如需保持进程运行，请不要关闭窗口
  - 可以最小化窗口而不是关闭

## 性能改进

- 优化进程管理，减少内存占用
- 改进界面渲染性能
- 优化大量 Wiki 时的显示性能（分页）

## 已知问题

- 中英文切换仅为框架，完整翻译将在后续版本完成
- 某些长文本可能在列表视图中显示不完整

## 下一版本计划（v2.5.0）

1. **完整国际化**

   - 完成所有界面文本的翻译
   - 多语言文档

2. **批量操作**

   - 批量启动/停止
   - 批量导出
   - 批量编辑

3. **主题系统**

   - 更多主题选项
   - 自定义主题

4. **性能优化**
   - 虚拟滚动
   - 懒加载

## 反馈渠道

- GitHub Issues: 报告 bug
- GitHub Discussions: 功能建议
- 邮件: user@example.com

## 总结

v2.4.0 是一个重要的功能更新版本，主要改进了：

1. 自动化构建和发布
2. 进程管理和用户体验
3. 实用功能（导出、分页等）
4. 界面布局和国际化基础

建议所有用户升级到此版本以获得更好的体验。

---

**感谢使用 TiddlyWiki Manager！**
