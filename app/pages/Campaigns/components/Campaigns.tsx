import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Image, Input, Space, Table, Typography } from "antd";
import type { InputRef } from "antd";
import type { ColumnsType, ColumnType, TableProps } from "antd/es/table";

import styles from "./Compaigns.module.css";
import CreateModal from "./CreateModal/CreateModal";
import UpdateModal from "./UpdateModal/UpdateModal";

import defaultProduct from "@/assets/images/defaultProduct.png";
import DeleteModal from "@/common/components/DeleteModals/DeleteModal";
import { Loading } from "@/common/components/Loading";
import { formatDate } from "@/common/helpers/formatDate";
import { useCampaignActions, useCampaigns } from "@/common/store";

const { Title } = Typography;

interface Campaign {
  id: number;
  title: string;
  description: string;
  img_url: string;
  created_at?: string;
}

interface CreateCampaignData {
  title: string;
  description: string;
  img_url: string;
}

interface UpdateCampaignData extends CreateCampaignData {}

const Campaigns: React.FC = () => {
  const { campaigns, loading } = useCampaigns();
  const { getCampaigns, createCampaign, updateCampaign, deleteCampaign } =
    useCampaignActions();

  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {}
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleImageError = useCallback((campaignId: number) => {
    setImageErrors((prev) => ({ ...prev, [campaignId]: true }));
  }, []);

  const isValidImageUrl = useCallback((url: string) => {
    return (
      url &&
      url.trim() !== "" &&
      !url.includes("undefined") &&
      !url.includes("null")
    );
  }, []);

  useEffect(() => {
    getCampaigns();
  }, [getCampaigns]);

  const processedCampaigns = useMemo(() => {
    console.log("Campaigns data:", campaigns);

    const sortedCampaigns = [...campaigns].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;

      return dateB - dateA;
    });

    console.log("Sorted campaigns:", sortedCampaigns);
    return sortedCampaigns;
  }, [campaigns]);

  const handleCreateSubmit = useCallback(
    (data: CreateCampaignData) => {
      console.log("Yeni kampanya oluşturuluyor:", data);
      createCampaign({
        title: data.title,
        description: data.description,
        img_url: data.img_url,
      });
      setCreateOpen(false);
    },
    [createCampaign]
  );

  const handleUpdateSubmit = useCallback(
    (data: UpdateCampaignData) => {
      if (!selectedCampaign) return;

      console.log("Update edilen kampanya:", selectedCampaign);
      console.log("Yeni data:", data);
      console.log(
        "Mevcut pozisyon:",
        campaigns.findIndex((c) => c.id === selectedCampaign.id)
      );

      updateCampaign(selectedCampaign.id, {
        title: data.title,
        description: data.description,
        img_url: data.img_url,
      });
      setUpdateOpen(false);
      setSelectedCampaign(null);
    },
    [selectedCampaign, updateCampaign, campaigns]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!selectedCampaign) return;

    deleteCampaign(selectedCampaign.id);
    setConfirmOpen(false);
    setSelectedCampaign(null);
  }, [selectedCampaign, deleteCampaign]);

  const handleEdit = useCallback(
    (record: Campaign) => {
      console.log("Edit edilecek kampanya:", record);
      console.log(
        "Şu anki pozisyon:",
        campaigns.findIndex((c) => c.id === record.id)
      );
      setSelectedCampaign(record);
      setUpdateOpen(true);
    },
    [campaigns]
  );

  const handleDelete = useCallback((record: Campaign) => {
    setSelectedCampaign(record);
    setConfirmOpen(true);
  }, []);

  const getColumnSearchProps = useCallback(
    (dataIndex: keyof Campaign): ColumnType<Campaign> => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div className={styles.filterDropdown}>
          <Input
            ref={searchInput}
            placeholder={`Axtar: ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            className={styles.filterInput}
          />
          <div className={styles.filterButtons}>
            <button
              type="button"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              className={`${styles.filterButton} ${styles.filterButtonPrimary}`}
            >
              Axtar
            </button>
            <button
              type="button"
              onClick={() => handleReset(clearFilters, confirm)}
              className={styles.filterButton}
            >
              Sıfırla
            </button>
          </div>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? "#1890ff" : "#bfbfbf",
            fontSize: "12px",
          }}
        />
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

      render: (text) => {
        if (searchedColumn === dataIndex && searchText) {
          const parts = String(text).split(new RegExp(`(${searchText})`, "gi"));
          return (
            <span>
              {parts.map((part, index) =>
                part.toLowerCase() === searchText.toLowerCase() ? (
                  <span
                    key={index}
                    className={styles.highlightText}
                    style={{ backgroundColor: "#ffc069", padding: 0 }}
                  >
                    {part}
                  </span>
                ) : (
                  <span key={index}>{part}</span>
                )
              )}
            </span>
          );
        }
        return <span className={styles.tableText}>{text}</span>;
      },
    }),
    [searchText, searchedColumn]
  );

  const handleSearch = useCallback(
    (
      selectedKeys: React.Key[],
      confirm: () => void,
      dataIndex: keyof Campaign
    ) => {
      confirm();
      setSearchText(selectedKeys[0] as string);
      setSearchedColumn(dataIndex);
    },
    []
  );

  const handleReset = useCallback(
    (clearFilters?: () => void, confirm?: () => void) => {
      clearFilters?.();
      setSearchText("");
      confirm?.();
    },
    []
  );

  const formatCampaignDate = useCallback((dateString?: string): string => {
    try {
      console.log("Gelen tarih string'i:", dateString, typeof dateString);

      if (!dateString || dateString.trim() === "") {
        console.warn("Boş veya geçersiz tarih string'i");
        return "Tarih yoxdur";
      }

      const date = new Date(dateString);
      console.log("Date objesine çevrilmiş:", date, date.getTime());

      if (isNaN(date.getTime())) {
        console.error("Geçersiz tarih:", dateString);
        return "Geçersiz tarih";
      }
      return formatDate(dateString);
    } catch (error) {
      console.error("Tarih formatlanma hatası:", error, "String:", dateString);
      return "Tarih hatası";
    }
  }, []);

  const columns: ColumnsType<Campaign> = useMemo(
    () => [
      {
        title: <span className={styles.tableHeaderText}>Sıra</span>,
        key: "rowNumber",
        render: (_, __, index) => {
          const rowNumber = (currentPage - 1) * pageSize + index + 1;
          return <span className={styles.tableText}>{rowNumber}</span>;
        },
        width: "8%",
        align: "center",
      },
      {
        title: <span className={styles.tableHeaderText}>Şəkil</span>,
        dataIndex: "img_url",
        key: "img_url",
        render: (img, record) => {
          const hasError = imageErrors[record.id];
          const isValidUrl = isValidImageUrl(img);
          const shouldShowDefault = hasError || !isValidUrl;
          const finalImageSrc = shouldShowDefault ? defaultProduct : img;

          return (
            <div className={styles.imageContainer}>
              <Image
                src={finalImageSrc}
                alt={record.title}
                className={styles.campaignImage}
                style={{
                  objectFit: "cover",
                  borderRadius: "6px",
                  width: "clamp(30px, 5vw, 50px)",
                  height: "clamp(30px, 5vw, 50px)",
                }}
                onError={() => handleImageError(record.id)}
                preview={{
                  mask: (
                    <div
                      style={{
                        background: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      Önizlə
                    </div>
                  ),
                }}
                fallback={defaultProduct}
              />
            </div>
          );
        },
        width: "12%",
        align: "center",
      },
      {
        title: <span className={styles.tableHeaderText}>Başlıq</span>,
        dataIndex: "title",
        key: "title",
        ...getColumnSearchProps("title"),
        render: (text) => (
          <span className={styles.campaignTitle} title={text}>
            {text}
          </span>
        ),
        width: "25%",
      },
      {
        title: <span className={styles.tableHeaderText}>Açıqlama</span>,
        dataIndex: "description",
        key: "description",
        ...getColumnSearchProps("description"),
        render: (text) => (
          <span className={styles.descriptionText} title={text}>
            {text || "Açıqlama yoxdur"}
          </span>
        ),
        width: "30%",
      },
      {
        title: <span className={styles.tableHeaderText}>Tarix</span>,
        dataIndex: "created_at",
        key: "created_at",
        render: (text) => {
          const dateTitle =
            text && text.trim() !== ""
              ? (() => {
                  try {
                    return new Date(text).toLocaleString();
                  } catch {
                    return "Geçersiz tarih";
                  }
                })()
              : "Tarih yoxdur";

          return (
            <span className={styles.tableText} title={dateTitle}>
              {formatCampaignDate(text)}
            </span>
          );
        },
        width: "15%",
      },
      {
        title: <span className={styles.tableHeaderText}>Əməliyyat</span>,
        key: "actions",
        render: (_, record) => (
          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className={styles.actionButton}
              size="small"
            >
              Düzəlt
            </Button>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              className={`${styles.actionButton} ${styles.deleteButton}`}
              size="small"
            >
              Sil
            </Button>
          </Space>
        ),
        width: "10%",
        align: "center",
      },
    ],
    [
      getColumnSearchProps,
      handleEdit,
      handleDelete,
      formatCampaignDate,
      imageErrors,
      isValidImageUrl,
      handleImageError,
      currentPage,
      pageSize,
    ]
  );

  const handleCloseCreate = useCallback(() => {
    setCreateOpen(false);
  }, []);

  const handleCloseUpdate = useCallback(() => {
    setUpdateOpen(false);
    setSelectedCampaign(null);
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setConfirmOpen(false);
    setSelectedCampaign(null);
  }, []);

  const handlePaginationChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  }, []);

  const tableProps: TableProps<Campaign> = {
    columns,
    dataSource: processedCampaigns,
    rowKey: "id",
    loading,
    pagination: {
      current: currentPage,
      pageSize: pageSize,
      showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} nəticə`,
      onChange: handlePaginationChange,
      onShowSizeChange: handlePaginationChange,
    },
    className: styles.campaignsTable,
    size: "middle",
    bordered: false,

    sortDirections: [],
  };

  return (
    <div className={styles.campaignsContainer}>
      <div className={styles.header}>
        <Title level={2} className={styles.pageTitle}>
          Kampaniyalar
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateOpen(true)}
          className={styles.createButton}
          size="large"
        >
          Yeni Kampaniya
        </Button>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <Table<Campaign> {...tableProps} />
        </div>
      )}

      <CreateModal
        open={createOpen}
        onClose={handleCloseCreate}
        onSubmit={handleCreateSubmit}
      />

      {selectedCampaign && (
        <UpdateModal
          open={updateOpen}
          onClose={handleCloseUpdate}
          data={{
            img_url: selectedCampaign.img_url,
            title: selectedCampaign.title,
            description: selectedCampaign.description,
          }}
          onSubmit={handleUpdateSubmit}
        />
      )}

      {selectedCampaign && (
        <DeleteModal
          open={confirmOpen}
          onCancel={handleCloseConfirm}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default Campaigns;
