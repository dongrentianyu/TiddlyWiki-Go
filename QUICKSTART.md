# 快速开始指南

## 5 分钟上手 TiddlyWiki Manager

### 步骤 1：安装必要工具

#### 1.1 安装 Go（如果尚未安装）

1. 访问 https://golang.org/dl/
2. 下载 Windows 安装包
3. 运行安装程序，使用默认设置
4. 打开新的命令提示符，验证安装：
   ```bash
   go version
   ```

#### 1.2 安装 Node.js 和 TiddlyWiki

1. 访问 https://nodejs.org/
2. 下载并安装 LTS 版本
3. 打开命令提示符，安装 TiddlyWiki：
   ```bash
   npm install -g tiddlywiki
   ```
4. 验证安装：
   ```bash
   tiddlywiki --version
   ```

#### 1.3 安装 Wails CLI

在命令提示符中运行：

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

**重要**：将 Go bin 目录添加到系统 PATH：

- 打开"系统属性" → "环境变量"
- 在"用户变量"中找到 `Path`
- 添加：`C:\Users\你的用户名\go\bin`

验证安装：

```bash
wails version
```

### 步骤 2：准备项目

#### 2.1 进入项目目录

```bash
cd D:\TIDGIT\TiddlyWiki-Go
```

#### 2.2 安装前端依赖

```bash
cd frontend
npm install
cd ..
```

### 步骤 3：开发运行

```bash
wails dev
```

应用将自动打开，您可以立即开始使用！

### 步骤 4：创建第一个 TiddlyWiki（如果还没有）

如果您还没有 TiddlyWiki，快速创建一个：

```bash
# 在您喜欢的位置创建
cd D:\Wikis
tiddlywiki mynewwiki --init server
```

### 步骤 5：在应用中添加 Wiki

1. 点击"➕ 添加新 Wiki"
2. 填写信息：
   - 名称：`我的第一个 Wiki`
   - 路径：`D:\Wikis\mynewwiki`（使用"选择"按钮浏览）
   - 端口：`8080`（默认）
3. 点击"添加"

### 步骤 6：启动和使用

1. 在 Wiki 卡片上点击"▶️ 启动"
2. 等待状态变为"🟢 运行中"
3. 点击"🌐 打开"在浏览器中访问

恭喜！您已成功运行 TiddlyWiki Manager！

## 构建可执行文件（EXE）

### 方法 1：简单构建

生成单个 EXE 文件：

```bash
wails build -platform windows/amd64 -o TiddlyWiki-Manager-win64-v1.4.0.exe
```

文件位置：`build\bin\TiddlyWiki-Manager-win64-v1.4.0.exe`

### 方法 2：创建安装程序

#### 选项 A：NSIS 安装程序（推荐）

1. **下载并安装 NSIS**

   - 访问：https://nsis.sourceforge.io/Download
   - 下载 NSIS 3.x
   - 运行安装程序

2. **将 NSIS 添加到 PATH**

   - 默认安装路径：`C:\Program Files (x86)\NSIS`
   - 添加到系统环境变量 PATH

3. **构建安装程序**

   ```bash
   wails build -nsis
   ```

4. **输出**
   - 安装程序：`build\bin\tiddlywiki-manager-amd64-installer.exe`

#### 选项 B：便携版 ZIP

1. 构建应用：

   ```bash
   wails build
   ```

2. 压缩文件：
   - 进入 `build\bin\` 目录
   - 将 `tiddlywiki-manager.exe` 压缩为 ZIP
   - 分发 ZIP 文件

### 优化构建（减小体积）

```bash
wails build -clean -ldflags "-w -s"
```

这将生成更小的可执行文件。

## 常见问题

### Q: 提示"wails: command not found"

**A**: 确保已将 Go bin 目录添加到 PATH，然后重启命令提示符。

### Q: 前端构建失败

**A**: 删除 `frontend/node_modules` 文件夹，然后重新运行：

```bash
cd frontend
npm install
cd ..
```

### Q: Wiki 无法启动，提示"tiddlywiki 命令未找到"

**A**: 确保已全局安装 TiddlyWiki：

```bash
npm install -g tiddlywiki
```

### Q: 端口被占用

**A**: 在应用中编辑 Wiki，更改端口号（如 8081, 8082 等）。

### Q: 应用启动后是黑屏

**A**:

1. 确保系统已安装 WebView2（Windows 10/11 通常已预装）
2. 如未安装，访问：https://developer.microsoft.com/microsoft-edge/webview2/

### Q: 如何添加应用图标？

**A**:

1. 准备一个 `.ico` 文件（256x256 或更高分辨率）
2. 命名为 `icon.ico`，放在项目根目录
3. 重新构建

可以使用在线工具将 PNG 转换为 ICO：

- https://convertio.co/zh/png-ico/

## 下一步

- 📖 阅读完整的 [README.md](README.md)
- 🔧 查看详细的 [构建说明](build/INSTRUCTIONS.md)
- 🎨 自定义应用外观（修改 `frontend/src/App.css`）
- 🚀 添加更多功能（修改 `app.go` 和前端组件）

## 获取帮助

遇到问题？

- 检查 [README.md](README.md) 的常见问题部分
- 查看 [Wails 文档](https://wails.io/docs/)
- 搜索 [Wails GitHub Issues](https://github.com/wailsapp/wails/issues)

---

**开始享受 TiddlyWiki 管理的乐趣吧！** ✨
