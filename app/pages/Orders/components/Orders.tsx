import React, { useEffect, useState } from "react";

import { EyeOutlined } from "@ant-design/icons";
import { Button, Spin, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd/es/table";

import OrderDetailsDrawer from "./OrderDetailsDrawer/OrderDetailsDrawer";
import styles from "./Orders.module.css";
import OrderStats from "./OrderStats/OrderStats";
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
      actions.getOrders();
    } catch (error) {
      console.error("Status güncelleme hatası:", error);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Geçersiz tarih";
      }
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");

      return `${day}-${month}`;
    } catch (error) {
      console.error("Tarih formatlanma hatası:", error);
      return "Tarih hatası";
    }
  };

  const formatFullDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Geçersiz tarih";
      }

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      console.error("Tarih formatlanma hatası:", error);
      return "Tarih hatası";
    }
  };

  const getUniqueStatuses = () => {
    const statuses = [...new Set(orders.map((order) => order.status))];
    return statuses.map((status) => ({
      text: getStatusText(status),
      value: status,
    }));
  };

  const getUniqueAddresses = () => {
    const addresses = [
      ...new Set(orders.map((order) => order.address).filter(Boolean)),
    ];
    return addresses.slice(0, 10).map((address) => ({
      text: address.length > 30 ? address.substring(0, 30) + "..." : address,
      value: address,
    }));
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
      render: (text) => <span className={styles.tableText2}>{text}</span>,
      width: 120,
      fixed: true,
      sorter: (a, b) => a.orderNumber.localeCompare(b.orderNumber),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div className={styles.filterDropdown}>
          <input
            placeholder="Sipariş No Ara"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            className={styles.filterInput}
          />
          <div className={styles.filterButtons}>
            <button
              type="button"
              onClick={() => confirm()}
              className={`${styles.filterButton} ${styles.filterButtonPrimary}`}
            >
              Ara
            </button>
            <button
              type="button"
              onClick={() => clearFilters && clearFilters()}
              className={styles.filterButton}
            >
              Temizle
            </button>
          </div>
        </div>
      ),
      onFilter: (value, record) =>
        record.orderNumber
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
    },
    {
      title: "Tarix",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (
        <span className={styles.tableText2} title={formatFullDate(text)}>
          {formatDate(text)}
        </span>
      ),
      width: 100,
      fixed: true,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: "descend",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div className={styles.filterDropdown}>
          <input
            type="date"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            className={styles.filterInput}
          />
          <div className={styles.filterButtons}>
            <button
              type="button"
              onClick={() => confirm()}
              className={`${styles.filterButton} ${styles.filterButtonPrimary}`}
            >
              Filtrele
            </button>
            <button
              type="button"
              onClick={() => clearFilters && clearFilters()}
              className={styles.filterButton}
            >
              Temizle
            </button>
          </div>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value) return true;
        const recordDate = new Date(record.createdAt)
          .toISOString()
          .split("T")[0];
        return recordDate === value;
      },
    },
    {
      title: <span className={styles.tableHeaderText}>Çatdırılma ünvanı</span>,
      dataIndex: "address",
      key: "address",
      render: (text) => (
        <span className={styles.addressText} title={text}>
          {text || "Ünvan göstərilməyib"}
        </span>
      ),
      width: 200,
      sorter: (a, b) => (a.address || "").localeCompare(b.address || ""),
      filters: getUniqueAddresses(),
      onFilter: (value, record) => record.address === value,
      filterSearch: true,
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
      width: 140,
      align: "center",
      sorter: (a, b) => {
        const countA =
          a.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
        const countB =
          b.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
        return countA - countB;
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div className={styles.filterDropdown}>
          <input
            type="number"
            placeholder="Minimum Ürün Sayısı"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            className={styles.filterInput}
          />
          <div className={styles.filterButtons}>
            <button
              type="button"
              onClick={() => confirm()}
              className={`${styles.filterButton} ${styles.filterButtonPrimary}`}
            >
              Filtrele
            </button>
            <button
              type="button"
              onClick={() => clearFilters && clearFilters()}
              className={styles.filterButton}
            >
              Temizle
            </button>
          </div>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value) return true;
        const totalCount =
          record.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ||
          0;
        return totalCount >= parseInt(value.toString());
      },
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
      width: 180,
      align: "right",
      sorter: (a, b) => {
        const totalA =
          (parseFloat(a.total) || 0) + (parseFloat(a.deliveryFee) || 0);
        const totalB =
          (parseFloat(b.total) || 0) + (parseFloat(b.deliveryFee) || 0);
        return totalA - totalB;
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div className={styles.filterDropdown}>
          <input
            type="number"
            placeholder="Minimum Tutar (₼)"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            className={styles.filterInput}
          />
          <div className={styles.filterButtons}>
            <button
              type="button"
              onClick={() => confirm()}
              className={`${styles.filterButton} ${styles.filterButtonPrimary}`}
            >
              Filtrele
            </button>
            <button
              type="button"
              onClick={() => clearFilters && clearFilters()}
              className={styles.filterButton}
            >
              Temizle
            </button>
          </div>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value) return true;
        const total =
          (parseFloat(record.total) || 0) +
          (parseFloat(record.deliveryFee) || 0);
        return total >= parseFloat(value.toString());
      },
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
      filters: getUniqueStatuses(),
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => a.status.localeCompare(b.status),
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
      align: "center",
      fixed: "right",
    },
  ];

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.header}>
        <Title level={2}>Sifarişlər</Title>
      </div>

      <OrderStats orders={orders} loading={loading} />

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <div className={styles.tableWrapper}>
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
            size="middle"
            bordered={false}
          />
        </div>
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
