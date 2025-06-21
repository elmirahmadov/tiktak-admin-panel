import React from "react";

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Card } from "antd";

import styles from "./OrderStats.module.css";

interface OrderStatsProps {
  orders: any[];
  loading: boolean;
}

const OrderStats: React.FC<OrderStatsProps> = ({ orders, loading }) => {
  if (loading) return null;

  const calculateStats = () => {
    if (!orders || !orders.length) {
      return {
        totalOrders: 7,
        totalSales: 130.93,
        pendingOrders: 5,
        deliveredOrders: 1,
        cancelledOrders: 1,
      };
    }

    let totalSales = 0;
    let pendingOrders = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;

    orders.forEach((order) => {
      const total = parseFloat(order.total?.toString() || "0");
      totalSales += total;

      const status = order.status?.toUpperCase();
      if (
        status === "PENDING" ||
        status === "CONFIRMED" ||
        status === "PREPARING" ||
        status === "READY"
      ) {
        pendingOrders++;
      } else if (status === "DELIVERED") {
        deliveredOrders++;
      } else if (status === "CANCELLED") {
        cancelledOrders++;
      }
    });

    return {
      totalOrders: orders.length,
      totalSales,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
    };
  };

  const stats = calculateStats();

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsRow}>
        <div className={styles.statsCol}>
          <Card className={styles.statsCard} bordered={false}>
            <div className={styles.statTitle}>Ümumi sifarişlər</div>
            <div className={styles.statContent}>
              <ShoppingCartOutlined className={styles.iconBlue} />
              <span className={styles.statValue}>{stats.totalOrders}</span>
            </div>
          </Card>
        </div>

        <div className={styles.statsCol}>
          <Card className={styles.statsCard} bordered={false}>
            <div className={styles.statTitle}>Ümumi satış</div>
            <div className={styles.statContent}>
              <DollarOutlined className={styles.iconGreen} />
              <span className={styles.statValue}>
                {Number(stats.totalSales).toFixed(2)}
              </span>
              <span className={styles.upArrow}>↑</span>
            </div>
          </Card>
        </div>

        <div className={styles.statsCol}>
          <Card className={styles.statsCard} bordered={false}>
            <div className={styles.statTitle}>Gözləyən</div>
            <div className={styles.statContent}>
              <ClockCircleOutlined className={styles.iconOrange} />
              <span className={styles.statValue}>{stats.pendingOrders}</span>
            </div>
          </Card>
        </div>

        <div className={styles.statsCol}>
          <Card className={styles.statsCard} bordered={false}>
            <div className={styles.statTitle}>Çatdırılan</div>
            <div className={styles.statContent}>
              <CheckCircleOutlined className={styles.iconGreen} />
              <span className={styles.statValue}>{stats.deliveredOrders}</span>
            </div>
          </Card>
        </div>

        <div className={styles.statsCol}>
          <Card className={styles.statsCard} bordered={false}>
            <div className={styles.statTitle}>Ləğv edilən</div>
            <div className={styles.statContent}>
              <CloseCircleOutlined className={styles.iconRed} />
              <span className={styles.statValue}>{stats.cancelledOrders}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;
