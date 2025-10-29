import { useState, useEffect } from "react";
import { Wiki } from "../types/wiki";
import { SelectFolder } from "../wailsjs/go/main/App";
import "./WikiForm.css";

interface WikiFormProps {
  wiki: Wiki | null;
  onSubmit: (wiki: any) => void;
  onClose: () => void;
}

function WikiForm({ wiki, onSubmit, onClose }: WikiFormProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    path: "",
    port: 8080,
    username: "",
    tags: [] as string[],
    category: "",
    description: "",
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (wiki) {
      setFormData({
        id: wiki.id,
        name: wiki.name,
        path: wiki.path,
        port: wiki.port,
        username: wiki.username || "",
        tags: wiki.tags || [],
        category: wiki.category || "",
        description: wiki.description || "",
      });
    }
  }, [wiki]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.path) {
      alert("请填写名称和路径");
      return;
    }

    onSubmit(formData);
  };

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

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{wiki ? "编辑 Wiki" : "添加新 Wiki"}</h2>
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
            <label>名称 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="我的 TiddlyWiki"
              required
            />
          </div>

          <div className="form-group">
            <label>路径 *</label>
            <div className="input-with-button">
              <input
                type="text"
                value={formData.path}
                onChange={(e) =>
                  setFormData({ ...formData, path: e.target.value })
                }
                placeholder="C:\path\to\wiki"
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
            <label>端口号 *</label>
            <input
              type="number"
              value={formData.port}
              onChange={(e) =>
                setFormData({ ...formData, port: parseInt(e.target.value) })
              }
              min="1024"
              max="65535"
              required
            />
          </div>

          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="TiddlyWiki 登录用户名（可选）"
            />
            <small
              style={{
                color: "var(--text-muted)",
                fontSize: "11px",
                marginTop: "4px",
                display: "block",
              }}>
              设置用户名后，访问 Wiki 需要身份验证
            </small>
          </div>

          <div className="form-group">
            <label>分类</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="工作、学习、个人等"
            />
          </div>

          <div className="form-group">
            <label>标签</label>
            <div className="tag-input-container">
              <div className="tag-list">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}>
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div className="input-with-button">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入标签后按回车"
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddTag}>
                  添加
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>描述</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="关于这个 Wiki 的简短描述..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}>
              取消
            </button>
            <button
              type="submit"
              className="btn btn-primary">
              {wiki ? "保存" : "添加"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WikiForm;
