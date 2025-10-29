# v3.3.0 更新摘要

## 📅 发布信息

- **版本号**: v3.3.0
- **发布日期**: 2025-10-29
- **构建平台**: Windows 64-bit
- **Wails 版本**: v2.10.2

## 🎯 更新目标

本次更新主要解决两个关键问题：

1. 筛选功能失效（分类和标签筛选无法正常工作）
2. 选择文件夹时应用意外退出

## 🔧 修复详情

### 1. 筛选功能修复

**问题描述**:

- 在筛选界面点击"未分类"或"无标签"按钮后，筛选条件没有被正确应用
- FilterPanel2 组件和 App 主组件之间的数据传递不一致

**根本原因**:

- FilterPanel2 使用 `"__NONE__"` 作为未分类/无标签的标识符
- App.tsx 中的 filterWikis 函数检查的是中文字符串 `"无分类"` 和 `"无标签"`
- 导致筛选条件无法匹配

**解决方案**:

```typescript
// 修改前 (App.tsx)
if (selectedCategory === "无分类") { ... }
if (selectedTags.includes("无标签")) { ... }

// 修改后 (App.tsx)
if (selectedCategory === "__NONE__") { ... }
if (selectedTags.includes("__NONE__")) { ... }
```

**修改文件**:

- `frontend/src/App.tsx` - 修改筛选逻辑，统一使用 `__NONE__` 标识符

### 2. 文件选择器修复

**问题描述**:

- 在添加/编辑 Wiki 时点击"选择文件夹"按钮
- 在文件夹选择对话框中点击"取消"
- 应用会意外退出

**根本原因**:

- Wails 的 OpenDirectoryDialog 在某些情况下会触发 panic
- 错误处理不够完善，没有捕获所有异常情况
- 用户取消操作被当作错误处理

**解决方案**:

1. 在 `app.go` 的 SelectFolder 函数中添加 panic 恢复机制
2. 特殊处理用户取消的情况（返回空字符串，不报错）
3. 改进前端错误处理，不显示取消操作的错误提示

```go
// app.go - SelectFolder 函数修改
func (a *App) SelectFolder() (string, error) {
    defer func() {
        if r := recover(); r != nil {
            services.LogError("SelectFolder panic", fmt.Errorf("%v", r))
        }
    }()

    path, err := wruntime.OpenDirectoryDialog(a.ctx, wruntime.OpenDialogOptions{
        Title: "选择 TiddlyWiki 文件夹",
    })

    // If user canceled the dialog, return empty string without error
    if err != nil && err.Error() == "User cancelled" {
        return "", nil
    }

    if err != nil {
        services.LogError("Failed to open directory dialog", err)
        return "", err
    }

    if path == "" {
        return "", nil
    }

    return path, nil
}
```

```typescript
// WikiForm.tsx - handleSelectFolder 函数修改
const handleSelectFolder = async () => {
  try {
    const path = await SelectFolder();
    if (path && path.trim() !== "") {
      setFormData({ ...formData, path });
    }
  } catch (error) {
    console.error("Failed to select folder:", error);
    // Don't show alert if user just cancelled
    if (error && !error.toString().includes("cancel")) {
      alert("选择文件夹失败: " + error);
    }
  }
};
```

**修改文件**:

- `app.go` - SelectFolder 函数添加 panic 恢复和错误处理
- `frontend/src/components/WikiForm.tsx` - 改进错误处理逻辑
- CreateWikiForm.tsx 已有正确的错误处理，无需修改

### 3. 版本号更新

**修改文件**:

- `app.go` - GetAppVersion 函数返回 "3.3.0"

## 📝 代码变更统计

### 后端变更 (Go)

- `app.go`:
  - SelectFolder 函数：新增 15 行（添加 panic 恢复和错误处理）
  - GetAppVersion 函数：修改 1 行（版本号更新）

### 前端变更 (TypeScript)

- `frontend/src/App.tsx`:

  - filterWikis 函数：修改 4 行（统一使用 `__NONE__` 标识符）

- `frontend/src/components/WikiForm.tsx`:
  - handleSelectFolder 函数：修改 3 行（改进错误提示逻辑）

## ✅ 测试验证

### 筛选功能测试

1. ✅ 打开筛选面板，点击"未分类"按钮，验证筛选结果正确
2. ✅ 打开筛选面板，点击"无标签"按钮，验证筛选结果正确
3. ✅ 同时选择分类和标签，验证组合筛选功能正常
4. ✅ 在快速筛选和高级筛选之间切换，验证筛选条件保持

### 文件选择器测试

1. ✅ 点击"添加 Wiki"，点击"选择文件夹"，然后点击"取消"，验证应用不退出
2. ✅ 点击"添加 Wiki"，点击"选择文件夹"，选择文件夹，验证路径正确填入
3. ✅ 点击"新建 Wiki"，点击"选择文件夹"，然后点击"取消"，验证应用不退出
4. ✅ 点击"新建 Wiki"，点击"选择文件夹"，选择文件夹，验证路径正确填入
5. ✅ 编辑现有 Wiki，点击"选择文件夹"，验证功能正常

## 📦 构建信息

- **构建命令**: `wails build`
- **构建时间**: ~10 秒
- **输出文件**: `build/bin/TiddlyWiki-Manager-win64-v3.3.0.exe`
- **文件大小**: ~25 MB（预估）

## 🔄 升级说明

### 从任何旧版本升级到 v3.3.0

1. **配置兼容性**: 完全兼容，无需任何迁移操作
2. **数据保留**: 所有 Wiki 配置和数据完整保留
3. **升级步骤**:
   - 关闭旧版本应用（如果正在运行）
   - 下载 `TiddlyWiki-Manager-win64-v3.3.0.exe`
   - 双击运行新版本
   - 验证所有 Wiki 配置正确加载

## 🎉 总结

v3.3.0 是一个重要的 bug 修复版本，解决了两个影响用户体验的关键问题：

1. **筛选功能现在完全正常**: 可以正确筛选未分类的 Wiki 和无标签的 Wiki
2. **文件选择器更加稳定**: 取消选择不再导致应用退出

建议所有用户升级到此版本以获得更好的使用体验。

## 📚 相关文档

- [详细发布说明](docs/v3.3.0/RELEASE_v3.3.0.md)
- [完整更新日志](CHANGELOG.md)
- [发布信息](build/bin/RELEASE_INFO_v3.3.0.txt)

---

**下一个版本计划**: v3.4.0（待定）
**反馈和建议**: 欢迎在 GitHub Issues 中提出
