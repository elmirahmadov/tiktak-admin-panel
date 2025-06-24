import React, { useEffect, useState } from "react";

import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Upload, message } from "antd";

import defaultProduct from "@/assets/images/defaultProduct.png";
import { useUploadStore } from "../../../../common/store/upload/upload.store";
import styles from "./UpdateModal.module.css";

interface Props {
   open: boolean;
   onClose: () => void;
   data: { img_url: string | null; title: string; description: string | null };
   onSubmit: (data: { img_url: string; title: string; description: string }) => void;
}

const UpdateModal: React.FC<Props> = ({ open, onClose, data, onSubmit }) => {
   const isValidImageUrl = (url: string | null): boolean => {
      return !!(url && url.trim() !== "" && !url.includes("undefined") && !url.includes("null"));
   };

   const [img_url, setImgUrl] = useState<string | null>(isValidImageUrl(data.img_url) ? data.img_url : null);
   const [title, setTitle] = useState(data.title || "");
   const [description, setDescription] = useState(data.description || "");
   const [fileName, setFileName] = useState("");
   const [uploading, setUploading] = useState(false);

   const { actions } = useUploadStore();

   useEffect(() => {
      // Gelen data güncellendiğinde
      const validImg = isValidImageUrl(data.img_url);
      setImgUrl(validImg ? data.img_url : null);
      setTitle(data.title || "");
      setDescription(data.description || "");
      setFileName(validImg ? data.img_url?.split("/").pop() || "Şəkil mövcuddur" : "");
   }, [data]);

   const handleImageUpload = async (file: File) => {
      if (file.size > 5 * 1024 * 1024) {
         message.error("Dosya boyutu 5MB'dan büyük olamaz!");
         return false;
      }

      if (!file.type.startsWith("image/")) {
         message.error("Sadece resim dosyaları yükleyebilirsiniz!");
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

      return false; // Ant Design Upload için dosyanın otomatik yüklenmesini engellemek için
   };

   const handleSubmit = () => {
      if (!img_url || !img_url.trim()) {
         message.error("Lütfen bir resim yükleyin!");
         return;
      }

      if (!title.trim()) {
         message.error("Başlık boş olamaz!");
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
                        placeholder={uploading ? "Yükleniyor..." : "Yeni resim seçin veya mevcut resmi koruyun"}
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

                  <div className={styles.imagePreview}>
                     <img
                        src={img_url && isValidImageUrl(img_url) ? img_url : defaultProduct}
                        alt="Preview"
                        style={{
                           width: "100px",
                           height: "100px",
                           objectFit: "cover",
                           borderRadius: "8px",
                           marginTop: "8px"
                        }}
                        onError={(e) => {
                           // Eğer img_url geçersizse veya yüklenemiyorsa defaultProduct'u göster
                           const target = e.currentTarget;
                           if (target.src !== defaultProduct) {
                              target.src = defaultProduct;
                           }
                        }}
                     />
                  </div>
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
               disabled={uploading || !img_url || !img_url.trim() || !title.trim()}
            >
               {uploading ? "Yükleniyor..." : "Məlumatları yenilə"}
            </Button>
         </div>
      </Modal>
   );
};

export default UpdateModal;
