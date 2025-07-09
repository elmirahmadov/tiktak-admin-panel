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

import CreateProductsModal from "./CreateProductsModal/CreateProductsModal";
import styles from "./Products.module.css";

import defaultProduct from "@/assets/images/defaultProduct.png";
import DeleteModal from "@/common/components/DeleteModals/DeleteModal";
import { Loading } from "@/common/components/Loading";
import { formatDate } from "@/common/helpers/formatDate";
import { useProductStore } from "@/common/store/product/product.store";

const { Title } = Typography;

const PRODUCT_TYPES = [
  { value: "kg", label: "Kiloqram (kg)" },
  { value: "gr", label: "Qram (gr)" },
  { value: "litre", label: "Litr" },
  { value: "ml", label: "Millilitr (ml)" },
  { value: "meter", label: "Metr" },
  { value: "cm", label: "Santimetr (cm)" },
  { value: "mm", label: "Millimetr (mm)" },
  { value: "piece", label: "Ədəd" },
  { value: "packet", label: "Paket" },
  { value: "box", label: "Qutu" },
];

const translateProductType = (type: string): string => {
  if (!type) return "Növ yoxdur";

  const exactMatch = PRODUCT_TYPES.find(
    (productType) => productType.value.toLowerCase() === type.toLowerCase()
  );

  if (exactMatch) {
    return exactMatch.label;
  }

  for (const productType of PRODUCT_TYPES) {
    if (type.toLowerCase().includes(productType.value.toLowerCase())) {
      const regex = new RegExp(`(\\d+)\\s*${productType.value}`, "i");
      const match = type.match(regex);

      if (match && match[1]) {
        return `${match[1]} ${productType.label}`;
      } else {
        return productType.label;
      }
    }
  }

  return type;
};

interface Product {
  id: number;
  title: string;
  description: string;
  img_url: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
  type: string;
  created_at?: string;
}

interface CreateProductData {
  title: string;
  description: string;
  img_url: string;
  price: number;
  category_id: number;
  type: string;
}

interface UpdateProductData extends CreateProductData {}

const Products: React.FC = () => {
  const { products, loading, actions } = useProductStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {}
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleImageError = useCallback((productId: number) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
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
    actions.getProducts();
  }, [actions]);

  const processedProducts = useMemo(() => {
    console.log("Products data:", products);

    const sortedProducts = [...products].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;

      return dateB - dateA;
    });

    console.log("Sorted products:", sortedProducts);
    return sortedProducts;
  }, [products]);

  const handleCreateSubmit = useCallback(
    (data: CreateProductData) => {
      console.log("Yeni məhsul yaradılır:", data);
      actions.createProduct(data);
      setIsModalOpen(false);
    },
    [actions]
  );

  const handleUpdateSubmit = useCallback(
    (data: UpdateProductData) => {
      if (!selectedProduct) return;

      console.log("Məhsul yenilənir:", selectedProduct);
      console.log("Yeni məlumatlar:", data);

      actions.updateProduct(selectedProduct.id, data);
      setIsUpdateModalOpen(false);
      setSelectedProduct(null);
    },
    [selectedProduct, actions]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!selectedProduct) return;

    actions.deleteProduct(selectedProduct.id);
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  }, [selectedProduct, actions]);

  const handleEdit = useCallback((record: Product) => {
    console.log("Dəyişdiriləcək məhsul:", record);
    setSelectedProduct(record);
    setIsUpdateModalOpen(true);
  }, []);

  const handleDelete = useCallback((record: Product) => {
    setSelectedProduct(record);
    setIsDeleteModalOpen(true);
  }, []);

  const getColumnSearchProps = useCallback(
    (dataIndex: keyof Product | string[]): ColumnType<Product> => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div className={styles.filterDropdown}>
          <Input
            ref={searchInput}
            placeholder={`Axtar: ${Array.isArray(dataIndex) ? dataIndex.join(".") : dataIndex}`}
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
      onFilter: (value, record) => {
        const getValue = (obj: any, path: keyof Product | string[]): string => {
          if (Array.isArray(path)) {
            return path.reduce((acc, key) => acc?.[key], obj) || "";
          }
          return obj[path] || "";
        };

        return getValue(record, dataIndex)
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase());
      },
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) => {
        if (
          searchedColumn ===
            (Array.isArray(dataIndex) ? dataIndex.join(".") : dataIndex) &&
          searchText
        ) {
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
      dataIndex: keyof Product | string[]
    ) => {
      confirm();
      setSearchText(selectedKeys[0] as string);
      setSearchedColumn(
        Array.isArray(dataIndex) ? dataIndex.join(".") : dataIndex
      );
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

  const formatProductDate = useCallback((dateString?: string): string => {
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

  const formatPrice = useCallback((price: number): string => {
    if (!price && price !== 0) return "Qiymət yoxdur";
    return `${price.toLocaleString()} ₼`;
  }, []);

  const columns: ColumnsType<Product> = useMemo(
    () => [
      {
        title: <span className={styles.tableHeaderText}>Sıra</span>,
        key: "rowNumber",
        render: (_, __, index) => {
          const rowNumber = (currentPage - 1) * pageSize + index + 1;
          return <span className={styles.tableText}>{rowNumber}</span>;
        },
        width: "6%",
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
                className={styles.productImage}
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
        width: "8%",
        align: "center",
      },
      {
        title: <span className={styles.tableHeaderText}>Ad</span>,
        dataIndex: "title",
        key: "title",
        ...getColumnSearchProps("title"),
        render: (text) => (
          <span className={styles.productTitle} title={text}>
            {text}
          </span>
        ),
        width: "15%",
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
        width: "20%",
      },
      {
        title: <span className={styles.tableHeaderText}>Qiymət</span>,
        dataIndex: "price",
        key: "price",
        render: (price) => (
          <span className={styles.priceText}>{formatPrice(price)}</span>
        ),
        width: "10%",
        align: "center",
      },
      {
        title: <span className={styles.tableHeaderText}>Kateqoriya</span>,
        dataIndex: ["category", "name"],
        key: "category",
        ...getColumnSearchProps(["category", "name"]),
        render: (text) => (
          <span className={styles.categoryText} title={text}>
            {text || "Kateqoriya yoxdur"}
          </span>
        ),
        width: "12%",
      },
      {
        title: <span className={styles.tableHeaderText}>Növ</span>,
        dataIndex: "type",
        key: "type",
        ...getColumnSearchProps("type"),
        render: (text) => {
          const translatedType = translateProductType(text);
          return (
            <span className={styles.typeText} title={translatedType}>
              {translatedType}
            </span>
          );
        },
        width: "10%",
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
              {formatProductDate(text)}
            </span>
          );
        },
        width: "11%",
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
      formatProductDate,
      formatPrice,
      imageErrors,
      isValidImageUrl,
      handleImageError,
      currentPage,
      pageSize,
    ]
  );

  const handleCloseCreate = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCloseUpdate = useCallback(() => {
    setIsUpdateModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const handlePaginationChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  }, []);

  const tableProps: TableProps<Product> = {
    columns,
    dataSource: processedProducts,
    rowKey: "id",
    loading,
    pagination: {
      current: currentPage,
      pageSize: pageSize,
      showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} nəticə`,
      onChange: handlePaginationChange,
      onShowSizeChange: handlePaginationChange,
    },
    className: styles.productsTable,
    size: "middle",
    bordered: false,
    sortDirections: [],
  };

  return (
    <div className={styles.productsContainer}>
      <div className={styles.header}>
        <Title level={2} className={styles.pageTitle}>
          Məhsullar
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className={styles.createButton}
          size="large"
        >
          Yeni Məhsul
        </Button>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <Table<Product> {...tableProps} />
        </div>
      )}

      <CreateProductsModal
        open={isModalOpen}
        onClose={handleCloseCreate}
        onSubmit={handleCreateSubmit}
      />

      {selectedProduct && (
        <CreateProductsModal
          open={isUpdateModalOpen}
          onClose={handleCloseUpdate}
          data={selectedProduct}
          onSubmit={handleUpdateSubmit}
          isEdit={true}
        />
      )}

      {selectedProduct && (
        <DeleteModal
          open={isDeleteModalOpen}
          onCancel={handleCloseConfirm}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default Products;
