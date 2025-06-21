import React from "react";

import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./Sidebar.module.css";

import { ROUTER } from "@/common/constants/router";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = location.pathname;

  const isKampaniyalarActive = location.pathname === ROUTER.CAMPAIGNS;

  const items = [
    {
      key: ROUTER.CAMPAIGNS,
      label: "Kampaniyalar",
      className: isKampaniyalarActive ? styles.activeGreen : "",
      style: {
        color: isKampaniyalarActive ? "#4aae4e" : undefined,
      },
    },
    {
      key: ROUTER.CATEGORIES,
      label: "Kateqoriyalar",
    },
    {
      key: ROUTER.PRODUCTS,
      label: "Məhsullar",
    },
    {
      key: ROUTER.USERS,
      label: "İstifadəçilər",
    },
    {
      key: ROUTER.ORDERS,
      label: "Sifarişlər",
    },
    {
      key: "logout",
      label: "Çıxış",
    },
  ];

  const handleMenuClick = (key: string) => {
    if (key === "logout") {
      localStorage.removeItem("access_token");
      window.location.href = ROUTER.LOGIN;
    } else {
      navigate(key);
    }
  };

  return (
    <div className={styles.sidebar}>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        className={styles.customMenu}
        items={items}
        onClick={({ key }) => handleMenuClick(key)}
      />
    </div>
  );
};

export default Sidebar;
