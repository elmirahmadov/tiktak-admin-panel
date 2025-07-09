import React, { useEffect, useState } from "react";

import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Upload } from "antd";

import styles from "./UpdateModal.module.css";
import { useUploadStore } from "../../../../common/store/upload/upload.store";

interface Props {
  open: boolean;
  onClose: () => void;
  data: { img_url: string | null; title: string; description: string | null };
  onSubmit: (data: {
    img_url: string;
    title: string;
    description: string;
  }) => void;
}

const UpdateModal: React.FC<Props> = ({ open, onClose, data, onSubmit }) => {
  const [img_url, setImgUrl] = useState(data.img_url || "");
  const [title, setTitle] = useState(data.title || "");
  const [description, setDescription] = useState(data.description || "");
  const [fileName, setFileName] = useState("");
  const [existingImageValid, setExistingImageValid] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { actions } = useUploadStore();

  const isValidImageUrl = (url: string | null): boolean => {
    return !!(
      url &&
      url.trim() !== "" &&
      !url.includes("undefined") &&
      !url.includes("null")
    );
  };

  useEffect(() => {
    setImgUrl(data.img_url || "");
    setTitle(data.title || "");
    setDescription(data.description || "");

    const isValid = isValidImageUrl(data.img_url);
    setExistingImageValid(isValid);

    if (isValid) {
      try {
        const urlParts = data.img_url?.split("/") || [];
        const extractedFileName = urlParts[urlParts.length - 1];
        setFileName(extractedFileName || "Şəkil mövcuddur");
      } catch (error) {
        setFileName("Şəkil mövcuddur");
      }
    } else {
      setFileName("");
    }
  }, [data]);

  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      return false;
    }

    if (!file.type.startsWith("image/")) {
      return false;
    }

    setUploading(true);

    try {
      await actions.uploadFile(
        file,
        (uploadResponse) => {
          setImgUrl(uploadResponse.url);
          setFileName(file.name);
          setExistingImageValid(true);
        },
        (error) => {
          console.error("Upload hatası:", error);
        }
      );
    } catch (error) {
      console.error("Upload hatası:", error);
    } finally {
      setUploading(false);
    }

    return false;
  };

  const handleSubmit = () => {
    if (!img_url.trim()) {
      return;
    }

    if (!title.trim()) {
      return;
    }

    onSubmit({ img_url, title, description });
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
      closeIcon={<span className={styles.closeIcon}>×</span>}
      className={styles.customModal}
    >
      <div className={styles.modalContent}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Şəkil ünvanı</label>
          <div className={styles.uploadContainer}>
            <Upload
              beforeUpload={handleImageUpload}
              showUploadList={false}
              accept="image/*"
              className={styles.uploadComponent}
              disabled={uploading}
            >
              <Input
                className={styles.input}
                value={fileName}
                placeholder={
                  uploading
                    ? "Yükleniyor..."
                    : "Yeni resim seçin veya mevcut resmi koruyun"
                }
                readOnly
                suffix={
                  uploading ? (
                    <div className={styles.loadingSpinner}>⟳</div>
                  ) : (
                    <UploadOutlined className={styles.uploadIcon} />
                  )
                }
              />
            </Upload>

            {!existingImageValid && img_url && img_url.trim() !== ""}

            {img_url && existingImageValid && (
              <div className={styles.imagePreview}>
                <img
                  src={img_url}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginTop: "8px",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Başlıq</label>
          <Input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={uploading}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Açıqlama</label>
          <Input.TextArea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={uploading}
          />
        </div>

        <Button
          type="primary"
          onClick={handleSubmit}
          className={styles.submitButton}
          loading={uploading}
          disabled={uploading || !img_url.trim() || !title.trim()}
        >
          {uploading ? "Yükleniyor..." : "Məlumatları yenilə"}
        </Button>
      </div>
    </Modal>
  );
};

export default UpdateModal;
