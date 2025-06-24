import React, { useCallback, useEffect, useState } from "react";

import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";

import styles from "./CreateProductsModal.module.css";

import { useCategoryStore } from "@/common/store/category/category.store";
import { useUploadStore } from "@/common/store/upload/upload.store";

const { TextArea } = Input;
const { Option } = Select;

interface IProduct {
  id: number;
  title: string;
  description: string;
  img_url: string;
  price: string;
  category: {
    id: number;
    name: string;
  };
  type: string;
  created_at?: string;
}

interface ICreateProductData {
  title: string;
  description: string;
  img_url: string;
  price: string;
  category_id: number;
  type: string;
}

interface ICreateProductsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ICreateProductData) => void;
  data?: IProduct;
  isEdit?: boolean;
}

const PRODUCT_TYPES = [
  { value: "kg", label: "Kiloqram (kg)" },
  { value: "gr", label: "Qram (gr)" },
  { value: "litre", label: "Litr" },
  { value: "ml", label: "Millilitr (ml)" },
  { value: "meter", label: "Metr" },
  { value: "cm", label: "Santimetr (cm)" },
  { value: "mm", label: "Millimetr (mm)" },
  { value: "piece", label: "Ədəd" },
  { value: "packet", label: "Paket" },
  { value: "box", label: "Qutu" },
];

const CreateProductsModal: React.FC<ICreateProductsModalProps> = ({
  open,
  onClose,
  onSubmit,
  data,
  isEdit = false,
}) => {
  const [form] = Form.useForm();
  const {
    categories,
    loading: categoriesLoading,
    actions: categoryActions,
  } = useCategoryStore();
  const { actions: uploadActions } = useUploadStore();

  const [loading, setLoading] = useState(false);
  const [img_url, setImgUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open && categories.length === 0) {
      categoryActions.getCategories();
    }
  }, [open, categories.length, categoryActions]);

  useEffect(() => {
    if (open && isEdit && data) {
      form.setFieldsValue({
        title: data.title,
        description: data.description,
        price: data.price,
        category_id: data.category.id,
        type: data.type,
      });
      setImgUrl(data.img_url);
      setFileName("Mövcud şəkil");
    } else if (open && !isEdit) {
      form.resetFields();
      setImgUrl("");
      setFileName("");
    }
  }, [open, isEdit, data, form]);

  const handleImageUpload = useCallback(
    async (file: File) => {
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
        await uploadActions.uploadFile(
          file,
          (uploadResponse) => {
            setImgUrl(uploadResponse.url);
            setFileName(file.name);
            message.success("Şəkil uğurla yükləndi!");
          },
          (error) => {
            console.error("Upload hatası:", error);
            message.error("Şəkil yüklənərkən xəta baş verdi!");
          }
        );
      } catch (error) {
        console.error("Upload hatası:", error);
        message.error("Şəkil yüklənərkən xəta baş verdi!");
      } finally {
        setUploading(false);
      }

      return false;
    },
    [uploadActions]
  );

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (!img_url.trim()) {
        message.error("Zəhmət olmasa bir şəkil yükləyin!");
        return;
      }

      const formData: ICreateProductData = {
        title: values.title.trim(),
        description: values.description.trim(),
        img_url: img_url.trim(),
        price: values.price.trim(),
        category_id: Number(values.category_id),
        type: values.type,
      };

      await onSubmit(formData);
      handleClose();
    } catch (error: any) {
      console.error("Form submission error:", error);
      if (error.errorFields?.length > 0) {
        message.error("Zəhmət olmasa bütün sahələri doldurun");
      }
    } finally {
      setLoading(false);
    }
  }, [form, onSubmit, img_url]);

  const handleClose = useCallback(() => {
    form.resetFields();
    setImgUrl("");
    setFileName("");
    onClose();
  }, [form, onClose]);

  return (
    <Modal
      title={isEdit ? "Məhsulu Redaktə Et" : "Yeni Məhsul"}
      open={open}
      onCancel={handleClose}
      footer={null}
      width="85%"
      className={styles.modalContainer}
      bodyStyle={{
        maxHeight: "75vh",
        overflowY: "auto",
        padding: "24px",
      }}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        className={styles.formContainer}
      >
        <Row gutter={6} className={styles.formRow}>
          <Col span={24} className={styles.formCol}>
            <Form.Item
              label="Məhsul Adı"
              name="title"
              rules={[
                { required: true, message: "Başlıq tələb olunur" },
                { min: 2, message: "Başlıq ən az 2 simvol olmalıdır" },
              ]}
            >
              <Input
                placeholder="Məhsulun adını daxil edin"
                disabled={uploading}
              />
            </Form.Item>

            <Form.Item
              label="Açıqlama"
              name="description"
              rules={[
                { required: true, message: "Açıqlama tələb olunur" },
                { min: 10, message: "Açıqlama ən az 10 simvol olmalıdır" },
              ]}
            >
              <TextArea
                placeholder="Məhsulun açıqlamasını yazın"
                rows={3}
                disabled={uploading}
              />
            </Form.Item>

            <Row gutter={6} className={styles.formRow}>
              <Col span={12}>
                <Form.Item
                  label="Qiymət"
                  name="price"
                  rules={[
                    { required: true, message: "Qiymət tələb olunur" },
                    { min: 1, message: "Qiymət boş ola bilməz" },
                  ]}
                >
                  <Input placeholder="Qiymət daxil edin" disabled={uploading} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Ölçü Vahidi"
                  name="type"
                  rules={[{ required: true, message: "Ölçü vahidi seçin" }]}
                >
                  <Select placeholder="Vahid" disabled={uploading} showSearch>
                    {PRODUCT_TYPES.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={6} className={styles.formRow}>
              <Col span={12}>
                <Form.Item
                  label="Kateqoriya"
                  name="category_id"
                  rules={[{ required: true, message: "Kateqoriya seçin" }]}
                >
                  <Select
                    placeholder="Kateqoriya seçin"
                    loading={categoriesLoading}
                    showSearch
                    disabled={uploading}
                  >
                    {categories.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Məhsul Şəkli">
                  <div className={styles.uploadContainer}>
                    <Upload
                      beforeUpload={handleImageUpload}
                      showUploadList={false}
                      accept="image/*"
                      disabled={uploading}
                    >
                      <Input
                        value={fileName || ""}
                        placeholder={
                          uploading ? "Yüklənir..." : "Şəkil seçin..."
                        }
                        readOnly
                        className={styles.uploadInput}
                        suffix={
                          uploading ? (
                            <div className={styles.spinner}></div>
                          ) : (
                            <UploadOutlined className={styles.uploadIcon} />
                          )
                        }
                      />
                    </Upload>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Button
          type="primary"
          block
          onClick={handleSubmit}
          loading={loading}
          disabled={uploading || !img_url.trim()}
          className={styles.submitButton}
        >
          {loading
            ? isEdit
              ? "Yenilənir..."
              : "Yaradılır..."
            : uploading
              ? "Şəkil yüklənir..."
              : isEdit
                ? "Məlumatları Yenilə"
                : "Məhsulu Yarat"}
        </Button>
      </Form>
    </Modal>
  );
};

export default CreateProductsModal;
