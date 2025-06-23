import React from "react";
import { Modal, Input, Button } from "antd";

interface CampaignModalProps {
  open: boolean;
  onClose: () => void;
}

const CampaignModal: React.FC<CampaignModalProps> = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
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

export default CampaignModal;
