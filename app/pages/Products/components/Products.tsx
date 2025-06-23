import React, { useState } from "react";
import { Button, Table, Typography, Space } from "antd";
import styles from "./Products.module.css";
import CampaignModal from "./CampaignModal";
import DeleteModal from "./DeleteModal"; // <-- yeni modal

const { Title } = Typography;

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // düzəlt və əlavə et üçün
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // sil modalı üçün

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Tarix",
      dataIndex: "tarix",
      key: "tarix",
    },
    {
      title: "Açıqlama",
      dataIndex: "aciqlama",
      key: "aciqlama",
    },
    {
      title: "Başlıq",
      dataIndex: "basliq",
      key: "basliq",
    },
    {
      title: "",
      key: "action",
      render: () => (
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

  const data = [
    {
      key: "1",
      no: "#321321",
      tarix: "10.05.2025",
      aciqlama: "Alis verisde yeni addim",
      basliq: "Tiktak yenilik",
    },
    {
      key: "2",
      no: "#321321",
      tarix: "10.05.2025",
      aciqlama: "Alis verisde yeni addim",
      basliq: "Tiktak yenilik",
    },
    {
      key: "3",
      no: "#321321",
      tarix: "10.05.2025",
      aciqlama: "Alis verisde yeni addim",
      basliq: "Tiktak yenilik",
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
          dataSource={data}
          pagination={false}
        />
      </div>

      {/* Əlavə et / Düzəlt modalı */}
      <CampaignModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Sil təsdiqləmə modalı */}
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          console.log("Silinmə təsdiqləndi"); // Əsl silmə funksiyası burada olacaq
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

export default Products;
