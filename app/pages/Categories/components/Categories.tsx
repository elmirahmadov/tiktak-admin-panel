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

import styles from "./Categories.module.css";
import CreateModal from "./CreateModal/CreateModal";
import UpdateModal from "./UpdateModal/UpdateModal";

import defaultProduct from "@/assets/images/defaultProduct.png";
import DeleteModal from "@/common/components/DeleteModals/DeleteModal";
import { Loading } from "@/common/components/Loading";
import { formatDate } from "@/common/helpers/formatDate";
import { useCategories, useCategoryActions } from "@/common/store";

const { Title } = Typography;

interface Category {
  id: number;
  name: string;
  description: string;
  img_url: string;
  created_at?: string;
}

interface CreateCategoryData {
  title: string;
  description: string;
  img_url: string;
}

interface UpdateCategoryData extends CreateCategoryData {}

const Categories: React.FC = () => {
  const { categories, loading } = useCategories();
  const { getCategories, createCategory, updateCategory, deleteCategory } =
    useCategoryActions();

  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
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

  const handleImageError = useCallback((categoryId: number) => {
    setImageErrors((prev) => ({ ...prev, [categoryId]: true }));
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
    getCategories();
  }, [getCategories]);

  const processedCategories = useMemo(() => {
    console.log("Categories data:", categories);

    const sortedCategories = [...categories].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;

      return dateB - dateA;
    });

    console.log("Sorted categories:", sortedCategories);
    return sortedCategories;
  }, [categories]);

  const handleCreateSubmit = useCallback(
    (data: CreateCategoryData) => {
      console.log("Yeni kategori oluşturuluyor:", data);
      createCategory({
        name: data.title,
        description: data.description,
        img_url: data.img_url,
      });
      setCreateOpen(false);
    },
    [createCategory]
  );

  const handleUpdateSubmit = useCallback(
    (data: UpdateCategoryData) => {
      if (!selectedCategory) return;

      console.log("Update edilen kategori:", selectedCategory);
      console.log("Yeni data:", data);
      console.log(
        "Mevcut pozisyon:",
        categories.findIndex((c) => c.id === selectedCategory.id)
      );

      updateCategory(selectedCategory.id, {
        name: data.title,
        description: data.description,
        img_url: data.img_url,
      });
      setUpdateOpen(false);
      setSelectedCategory(null);
    },
    [selectedCategory, updateCategory, categories]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!selectedCategory) return;

    deleteCategory(selectedCategory.id);
    setConfirmOpen(false);
    setSelectedCategory(null);
  }, [selectedCategory, deleteCategory]);

  const handleEdit = useCallback(
    (record: Category) => {
      console.log("Edit edilecek kategori:", record);
      console.log(
        "Şu anki pozisyon:",
        categories.findIndex((c) => c.id === record.id)
      );
      setSelectedCategory(record);
      setUpdateOpen(true);
    },
    [categories]
  );

  const handleDelete = useCallback((record: Category) => {
    setSelectedCategory(record);
    setConfirmOpen(true);
  }, []);

  const getColumnSearchProps = useCallback(
    (dataIndex: keyof Category): ColumnType<Category> => ({
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
      dataIndex: keyof Category
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

  const formatCategoryDate = useCallback((dateString?: string): string => {
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

  const columns: ColumnsType<Category> = useMemo(
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
                alt={record.name}
                className={styles.categoryImage}
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
        title: <span className={styles.tableHeaderText}>Ad</span>,
        dataIndex: "name",
        key: "name",
        ...getColumnSearchProps("name"),
        render: (text) => (
          <span className={styles.categoryName} title={text}>
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
              {formatCategoryDate(text)}
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
      formatCategoryDate,
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
    setSelectedCategory(null);
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setConfirmOpen(false);
    setSelectedCategory(null);
  }, []);

  const handlePaginationChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  }, []);

  const tableProps: TableProps<Category> = {
    columns,
    dataSource: processedCategories,
    rowKey: "id",
    loading,
    pagination: {
      current: currentPage,
      pageSize: pageSize,
      showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} nəticə`,
      onChange: handlePaginationChange,
      onShowSizeChange: handlePaginationChange,
    },
    className: styles.categoriesTable,
    size: "middle",
    bordered: false,
    sortDirections: [],
  };

  return (
    <div className={styles.categoriesContainer}>
      <div className={styles.header}>
        <Title level={2} className={styles.pageTitle}>
          Kateqoriyalar
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateOpen(true)}
          className={styles.createButton}
          size="large"
        >
          Yeni Kateqoriya
        </Button>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <Table<Category> {...tableProps} />
        </div>
      )}

      <CreateModal
        open={createOpen}
        onClose={handleCloseCreate}
        onSubmit={handleCreateSubmit}
      />

      {selectedCategory && (
        <UpdateModal
          open={updateOpen}
          onClose={handleCloseUpdate}
          data={{
            img_url: selectedCategory.img_url,
            title: selectedCategory.name,
            description: selectedCategory.description,
          }}
          onSubmit={handleUpdateSubmit}
        />
      )}

      {selectedCategory && (
        <DeleteModal
          open={confirmOpen}
          onCancel={handleCloseConfirm}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default Categories;
