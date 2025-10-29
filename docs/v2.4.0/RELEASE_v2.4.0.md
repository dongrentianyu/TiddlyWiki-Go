# TiddlyWiki Manager v2.4.0 发布说明

## 版本信息

- **版本号**: v2.4.0
- **发布日期**: 2025-10-29
- **类型**: 功能更新版本

## 重要更新

### 🎉 主要新功能

#### 1. GitHub Actions 自动构建和发布

现在项目支持通过 GitHub Actions 自动构建和发布，生成的文件格式为：

- `TiddlyWiki-Manager-win64-v2.4.0.exe`
- `TiddlyWiki-Manager-darwin-amd64-v2.4.0.tar.gz`
- `TiddlyWiki-Manager-darwin-arm64-v2.4.0.tar.gz`
- `TiddlyWiki-Manager-linux-amd64-v2.4.0`

#### 2. 改进的进程管理

关闭 Wiki 窗口时自动停止相应的 TiddlyWiki 进程，避免端口占用问题。

#### 3. Wiki 导出为 HTML

新增导出功能，可以将 TiddlyWiki 导出为静态 HTML 文件，方便分享和备份。

#### 4. 用户名认证支持

在 Wiki 设置中添加用户名字段，启动时自动应用身份验证。

#### 5. Tabs 界面重构

全新的选项卡式界面，包含：

- Wiki 列表
- 筛选面板
- 信息面板

#### 6. 分页功能

支持自定义每页显示数量，改善大量 Wiki 的管理体验。

## 下载

### Windows

```
TiddlyWiki-Manager-win64-v2.4.0.exe
```

### macOS

```
TiddlyWiki-Manager-darwin-amd64-v2.4.0.tar.gz  (Intel)
TiddlyWiki-Manager-darwin-arm64-v2.4.0.tar.gz  (Apple Silicon)
```

### Linux

```
TiddlyWiki-Manager-linux-amd64-v2.4.0
```

## 安装说明

### Windows

1. 下载 `TiddlyWiki-Manager-win64-v2.4.0.exe`
2. 双击运行安装程序
3. 按照向导完成安装

### macOS

1. 下载对应架构的 tar.gz 文件
2. 解压文件
3. 将 TiddlyWiki-Manager.app 移动到应用程序文件夹

### Linux

1. 下载二进制文件
2. 添加执行权限：`chmod +x TiddlyWiki-Manager-linux-amd64-v2.4.0`
3. 运行：`./TiddlyWiki-Manager-linux-amd64-v2.4.0`

## 系统要求

- **操作系统**: Windows 10+, macOS 10.15+, Ubuntu 20.04+
- **Node.js**: 需要安装 TiddlyWiki (`npm install -g tiddlywiki`)
- **内存**: 最低 2GB RAM
- **磁盘空间**: 100MB+

## 功能亮点

### 🚀 性能提升

- 优化进程管理
- 改进内存使用
- 更快的启动速度

### 🎨 界面改进

- 全新 Tabs 布局
- 优化视觉效果
- 更好的响应式设计

### 🛠️ 实用功能

- Wiki 导出
- 分页浏览
- 用户名认证
- 自动进程管理

## 使用建议

### 新用户

1. 首次运行后，点击"新建"创建第一个 Wiki
2. 或点击"添加"导入现有的 Wiki
3. 使用筛选功能管理多个 Wiki
4. 查看信息面板了解系统状态

### 从旧版本升级

1. 备份 `~/.tiddlywiki-manager/data.json`
2. 安装新版本
3. 数据会自动迁移
4. 新增的用户名字段为可选

## 反馈和支持

- **问题反馈**: [GitHub Issues](https://github.com/your-repo/issues)
- **功能建议**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **文档**: [项目 README](../README.md)

## 致谢

感谢所有用户的反馈和建议，帮助我们不断改进 TiddlyWiki Manager。

---

**祝您使用愉快！**
