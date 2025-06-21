import { Button, Modal } from "antd";
import React from "react";
import modalStyles from "../modalForm.module.css";
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
         <div className={`${modalStyles.container} ${styles.allCenter}`}>
            <img src={defaultImage} alt="Şəkil" className={`${modalStyles.image} ${styles.img}`} />
            <p className={modalStyles.message}>{message}</p>
            <div className={`${modalStyles.buttonGroup} ${styles.buttonGroup}`}>
               <Button
                  type="primary"
                  className={modalStyles.submitButton}
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                  onClick={onConfirm}
               >
                  Təsdiqlə
               </Button>
               <Button
                  className={modalStyles.submitButton}
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
