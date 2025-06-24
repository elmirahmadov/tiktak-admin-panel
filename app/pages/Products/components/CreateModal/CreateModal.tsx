import React from "react";
import { Modal, Input, Button } from "antd";

interface CampaignModalProps {
  open: boolean;
  onClose: () => void;
}

const CampaignModal: React.FC<CampaignModalProps> = ({ open, onClose }) => {
  const { actions } = useProductStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "ədəd",
    img_url: "",
    category_id: 1,
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = () => {
    console.log("Göndərilən form:", form);

    actions.createProduct(
      form,
      () => {
        notification.success({
          message: "Məhsul yaradıldı",
        });
        onClose();
      },
      (err) => {
        console.error("Yaratma xətası:", err);
      }
    );
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <label>Başlıq</label>
        <Input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <label>Açıqlama</label>
        <TextArea
          rows={3}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <label>Qiymət</label>
        <Input
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
        />

        <label>Ölçü tipi</label>
        <Select
          value={form.type}
          onChange={(value) => handleChange("type", value)}
        >
          <Select.Option value="adet">Ədəd</Select.Option>
          <Select.Option value="litre">Litre</Select.Option>
        </Select>

        <label>Şəkil URL</label>
        <Input
          value={form.img_url}
          onChange={(e) => handleChange("img_url", e.target.value)}
        />

        <label>Kateqoriya ID</label>
        <Input
          type="number"
          value={form.category_id}
          onChange={(e) => handleChange("category_id", Number(e.target.value))}
        />

        <Button
          type="primary"
          block
          style={{
            marginTop: "1rem",
            backgroundColor: "#7ED957",
            border: "none",
          }}
          onClick={handleCreate}
        >
          Məlumatları yarat
        </Button>
      </div>
    </Modal>
  );
};

export default CampaignModal;
