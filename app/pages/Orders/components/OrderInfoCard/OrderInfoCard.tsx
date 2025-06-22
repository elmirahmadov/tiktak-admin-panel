import React from "react";

import { Card, Descriptions } from "antd";

import styles from "./OrderInfoCard.module.css";
import { Order } from "../../types";

interface OrderInfoCardProps {
  order: Order;
}

const OrderInfoCard: React.FC<OrderInfoCardProps> = ({ order }) => {
  return (
    <Card
      title="Sifariş Məlumatları"
      className={styles.infoCard}
      headStyle={{
        background: "#fafafa",
        borderRadius: "8px 8px 0 0",
        fontSize: "14px",
      }}
    >
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Tarix">
          {new Date(order.createdAt).toLocaleDateString("az-AZ")}
        </Descriptions.Item>
        <Descriptions.Item label="Çatdırılma Ünvanı">
          {order.address}
        </Descriptions.Item>
        <Descriptions.Item label="Telefon">{order.phone}</Descriptions.Item>
        <Descriptions.Item label="Ödəmə Metodu">
          {order.paymentMethod === "CARD" ? "Kart" : "Nağd"}
        </Descriptions.Item>
        {order.note && order.note !== "Lorem ipsum" && (
          <Descriptions.Item label="Qeyd">{order.note}</Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};

export default OrderInfoCard;
