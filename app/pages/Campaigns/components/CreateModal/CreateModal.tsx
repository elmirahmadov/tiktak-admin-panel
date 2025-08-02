import React, { useState } from "react";

import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Upload } from "antd";

import styles from "./CreateModal.module.css";
import { useUploadStore } from "../../../../common/store/upload/upload.store";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    img_url: string;
    title: string;
    description: string;
  }) => void;
  isEdit?: boolean;
}

const CreateModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  isEdit = false,
}) => {
  const [img_url, setImgUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  const { actions } = useUploadStore();

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

    setImgUrl("");
    setTitle("");
    setDescription("");
    setFileName("");
    onClose();
  };

  const handleCancel = () => {
    setImgUrl("");
    setTitle("");
    setDescription("");
    setFileName("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
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
                value={fileName || ""}
                placeholder={
                  uploading
                    ? "Yükleniyor..."
                    : "Resim seçin veya buraya tıklayın"
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
            {img_url && (
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
          {uploading
            ? "Yüknənir..."
            : isEdit
              ? "Məlumatları yenilə"
              : "Məlumatları yarat"}
        </Button>
      </div>
    </Modal>
  );
};

export default CreateModal;
