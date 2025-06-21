import React, { useEffect, useState } from "react";

import { Avatar, Button, Modal, Select } from "antd";

import styles from "./OrderDetailsDrawer.module.css";
import OrderInfoCard from "../OrderInfoCard/OrderInfoCard";
import OrderItemsList from "../OrderItemsList/OrderItemsList";

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  address: string;
  phone: string;
  total: string;
  deliveryFee: string;
  status: string;
  paymentMethod: string;
  note?: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  quantity: number;
  total_price: string;
  product: {
    id: string;
    title: string;
    price: string;
    type: string;
    img_url?: string;
    category?: {
      name: string;
    };
  };
}

interface OrderDetailsModalProps {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
  onStatusChange: (newStatus: string) => Promise<void>;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  visible,
  order,
  onClose,
  onStatusChange,
}) => {
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
    }
  }, [visible]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order || statusUpdating) return;

    setStatusUpdating(true);
    try {
      await onStatusChange(newStatus);
    } catch (error) {
      console.error("Status güncelleme hatası:", error);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!order) return null;

  const total = parseFloat(order.total) || 0;
  const deliveryFee = parseFloat(order.deliveryFee) || 0;
  const grandTotal = total + deliveryFee;

  return (
    <Modal
      title={null}
      open={modalVisible}
      onCancel={handleClose}
      footer={null}
      width={700}
      centered
      className={styles.orderModal}
      maskClosable={true}
      destroyOnClose={true}
      closeIcon={null}
      styles={{
        mask: {
          backgroundColor: "rgba(0, 0, 0, 0.45)",
        },
        content: {
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          padding: 0,
          overflow: "hidden",
        },
        body: {
          padding: 0,
          maxHeight: "calc(100vh - 100px)",
          overflow: "auto",
        },
      }}
    >
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.leftSection}>
            <Avatar size={48} className={styles.orderAvatar}>
              {order.orderNumber.slice(-1)}
            </Avatar>
            <div className={styles.orderInfoText}>
              <h2 className={styles.orderNumber}>{order.orderNumber}</h2>
            </div>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.statusSection}>
              <p className={styles.statusLabel}>Status</p>
              <Select
                value={order.status}
                onChange={handleStatusChange}
                loading={statusUpdating}
                className={styles.statusSelect}
                options={[
                  { value: "PENDING", label: "Gözləyir" },
                  { value: "CONFIRMED", label: "Təsdiqləndi" },
                  { value: "PREPARING", label: "Hazırlanır" },
                  { value: "READY", label: "Hazırdır" },
                  { value: "DELIVERED", label: "Çatdırıldı" },
                  { value: "CANCELLED", label: "Ləğv edildi" },
                ]}
              />
            </div>

            <div className={styles.totalSection}>
              <p className={styles.totalLabel}>Ümumi məbləğ</p>
              <h3 className={styles.totalAmount}>{grandTotal.toFixed(2)} ₼</h3>
            </div>

            <Button
              type="text"
              onClick={handleClose}
              className={styles.closeButton}
              aria-label="Close modal"
            >
              ×
            </Button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <OrderInfoCard order={order} />
          <OrderItemsList
            items={order.items || []}
            total={total}
            deliveryFee={deliveryFee}
            grandTotal={grandTotal}
          />
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
