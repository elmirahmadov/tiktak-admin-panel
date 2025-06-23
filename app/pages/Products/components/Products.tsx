import React, { useEffect, useState } from "react";
import { Button, Table, Typography, Space } from "antd";
import styles from "./Products.module.css";
import CampaignModal from "./CampaignModal";
import DeleteModal from "./DeleteModal";
import { useProductStore } from "../../../common/store/product/product.store";

const { Title } = Typography;

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { products, loading, actions } = useProductStore();

  useEffect(() => {
    actions.getProducts();
  }, []);

  console.log("Products:", products);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ad",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Açıqlama",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Şəkil",
      dataIndex: "img_url",
      key: "img_url",
      render: (url) => (
        <img
          src={url || "https://via.placeholder.com/50?text=No+Image"}
          alt="şəkil"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Qiymət",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Kateqoriya",
      dataIndex: ["category", "name"],
      key: "category",
    },
    {
      title: "Yaradılma Tarixi",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Növ",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Əməliyyatlar",
      key: "action",
      render: (_, record) => (
        <Space>
          <span
            className={styles.actionLink}
            onClick={() => setIsModalOpen(true)}
          >
            düzəlt
          </span>
          <span
            className={styles.actionLink}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            sil
          </span>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.productsContainer}>
      <div className={styles.productsHeader}>
        <Title level={5} style={{ margin: 0, color: "#2B3043" }}>
          Kampaniyalar
        </Title>
        <Button
          className={styles.addButton}
          style={{
            backgroundColor: "#92D871",
            border: "none",
            fontWeight: "bold",
            borderRadius: "10px",
          }}
          type="primary"
          onClick={() => setIsModalOpen(true)}
        >
          Əlavə et
        </Button>
      </div>

      <div className={styles.customTableWrapper}>
        <Table
          className={styles.customTable}
          columns={columns}
          dataSource={products}
          loading={loading}
          rowKey="id"
          pagination={false}
        />
      </div>

      <CampaignModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          console.log("Silinmə təsdiqləndi");
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

export default Products;
