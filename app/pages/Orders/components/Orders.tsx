import React, { useEffect, useState } from "react";

import { EyeOutlined } from "@ant-design/icons";
import { Button, Spin, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd/es/table";

import OrderDetailsDrawer from "./OrderDetailsDrawer/OrderDetailsDrawer";
import styles from "./Orders.module.css";
import { useOrderStore } from "../../../common/store/order/order.store";

const { Title } = Typography;

export interface Order {
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

export interface OrderItem {
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

const Orders: React.FC = () => {
  const { orders, loading, actions } = useOrderStore();
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    actions.getOrders();
  }, []);

  const handleViewDetails = (record: Order) => {
    setSelectedOrder(record);
    setDetailsVisible(true);
  };

  const closeDetails = () => {
    setDetailsVisible(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;

    try {
      await actions.updateOrderStatus(selectedOrder.id, { status: newStatus });
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    } catch (error) {
      console.error("Status güncelleme hatası:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "orange";
      case "CONFIRMED":
        return "blue";
      case "PREPARING":
        return "purple";
      case "READY":
        return "cyan";
      case "DELIVERED":
        return "green";
      case "CANCELLED":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "Gözləyir";
      case "CONFIRMED":
        return "Təsdiqləndi";
      case "PREPARING":
        return "Hazırlanır";
      case "READY":
        return "Hazırdır";
      case "DELIVERED":
        return "Çatdırıldı";
      case "CANCELLED":
        return "Ləğv edildi";
      default:
        return "Naməlum";
    }
  };

  const columns: TableProps<Order>["columns"] = [
    {
      title: "No",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (text) => <span className={styles.tableText}>{text}</span>,
      width: 160,
    },
    {
      title: "Tarix",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => {
        const date = new Date(text);
        return (
          <span className={styles.tableText}>
            {date.toLocaleDateString("az-AZ")}
          </span>
        );
      },
      width: 120,
    },
    {
      title: <span className={styles.tableHeaderText}>Çatdırılma ünvanı</span>,
      dataIndex: "address",
      key: "address",
      render: (text) => (
        <span className={styles.addressText}>
          {text || "Ünvan göstərilməyib"}
        </span>
      ),
      width: 160,
    },
    {
      title: <span className={styles.tableHeaderText}>Məhsul sayı</span>,
      key: "productCount",
      render: (_, record) => {
        const totalCount =
          record.items?.reduce(
            (sum: number, item: OrderItem) => sum + (item.quantity || 0),
            0
          ) || 0;
        return <span className={styles.tableText}>{totalCount}</span>;
      },
      width: 120,
      align: "center",
    },
    {
      title: (
        <span className={styles.tableHeaderText}>Subtotal/Çatdırılma</span>
      ),
      key: "subtotalDelivery",
      render: (_, record) => {
        const total = parseFloat(record.total) || 0;
        const deliveryFee = parseFloat(record.deliveryFee) || 0;
        return (
          <div className={styles.priceContainer}>
            <span className={styles.tableText}>
              {total.toFixed(2)} ₼
              {deliveryFee > 0 ? (
                <span className={styles.deliveryFee}>
                  • {deliveryFee.toFixed(2)} ₼
                </span>
              ) : (
                <span className={styles.freeDelivery}>• Pulsuz</span>
              )}
            </span>
          </div>
        );
      },
      width: 160,
      align: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = getStatusColor(status);
        const text = getStatusText(status);

        return (
          <Tag color={color} className={styles.statusTag}>
            {text}
          </Tag>
        );
      },
      width: 120,
      align: "center",
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
          className={styles.detailButton}
        >
          detallar
        </Button>
      ),
      width: 120,
      align: "right",
      fixed: "right",
    },
  ];

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.header}>
        <Title level={2}>Sifarişlər</Title>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <Table<Order>
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{
            pageSize: 5,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} nəticə`,
          }}
          className={styles.ordersTable}
        />
      )}

      <OrderDetailsDrawer
        visible={detailsVisible}
        order={selectedOrder}
        onClose={closeDetails}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Orders;
