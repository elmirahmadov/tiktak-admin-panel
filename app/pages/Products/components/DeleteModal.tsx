import React from "react";
import { Modal, Button } from "antd";
import styles from "./Delete.module.css";
import TrashImage from "../../../assets/images/0d698440dfdd3dfe26530636a5db03b51ed51fdd.png"; // şəkil varsa belə əlavə et

const DeleteModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={465}
      bodyStyle={{ textAlign: "center" }}
      centered
    >
      <img
        src={TrashImage}
        alt="Sil"
        className={styles.modalImage}
      />
      <p className={styles.modalText}>Məlumatı silməyə <br /> əminsinizmi?</p>
      <div className={styles.buttonGroup}>
        <Button className={styles.confirmButton} onClick={onConfirm}>
          Təsdiqlə
        </Button>
        <Button className={styles.cancelButton} onClick={onClose}>
          İndi yox
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
