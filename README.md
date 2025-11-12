# TiddlyWiki Manager

> 一个现代化的 TiddlyWiki 管理工具，让你的知识管理更高效

## ✨ 主要功能

- **Wiki 管理**: 添加、编辑、删除 TiddlyWiki
- **一键启动**: 快速启动/停止/重启 Wiki 服务
- **端口管理**: 智能检测端口占用，一键关闭进程
- **多种视图**: 卡片视图和列表视图
- **灵活筛选**: 按分类、标签、路径、最近启动筛选
- **新建 Wiki**: 通过软件直接创建新的 TiddlyWiki
- **多 Wiki 支持**: 同时打开和使用多个 Wiki
- **主题切换**: 深色/浅色模式

## 🚀 快速开始

### 系统要求

- Windows 10/11 (64-bit)
- Node.js 18+
- TiddlyWiki CLI (`npm install -g tiddlywiki`)

### 下载与运行

1. 下载最新版本：`TiddlyWiki-Manager-win64-v2.3.0.exe`
2. 双击运行
3. 开始管理你的 TiddlyWiki

### 基本使用

1. **添加 Wiki**: 点击"添加"按钮，选择 Wiki 文件夹
2. **新建 Wiki**: 点击"新建"按钮，选择位置并输入名称
3. **启动 Wiki**: 点击"启动"按钮
4. **打开 Wiki**: 点击"打开"按钮（在应用内窗口中打开）
5. **端口管理**: 点击端口管理按钮查看和管理端口

## 🛠️ 开发

### 技术栈

- **后端**: Go + Wails v2
- **前端**: React + TypeScript + Vite
- **UI**: CSS Variables (支持主题切换)

### 开发环境

```bash
# 开发模式
wails dev

# 构建
wails build
```

### 项目结构

```
TiddlyWiki-Go/
├── app.go              # 主应用逻辑
├── main.go            # 入口文件
├── models/            # 数据模型
├── services/          # 业务服务
├── storage/           # 数据存储
├── frontend/          # 前端代码
│   └── src/
│       ├── components/  # React组件
│       ├── types/       # TypeScript类型
│       └── wailsjs/     # Wails绑定
└── build/             # 构建输出
    └── bin/
```

## 🎯 主要特性

### 端口管理

- 自动检测端口占用状态
- 独立的端口管理界面
- 一键关闭占用进程
- 实时刷新端口状态

### 多 Wiki 支持

- 同时启动多个 Wiki
- 在浏览器中打开 Wiki
- 利用浏览器多标签页功能
- 每个 Wiki 独立运行

### 智能筛选

- 按分类筛选
- 按标签筛选（支持多选）
- 按路径排序
- 按最近启动排序
- 无分类/无标签快速筛选

### 视图模式

- 卡片视图：适合浏览
- 列表视图：适合管理大量 Wiki
- 视图偏好自动保存

## 📖 使用技巧

### 快速筛选

- 直接点击 Wiki 卡片上的分类或标签自动筛选

### 高效浏览

- 少量 Wiki 使用卡片视图
- 大量 Wiki 使用列表视图

### 端口管理

- 定期检查端口状态
- 关闭进程前确认不是系统进程
- 通过软件启动的 Wiki 使用"停止"按钮

## 📝 许可证

本项目采用 MIT 许可证。
