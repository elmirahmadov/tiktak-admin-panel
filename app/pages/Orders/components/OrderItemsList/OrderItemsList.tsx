import React from "react";

import { Card, List } from "antd";

import styles from "./OrderItemsList.module.css";
import defaultProduct from "../../../../assets/images/defaultProduct.png";
import { OrderItem } from "../../types";

interface OrderItemsListProps {
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  grandTotal: number;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({
  items,
  total,
  deliveryFee,
  grandTotal,
}) => {
  return (
    <Card
      title={`Məhsullar (${items.length})`}
      className={styles.itemsCard}
      headStyle={{
        background: "#fafafa",
        borderRadius: "8px 8px 0 0",
        fontSize: "14px",
      }}
    >
      <List
        dataSource={items}
        renderItem={(item: OrderItem, index: number) => (
          <List.Item
            className={`${styles.listItem} ${
              index < items.length - 1 ? styles.withBorder : ""
            }`}
          >
            <div className={styles.itemContent}>
              <div className={styles.itemDetails}>
                <div className={styles.imageContainer}>
                  <img
                    src={item.product?.img_url || defaultProduct}
                    alt={item.product?.title}
                    className={styles.productImage}
                    onError={(e) => {
                      e.currentTarget.src = defaultProduct;
                    }}
                  />
                </div>

                <div className={styles.productInfo}>
                  <div className={styles.productTitle}>
                    {item.product?.title}
                  </div>
                  <div className={styles.productMeta}>
                    {item.product?.category?.name} • {item.quantity}{" "}
                    {item.product?.type}
                  </div>
                </div>

                <div className={styles.priceInfo}>
                  <div className={styles.totalPrice}>
                    {parseFloat(item.total_price)?.toFixed(2)} ₼
                  </div>
                  <div className={styles.unitPrice}>
                    {parseFloat(item.product?.price ?? "0").toFixed(2)} ₼/
                    {item.product?.type}
                  </div>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />

      <div className={styles.totalSection}>
        <div className={styles.deliveryText}>
          Çatdırılma:{" "}
          {deliveryFee > 0 ? `${deliveryFee.toFixed(2)} ₼` : "Pulsuz"}
        </div>
      </div>
    </Card>
  );
};

export default OrderItemsList;
