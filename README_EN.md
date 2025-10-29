# TiddlyWiki Manager

> A modern, beautiful TiddlyWiki management tool built with Wails + React

[中文](README.md) | English

## Features

### 🚀 Core Features

- **Multi-Wiki Management**: Manage multiple TiddlyWiki instances in one place
- **One-Click Start/Stop**: Start and stop TiddlyWiki servers with a single click
- **Built-in Wiki Window**: Open wikis in the application window or external browser
- **Smart Filtering**: Filter by tags, categories, paths, or recent activity
- **Export to HTML**: Export wikis as static HTML files
- **Username Authentication**: Set usernames for wiki authentication

### 🎨 Interface

- **Modern UI**: Clean and intuitive interface with dark/light theme
- **Tabs Navigation**: Organized layout with Wiki List, Filter, and Info panels
- **Multiple View Modes**: Switch between card and list views
- **Pagination**: Customizable items per page for better performance
- **Responsive Design**: Optimized spacing and layout

### 🛠️ Advanced Features

- **Port Management**: View and manage ports in use
- **Quick Actions**: Open in folder, VSCode, GitHub Desktop
- **Auto Process Management**: Automatically stop processes when closing windows
- **Category & Tag System**: Organize wikis with categories and tags
- **Search**: Quick search across wiki names and descriptions

## System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, Ubuntu 20.04+
- **TiddlyWiki**: Install via `npm install -g tiddlywiki`
- **Memory**: Minimum 2GB RAM
- **Disk Space**: 100MB+

## Installation

### Windows

1. Download `TiddlyWiki-Manager-win64-v2.4.0.exe` from [Releases](https://github.com/your-repo/releases)
2. Run the installer
3. Follow the setup wizard

### macOS

1. Download the appropriate version:
   - Intel: `TiddlyWiki-Manager-darwin-amd64-v2.4.0.tar.gz`
   - Apple Silicon: `TiddlyWiki-Manager-darwin-arm64-v2.4.0.tar.gz`
2. Extract the archive
3. Move `TiddlyWiki-Manager.app` to Applications folder

### Linux

1. Download `TiddlyWiki-Manager-linux-amd64-v2.4.0`
2. Make it executable: `chmod +x TiddlyWiki-Manager-linux-amd64-v2.4.0`
3. Run: `./TiddlyWiki-Manager-linux-amd64-v2.4.0`

## Quick Start

### 1. Add a Wiki

- Click "Add" button in the top right
- Fill in the wiki information:
  - **Name**: Display name for the wiki
  - **Path**: Path to the wiki folder
  - **Port**: Port number (default 8080)
  - **Username** (optional): For authentication
  - **Category**: Organize wikis by category
  - **Tags**: Add tags for filtering
  - **Description**: Brief description

### 2. Create a New Wiki

- Click "New" button
- Select parent directory
- Enter wiki name
- The wiki will be automatically initialized and added

### 3. Start a Wiki

- Click the "▶️ Start" button on a wiki card
- Wait for the wiki to start
- Click "In App" to open in the application window
- Or click "Browser" to open in your default browser

### 4. Manage Wikis

- **Filter**: Use the Filter tab to find wikis by tags, categories, or search
- **Edit**: Click the ✏️ icon to edit wiki settings
- **Delete**: Click the 🗑️ icon to remove a wiki
- **Export**: Click "📦 Export HTML" to export as static HTML

## Features Overview

### Tabs Navigation

- **📚 Wiki List**: View and manage all wikis
- **🔍 Filter**: Advanced filtering options
- **ℹ️ Info**: System information and statistics

### View Modes

- **Card View**: Visual cards with full information
- **List View**: Compact list with quick actions

### Display Modes

- **All**: Show all wikis
- **By Category**: Group wikis by category
- **By Tag**: Group wikis by tag
- **By Path**: Sort by file path
- **Recent**: Show recently started wikis

### Quick Actions

- **📂 Folder**: Open wiki folder in file explorer
- **💻 VSCode**: Open wiki folder in VSCode
- **🐙 GitHub**: Open in GitHub Desktop
- **📄 Info File**: Open tiddlywiki.info file

## Configuration

### Data Storage

All data is stored in:

- **Windows**: `C:\Users\<username>\.tiddlywiki-manager\data.json`
- **macOS**: `/Users/<username>/.tiddlywiki-manager/data.json`
- **Linux**: `/home/<username>/.tiddlywiki-manager/data.json`

### Settings

Settings are automatically saved:

- Theme preference (dark/light)
- View mode (card/list)
- Language preference (zh/en)
- Items per page

## Building from Source

### Prerequisites

- Go 1.21+
- Node.js 18+
- Wails v2

### Development

```bash
# Install dependencies
cd frontend
npm install
cd ..

# Run in development mode
wails dev
```

### Production Build

```bash
# Build for current platform
wails build

# Build for specific platform
wails build -platform windows/amd64
wails build -platform darwin/amd64
wails build -platform darwin/arm64
wails build -platform linux/amd64
```

## Troubleshooting

### Port Already in Use

If you see "port already in use":

1. Click on the "Ports in Use" indicator in the header
2. View which ports are occupied
3. Kill the process or change the wiki's port

### Wiki Won't Start

1. Ensure TiddlyWiki is installed: `tiddlywiki --version`
2. Check if the wiki path is correct
3. Verify the port is not in use
4. Check logs in `~/.tiddlywiki-manager/logs/`

### Export Failed

1. Ensure the wiki has a valid `tiddlywiki.info` file
2. Check if the wiki path is accessible
3. Verify TiddlyWiki CLI is available

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Wails](https://wails.io/)
- [TiddlyWiki](https://tiddlywiki.com/) - A non-linear personal web notebook
- [React](https://react.dev/) - UI framework
- All contributors and users

## Changelog

See [CHANGELOG](docs/v2.4.0/CHANGELOG_v2.4.0.md) for version history.

## Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)

---

**Happy TiddlyWiking! 📝✨**
