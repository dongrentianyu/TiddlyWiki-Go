import { useState } from "react";
import { SelectFolder, CreateNewWiki } from "../wailsjs/go/main/App";
import "./CreateWikiForm.css";

interface CreateWikiFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

function CreateWikiForm({ onClose, onSuccess }: CreateWikiFormProps) {
  const [parentDir, setParentDir] = useState("");
  const [wikiName, setWikiName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

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
      // 只有在真正的错误时才提示
      if (error && error.toString && !error.toString().includes("cancel")) {
        console.warn("Folder selection error:", error);
      }
    }
  };

  const validateWikiName = (name: string): boolean => {
    // Only allow English letters, numbers
    return /^[a-zA-Z0-9]+$/.test(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!parentDir || !wikiName) {
      alert("请填写所有必填项");
      return;
    }

    if (!validateWikiName(wikiName)) {
      alert("Wiki 名称只能包含英文字母和数字");
      return;
    }

    setIsCreating(true);
    try {
      const wikiPath = await CreateNewWiki(parentDir, wikiName);
      alert(
        `✅ TiddlyWiki "${wikiName}" 已成功创建并自动添加到管理器！\n\n📁 路径: ${wikiPath}\n🎯 默认端口: 8080\n\n您可以在主界面编辑 Wiki 信息。`
      );
      onSuccess();
      onClose();
    } catch (error) {
      alert("创建失败：" + error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}>
      <div
        className="modal-content modal-small"
        onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>新建 TiddlyWiki</h2>
          <button
            className="btn-close"
            onClick={onClose}>
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="wiki-form">
          <div className="form-group">
            <label>
              父目录 * <span className="hint">选择要创建 Wiki 的位置</span>
            </label>
            <div className="input-with-button">
              <input
                type="text"
                value={parentDir}
                onChange={(e) => setParentDir(e.target.value)}
                placeholder="选择或输入父目录路径..."
                required
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSelectFolder}>
                📁 选择
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>
              Wiki 名称 * <span className="hint">只能使用英文字母和数字</span>
            </label>
            <input
              type="text"
              value={wikiName}
              onChange={(e) => setWikiName(e.target.value)}
              placeholder="mynewwiki"
              pattern="[a-zA-Z0-9]+"
              required
            />
          </div>

          <div className="info-box">
            <strong>将执行命令：</strong>
            <code>tiddlywiki {wikiName || "mynewwiki"} --init server</code>
            <br />
            <small>在目录：{parentDir || "(未选择)"}</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isCreating}>
              取消
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isCreating}>
              {isCreating ? "创建中..." : "创建"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateWikiForm;
