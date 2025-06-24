import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import React, { useEffect, useRef, useState } from "react";

import DeleteModal from "@/common/components/DeleteModals/DeleteModal";
import CreateModal from "./CreateModal/CreateModal";
import UpdateModal from "./UpdateModal/UpdateModal";

import { formatDate } from "@/common/helpers/formatDate";
import { useCampaignActions, useCampaigns } from "@/common/store";

import { SearchOutlined } from "@ant-design/icons";
import styles from "./Compaigns.module.css";

interface Campaign {
  id: number;
  title: string;
  description: string;
  img_url: string;
  created_at: string;
}

const Compaigns: React.FC = () => {
  const { campaigns, loading } = useCampaigns();
  const { getCampaigns, createCampaign, updateCampaign, deleteCampaign } =
    useCampaignActions();

  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<null | Campaign>(
    null
  );

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    getCampaigns();
  }, [getCampaigns]);

  const handleCreateSubmit = (data: {
    img_url: string;
    title: string;
    description: string;
  }) => {
    createCampaign(data);
    setCreateOpen(false);
  };

  const handleUpdateSubmit = (data: {
    img_url: string;
    title: string;
    description: string;
  }) => {
    if (!selectedCampaign) return;
    updateCampaign(selectedCampaign.id, data);
    setUpdateOpen(false);
    setSelectedCampaign(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedCampaign) return;
    deleteCampaign(selectedCampaign.id);
    setConfirmOpen(false);
    setSelectedCampaign(null);
  };

  const getColumnSearchProps = (
    dataIndex: keyof Campaign
  ): ColumnType<Campaign> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Axtar: ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size="small"
          >
            Axtar
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small">
            Sıfırla
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      (record[dataIndex] as string)
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const handleSearch = (
    selectedKeys: React.Key[],
    confirm: () => void,
    dataIndex: keyof Campaign
  ) => {
    confirm();
    setSearchText(selectedKeys[0] as string);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters?: () => void) => {
    clearFilters?.();
    setSearchText("");
  };

  const columns: ColumnsType<Campaign> = [
    {
      title: "No",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "5%",
    },
    {
      title: "Başlıq",
      dataIndex: "title",
      ...getColumnSearchProps("title"),
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: "20%",
    },
    {
      title: "Açıqlama",
      dataIndex: "description",
      ...getColumnSearchProps("description"),
      width: "35%",
    },
    {
      title: "Tarix",
      dataIndex: "created_at",
      render: (text) => formatDate(text),
      sorter: (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      width: "20%",
    },
    {
      title: "Əməliyyat",
      dataIndex: "actions",
      render: (_, record) => (
        <>
          <button
            className={styles.textButton}
            onClick={() => {
              setSelectedCampaign(record);
              setUpdateOpen(true);
            }}
          >
            Düzəlt
          </button>
          <button
            className={styles.textButton}
            onClick={() => {
              setSelectedCampaign(record);
              setConfirmOpen(true);
            }}
          >
            Sil
          </button>
        </>
      ),
      width: "20%",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Kompaniyalar</h2>
        <Button
          type="primary"
          style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          onClick={() => setCreateOpen(true)}
        >
          Əlavə et
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={campaigns}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 5,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} nəticə`,
        }}
      />

      <CreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      {selectedCampaign && (
        <UpdateModal
          open={updateOpen}
          onClose={() => {
            setUpdateOpen(false);
            setSelectedCampaign(null);
          }}
          data={selectedCampaign}
          onSubmit={handleUpdateSubmit}
        />
      )}

      {selectedCampaign && (
        <DeleteModal
          open={confirmOpen}
          onCancel={() => {
            setConfirmOpen(false);
            setSelectedCampaign(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default Compaigns;
