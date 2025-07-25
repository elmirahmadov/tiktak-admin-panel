import React, { useEffect, useMemo, useState } from "react";

import {
  CloseOutlined,
  CrownOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  PhoneOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Input,
  Modal,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import styles from "./Users.module.css";

import { Loading } from "@/common/components/Loading";
import { useUserActions, useUsers } from "@/common/store/user";
import { IUser as GlobalIUser } from "@/common/types/api.types";

const { Title } = Typography;

export interface IUser extends GlobalIUser {
  full_name?: string;
  phone?: string;
  address?: string;
  img_url?: string;
}

interface RoleTagProps {
  role: string;
  color: string;
  textColor?: string;
  icon: React.ReactNode;
}

const roleTagProps = (role: string): RoleTagProps => {
  const upper = role?.toUpperCase();
  if (upper === "ADMIN")
    return { role, color: "gold", icon: <CrownOutlined /> };
  if (upper === "COMMERCE")
    return {
      role,
      color: "#52c41a",
      textColor: "#52c41a",
      icon: <ShopOutlined style={{ color: "#52c41a" }} />,
    };
  return { role, color: "default", icon: <UserOutlined /> };
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
  "dekabr",
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
  const { users, loading } = useUsers();
  const { getUsers } = useUserActions();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUsers(
      () => {},
      (error) => {
        console.error("Kullanıcı yükleme hatası:", error);
      }
    );
  }, [getUsers]);

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleViewDetails = (user: IUser) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const getUniqueAddresses = () => {
    const addresses = [
      ...new Set(
        users
          .map((user) => ("address" in user ? user.address : undefined))
          .filter(Boolean)
      ),
    ];
    return addresses.slice(0, 10).map((address) => {
      const strAddress = String(address);
      return {
        text:
          strAddress.length > 30
            ? strAddress.substring(0, 30) + "..."
            : strAddress,
        value: strAddress,
      };
    });
  };

  const getUniqueRoles = () => {
    const roles = [...new Set(users.map((user) => user.role))];
    return roles.map((role) => ({
      text: role?.toUpperCase(),
      value: role,
    }));
  };

  const columns: ColumnsType<IUser> = useMemo(
    () => [
      {
        title: <span className={styles.tableHeaderText}>Sıra</span>,
        key: "rowNumber",
        render: (_, __, index) => {
          const rowNumber = (currentPage - 1) * pageSize + index + 1;
          return <span className={styles.tableText}>{rowNumber}</span>;
        },
        align: "center",
        width: "8%",
      },
      {
        title: <span className={styles.tableHeaderText}>Avatar</span>,
        dataIndex: "img_url",
        key: "avatar",
        render: (img, record) => {
          const fullName = record.full_name ?? "";
          return (
            <div className={styles.imageContainer}>
              {img ? (
                <Avatar
                  src={img}
                  alt={fullName}
                  className={styles.userAvatar}
                />
              ) : (
                <Avatar
                  className={`${styles.userAvatar} ${styles.greenAvatar}`}
                >
                  {fullName.charAt(0) ? (
                    fullName.charAt(0).toUpperCase()
                  ) : (
                    <UserOutlined />
                  )}
                </Avatar>
              )}
            </div>
          );
        },
        align: "center",
        width: "12%",
      },
      {
        title: <span className={styles.tableHeaderText}>Ad Soyad</span>,
        dataIndex: "full_name",
        key: "full_name",
        align: "center",
        width: "25%",
        sorter: (a, b) => (a.full_name ?? "").localeCompare(b.full_name ?? ""),
        render: (text) => (
          <span className={styles.userName} title={text ?? ""}>
            {text ?? ""}
          </span>
        ),
        filterDropdownProps: {
          placement: "bottomLeft",
        },
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div className={styles.filterDropdown}>
            <Input
              placeholder="Ad Soyad axtar"
              value={selectedKeys[0]?.toString() || ""}
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
                onClick={() => {
                  setSelectedKeys([]);
                  if (clearFilters) {
                    clearFilters();
                    confirm();
                  }
                }}
                className={styles.filterButton}
              >
                Temizle
              </button>
            </div>
          </div>
        ),
        onFilter: (value, record) =>
          (record.full_name ?? "")
            .toLowerCase()
            .includes(value.toString().toLowerCase()),
      },
      {
        title: <span className={styles.tableHeaderText}>Telefon</span>,
        dataIndex: "phone",
        key: "phone",
        align: "center",
        width: "20%",
        sorter: (a, b) => (a.phone ?? "").localeCompare(b.phone ?? ""),
        render: (text) => (
          <span className={styles.tableText}>
            <PhoneOutlined className={styles.phoneIcon} />
            {text}
          </span>
        ),
        filterDropdownProps: {
          placement: "bottomLeft",
        },
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div className={styles.filterDropdown}>
            <Input
              placeholder="Telefon axtar"
              value={selectedKeys[0]?.toString() || ""}
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
                onClick={() => {
                  setSelectedKeys([]);
                  if (clearFilters) {
                    clearFilters();
                    confirm();
                  }
                }}
                className={styles.filterButton}
              >
                Temizle
              </button>
            </div>
          </div>
        ),
        onFilter: (value, record) =>
          (record.phone ?? "")
            .toLowerCase()
            .includes(value.toString().toLowerCase()),
      },
      {
        title: <span className={styles.tableHeaderText}>Ünvan</span>,
        dataIndex: "address",
        key: "address",
        align: "center",
        width: "20%",
        render: (addr) =>
          addr ? (
            <span className={styles.addressText}>
              <EnvironmentOutlined className={styles.addressIcon} />
              {addr}
            </span>
          ) : (
            <Tooltip title="Ünvan yoxdur">
              <span className={styles.addressEmpty}>Qeyd olunmayıb</span>
            </Tooltip>
          ),
        filters: getUniqueAddresses(),
        onFilter: (value, record) => record.address === value,
        filterSearch: true,
      },
      {
        title: <span className={styles.tableHeaderText}>Rol</span>,
        dataIndex: "role",
        key: "role",
        render: (role) => {
          const props = roleTagProps(role);
          if (role?.toUpperCase() === "ADMIN") {
            return (
              <Tag color={props.color} className={styles.roleTag}>
                {props.icon}
                <span className={styles.roleText}>{role?.toUpperCase()}</span>
              </Tag>
            );
          }
          return (
            <Tag className={`${styles.roleTag} ${styles.greenRoleTag}`}>
              {role?.toUpperCase() === "COMMERCE" ? (
                <ShopOutlined className={styles.commerceIcon} />
              ) : (
                <UserOutlined />
              )}
              <span className={styles.roleText}>{role?.toUpperCase()}</span>
            </Tag>
          );
        },
        align: "center",
        width: "15%",
        filters: getUniqueRoles(),
        onFilter: (value, record) => record.role === value,
      },
      {
        title: <span className={styles.tableHeaderText}>Əməliyyat</span>,
        key: "actions",
        render: (_, record) => (
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            className={styles.detailButton}
          >
            Göstər
          </Button>
        ),
        align: "center",
        width: "12%",
      },
    ],
    [currentPage, pageSize]
  );

  return (
    <div className={styles.usersContainer}>
      <div className={styles.header}>
        <Title level={2}>İstifadəçilər</Title>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <Table<IUser>
            columns={columns}
            dataSource={users}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: users.length,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} / ${total} nəticə`,
              onChange: handlePaginationChange,
              onShowSizeChange: handlePaginationChange,
            }}
            locale={{ emptyText: "Axtarış nəticəsi tapılmadı" }}
            bordered={false}
            size="middle"
            className={styles.usersTable}
          />
        </div>
      )}

      <Modal
        title={null}
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={480}
        className={styles.userModal}
        maskClosable={true}
        centered
        closeIcon={<CloseOutlined className={styles.modalCloseIcon} />}
      >
        {selectedUser && (
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderContent}>
                <UserOutlined className={styles.modalHeaderIcon} />
                <span>İstifadəçi Detayları</span>
              </div>
            </div>

            <div className={styles.userProfile}>
              <div className={styles.avatarSection}>
                {selectedUser.img_url ? (
                  <Avatar
                    size={90}
                    src={selectedUser.img_url}
                    className={styles.profileAvatar}
                  />
                ) : (
                  <Avatar
                    size={90}
                    className={`${styles.profileAvatar} ${styles.greenAvatar}`}
                  >
                    {selectedUser.full_name?.[0]?.toUpperCase() || (
                      <UserOutlined />
                    )}
                  </Avatar>
                )}
                <div className={styles.userFullName}>
                  {selectedUser.full_name}
                </div>
                {selectedUser.role?.toUpperCase() === "ADMIN" ? (
                  <Tag
                    color={roleTagProps(selectedUser.role).color}
                    className={styles.profileRoleTag}
                  >
                    {roleTagProps(selectedUser.role).icon}
                    <span className={styles.roleText}>
                      {selectedUser.role?.toUpperCase()}
                    </span>
                  </Tag>
                ) : (
                  <Tag
                    className={`${styles.profileRoleTag} ${styles.greenRoleTag}`}
                  >
                    {selectedUser.role?.toUpperCase() === "COMMERCE" ? (
                      <ShopOutlined className={styles.commerceIcon} />
                    ) : (
                      <UserOutlined />
                    )}
                    <span className={styles.roleText}>
                      {selectedUser.role?.toUpperCase()}
                    </span>
                  </Tag>
                )}
              </div>

              <div className={styles.userDetails}>
                <div className={styles.infoCard}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <PhoneOutlined />
                    </div>
                    <div className={styles.infoContent}>
                      <div className={styles.infoLabel}>Telefon</div>
                      <div className={styles.infoValue}>
                        {selectedUser.phone}
                      </div>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <EnvironmentOutlined />
                    </div>
                    <div className={styles.infoContent}>
                      <div className={styles.infoLabel}>Ünvan</div>
                      <div className={styles.infoValue}>
                        {selectedUser.address || "Ünvan yoxdur"}
                      </div>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <span role="img" aria-label="calendar">
                        📅
                      </span>
                    </div>
                    <div className={styles.infoContent}>
                      <div className={styles.infoLabel}>Yaradılma tarixi</div>
                      <div className={styles.infoValue}>
                        {formatAzeriDate(selectedUser.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
