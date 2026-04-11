"use client";

import { useState } from "react";

type CoverImageUploaderProps = {
  initialValue?: string;
  fieldName?: string;
  folder?: string;
};

export default function CoverImageUploader({
  initialValue = "",
  fieldName = "coverImage",
  folder = "covers",
}: CoverImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialValue);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile() {
    if (!selectedFile) {
      setError("Please choose a file first.");
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", folder);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Upload failed");
      }

      const payload = await response.json();
      setImageUrl(payload.url);
      setSelectedFile(null);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Upload failed";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <input type="hidden" name={fieldName} value={imageUrl} readOnly />

      <input
        type="file"
        accept="image/*"
        onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
        style={{ background: "#000", border: "1px solid var(--card-border)", padding: "0.6rem", borderRadius: "8px", color: "white" }}
      />

      <button
        type="button"
        onClick={uploadFile}
        disabled={isUploading || !selectedFile}
        className="btn"
      >
        {isUploading ? "Uploading..." : "Upload to MinIO"}
      </button>

      <p style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>
        Uploaded image URL is saved automatically with the article.
      </p>

      {error && <p style={{ color: "#f87171", fontSize: "0.75rem" }}>{error}</p>}

      {imageUrl && (
        <>
          <p className="text-muted" style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>
            {imageUrl}
          </p>
          <div style={{ borderRadius: "8px", overflow: "hidden", height: "120px" }}>
            <img src={imageUrl} alt="Cover preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </>
      )}
    </div>
  );
}
