import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Upload } from "antd";
import React, { useState } from "react";
import modalStyles from "../modalForm.module.css";
// import styles from "./UpdateModal.module.css";

interface Props {
   open: boolean;
   onClose: () => void;
   onSubmit: (data: { img_url: string; title: string; description: string }) => void;
}

const CreateModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
   const [img_url, setImgUrl] = useState("");
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");

   const handleImageUpload = (file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
         if (typeof reader.result === "string") {
            setImgUrl(reader.result);
         }
      };
      reader.readAsDataURL(file);
      return false;
   };

   const handleSubmit = () => {
      onSubmit({ img_url, title, description });
      setImgUrl("");
      setTitle("");
      setDescription("");
      onClose();
   };

   return (
      <Modal title="Yeni Məlumat" open={open} onCancel={onClose} footer={null}>
         <div className={modalStyles.formGroup}>
            <label className={modalStyles.label}></label>
            <Upload beforeUpload={handleImageUpload} showUploadList={false} accept="image/*">
               <Button icon={<UploadOutlined />}>Şəkil seç</Button>
            </Upload>
         </div>

         <div className={modalStyles.formGroup}>
            <label className={modalStyles.label}>Başlıq</label>
            <Input className={modalStyles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
         </div>

         <div className={modalStyles.formGroup}>
            <label className={modalStyles.label}>Açıqlama</label>
            <Input.TextArea
               className={modalStyles.textarea}
               value={description}
               onChange={(e) => setDescription(e.target.value)}
            />
         </div>

         <Button
            type="primary"
            onClick={handleSubmit}
            className={modalStyles.submitButton}
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
         >
            Məlumatları yarat
         </Button>
      </Modal>
   );
};

export default CreateModal;
