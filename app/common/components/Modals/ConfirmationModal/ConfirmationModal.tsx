import React from "react";
import { Modal, Button } from "antd";
import styles from "./ConfirmationModal.module.css";

interface Props {
   open: boolean;
   onCancel: () => void;
   onConfirm: () => void;
   imageUrl?: string | null;
   message: string;
}

const ConfirmationModal: React.FC<Props> = ({ open, onCancel, onConfirm, imageUrl, message }) => {
   const defaultImage = imageUrl || "https://via.placeholder.com/300x200?text=Şəkil+yoxdur";

   return (
      <Modal open={open} onCancel={onCancel} footer={null}>
         <div className={styles.container}>
            <img src={defaultImage} alt="Şəkil" className={styles.image} />
            <p className={styles.message}>{message}</p>
            <div className={styles.buttonGroup}>
               <Button
                  type="primary"
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                  onClick={onConfirm}
               >
                  Təsdiqlə
               </Button>
               <Button
                  onClick={onCancel}
                  style={{
                     backgroundColor: "#fff",
                     borderColor: "#d9d9d9",
                     color: "#595959"
                  }}
               >
                  İndi yox
               </Button>
            </div>
         </div>
      </Modal>
   );
};

export default ConfirmationModal;
