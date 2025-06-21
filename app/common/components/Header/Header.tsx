import React from "react";

import { Input } from "antd";

import styles from "./Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>TIK TAK ADMİN</h1>
        </div>

        <div className={styles.searchSection}>
          <Input
            placeholder="Axtarış"
            className={styles.searchInput}
            bordered={false}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
