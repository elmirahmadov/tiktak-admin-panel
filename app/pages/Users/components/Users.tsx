import React, { useEffect, useState, useMemo, useRef } from "react";
import { Table, Avatar, Spin, notification, Tag, Tooltip, Input, Button } from "antd";
import {
   UserOutlined,
   PhoneOutlined,
   EnvironmentOutlined,
   CrownOutlined,
   ShopOutlined,
   FilterFilled,
   CloseOutlined,
   SearchOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { User } from "../types";
import styles from "./Users.module.css";

const staticData: User[] = [
   {
      id: 2,
      full_name: "Johnnn Douuu",
      phone: "+994105554423",
      address: null,
      img_url: null,
      role: "COMMERCE",
      password: "$2b$10$r92n8itrwQdZZtOeU2MD3umSJAzk0j9LaJMk096.PQS2gwiw24B2q",
      created_at: "2025-06-30T06:39:56.326Z"
   },
   {
      id: 3,
      full_name: "Tural Babirov",
      phone: "+994557977129",
      address: null,
      img_url: null,
      role: "COMMERCE",
      password: "$2b$10$j31suUHFJ7R7UJUtAdsoOO4PwPRdNISoc9rsCe80KxuUhOxu7Y73e",
      created_at: "2025-06-30T08:47:52.236Z"
   }
];

const roleTagProps = (role: string) => {
   const upper = role.toUpperCase();
   if (upper === "ADMIN") return { color: "gold", icon: <CrownOutlined /> };
   if (upper === "COMMERCE") return { color: "blue", icon: <ShopOutlined /> };
   return { color: "default", icon: <UserOutlined /> };
};

const azMonths = [
   "yanvar",
   "fevral",
   "mart",
   "aprel",
   "may",
   "iyun",
   "iyul",
   "avqust",
   "sentyabr",
   "oktyabr",
   "noyabr",
   "dekabr"
];

const formatAzeriDate = (dateStr: string): string => {
   try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return "–";
      const d = dt.getDate().toString().padStart(2, "0");
      const mName = azMonths[dt.getMonth()];
      const year = dt.getFullYear();
      const h = dt.getHours().toString().padStart(2, "0");
      const min = dt.getMinutes().toString().padStart(2, "0");
      return `${d} ${mName.charAt(0).toUpperCase() + mName.slice(1)} ${year}, ${h}:${min}`;
   } catch {
      return "–";
   }
};

const Users: React.FC = () => {
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState(true);

   // Filtre input state
   const [filterName, setFilterName] = useState("");
   const [filterVisible, setFilterVisible] = useState(false);

   // Input ref for autofocus
   const inputRef = useRef<Input>(null);

   useEffect(() => {
      setLoading(true);
      try {
         const data = staticData;
         if (!data.length) {
            notification.warning({
               message: "Məlumat yoxdur",
               description: "Heç bir istifadəçi tapılmadı.",
               placement: "topRight"
            });
            setUsers([]);
         } else setUsers(data);
      } catch {
         notification.error({
            message: "Xəta baş verdi",
            description: "İstifadəçi məlumatı yüklənmədi.",
            placement: "topRight"
         });
         setUsers([]);
      } finally {
         setLoading(false);
      }
   }, []);

   // Filtrelenmiş kullanıcılar: ad soyad filtresiyle
   const filteredUsers = useMemo(() => {
      if (!filterName.trim()) return users;
      const search = filterName.trim().toLowerCase();
      return users.filter((u) => u.full_name.toLowerCase().includes(search));
   }, [users, filterName]);

   // Kolonlar
   const columns: ColumnsType<User> = useMemo(
      () => [
         {
            title: "#",
            key: "row",
            render: (_: any, __: any, idx: number) => idx + 1,
            align: "center",
            width: 50
         },
         {
            title: "Avatar",
            dataIndex: "img_url",
            key: "avatar",
            render: (img, rec) =>
               img ? (
                  <Avatar src={img} alt={rec.full_name} />
               ) : (
                  <Avatar style={{ backgroundColor: "#1890ff" }}>{rec.full_name[0].toUpperCase()}</Avatar>
               ),
            align: "center",
            width: 70
         },
         {
            title: (
               <div
                  style={{
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     gap: 8,
                     position: "relative"
                  }}
               >
                  Ad Soyad
                  <FilterFilled
                     style={{
                        cursor: "pointer",
                        color: filterVisible ? "#1890ff" : undefined,
                        fontSize: 16
                     }}
                     onClick={() => setFilterVisible(true)}
                     title="Filtrəni aç"
                  />
               </div>
            ),
            dataIndex: "full_name",
            key: "full_name",
            align: "center",
            sorter: (a, b) => a.full_name.localeCompare(b.full_name),
            filterDropdown: false,
            render: (text) => <span>{text}</span>
         },
         {
            title: "Telefon",
            dataIndex: "phone",
            key: "phone",
            render: (text) => (
               <span>
                  <PhoneOutlined style={{ color: "#1890ff", marginRight: 6 }} />
                  {text}
               </span>
            ),
            align: "center",
            sorter: (a, b) => a.phone.localeCompare(b.phone)
         },
         {
            title: "Ünvan",
            dataIndex: "address",
            key: "address",
            render: (addr) =>
               addr ? (
                  <span>
                     <EnvironmentOutlined style={{ color: "#52c41a", marginRight: 6 }} />
                     {addr}
                  </span>
               ) : (
                  <Tooltip title="Ünvan yoxdur">
                     <span className={styles.addressEmpty}>⚠️ Yoxdur</span>
                  </Tooltip>
               ),
            align: "center"
         },
         {
            title: "Rol",
            dataIndex: "role",
            key: "role",
            render: (role) => {
               const p = roleTagProps(role);
               return (
                  <Tag color={p.color} icon={p.icon} className={styles.roleTag}>
                     {role.toUpperCase()}
                  </Tag>
               );
            },
            align: "center"
         },
         {
            title: "Şifrə",
            dataIndex: "password",
            key: "password",
            render: () => (
               <Tooltip title="Şifrə məxfidir">
                  <span style={{ fontSize: 18 }}>🔒</span>
               </Tooltip>
            ),
            align: "center",
            width: 70
         },
         {
            title: "Yaradılma tarixi",
            dataIndex: "created_at",
            key: "created_at",
            render: (dateStr) => formatAzeriDate(dateStr),
            align: "center",
            sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
         }
      ],
      [filterVisible]
   );

   // Input açıldığında otomatik focus ver
   React.useEffect(() => {
      if (filterVisible) {
         setTimeout(() => inputRef.current?.focus(), 150);
      }
   }, [filterVisible]);

   return (
      <div className={styles.container} style={{ position: "relative" }}>
         <div className={styles.header}>
            <h2 className={styles.pageTitle}>İstifadəçilər</h2>
         </div>

         {/* Absolute konumlu filtre inputu, animasyonlu */}
         <div
            style={{
               position: "absolute",
               top: 50,
               left: "50%",
               transform: filterVisible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-20px)",
               opacity: filterVisible ? 1 : 0,
               pointerEvents: filterVisible ? "auto" : "none",
               transition: "all 0.3s ease",
               backgroundColor: "#fff",
               padding: "8px 12px",
               boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
               borderRadius: 8,
               display: "flex",
               alignItems: "center",
               gap: 8,
               zIndex: 999,
               minWidth: 300,
               maxWidth: "90vw"
            }}
         >
            <Input
               ref={inputRef}
               placeholder="Ad Soyad axtar..."
               value={filterName}
               onChange={(e) => setFilterName(e.target.value)}
               allowClear
               onPressEnter={() => setFilterVisible(false)}
               style={{ flex: 1 }}
            />
            <Button
               type="text"
               icon={<SearchOutlined style={{ fontSize: 18 }} />}
               onClick={() => {
                  /* Opsiyonel: Enter tuşuna basmayla aynı işlemi yapabiliriz */
                  setFilterVisible(false);
               }}
               title="Axtar"
            />
            <Button
               type="text"
               icon={<CloseOutlined style={{ fontSize: 18 }} />}
               onClick={() => {
                  setFilterName("");
                  setFilterVisible(false);
               }}
               title="Bağla"
            />
         </div>

         {loading ? (
            <div className={styles.loadingContainer}>
               <Spin size="large" tip="Yüklənir..." />
            </div>
         ) : (
            <div className={styles.tableWrapper}>
               <Table<User>
                  className={styles.usersTable}
                  dataSource={filteredUsers}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                  bordered={false}
                  size="middle"
               />
            </div>
         )}
      </div>
   );
};

export default Users;
