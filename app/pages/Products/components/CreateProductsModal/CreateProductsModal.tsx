import React from "react";
import { Modal, Input, Button } from "antd";

interface CreateProductsModal {
  open: boolean;
  onClose: () => void;
}

const CreateProductsModal: React.FC<CreateProductsModal> = ({
  open,
  onClose,
}) => {
  return (
    <Modal open={open} onCancel={onClose} footer={null} centered>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <label>Şəkil Ünvanı</label>
        <Input />

        <label>Başlıq</label>
        <Input />

        <label>Açıqlama</label>
        <Input.TextArea placeholder="url" rows={3} />

        <Button
          type="primary"
          block
          style={{
            marginTop: "1rem",
            backgroundColor: "#7ED957",
            border: "none",
          }}
        >
          Məlumatları yarat
        </Button>
      </div>
    </Modal>
  );
};

export default CreateProductsModal;
