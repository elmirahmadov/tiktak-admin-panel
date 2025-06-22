import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import React, { useEffect, useRef, useState } from "react";

import ConfirmationModal from "@/common/components/Modals/ConfirmationModal/ConfirmationModal";
import CreateModal from "@/common/components/Modals/CreateModal/CreateModal";
import UpdateModal from "@/common/components/Modals/UpdateModal/UpdateModal";

import deleteCategoryPicture from "@/assets/images/0d698440dfdd3dfe26530636a5db03b51ed51fdd.png";
import { formatDate } from "@/common/helpers/formatDate";
import { useCategories, useCategoryActions } from "@/common/store";

import { SearchOutlined } from "@ant-design/icons";
import styles from "./Categories.module.css";

interface Category {
   id: number;
   name: string;
   description: string;
   img_url: string;
   created_at: string;
}

const Categories: React.FC = () => {
   const { categories, loading } = useCategories();
   const { getCategories, createCategory, updateCategory, deleteCategory } = useCategoryActions();

   const [createOpen, setCreateOpen] = useState(false);
   const [updateOpen, setUpdateOpen] = useState(false);
   const [confirmOpen, setConfirmOpen] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState<null | Category>(null);

   const [searchText, setSearchText] = useState("");
   const [searchedColumn, setSearchedColumn] = useState("");
   const searchInput = useRef<InputRef>(null);

   useEffect(() => {
      getCategories();
   }, [getCategories]);

   const handleCreateSubmit = (data: { title: string; description: string; img_url: string }) => {
      createCategory({
         name: data.title,
         description: data.description,
         img_url: data.img_url
      });
      setCreateOpen(false);
   };

   const handleUpdateSubmit = (data: { title: string; description: string; img_url: string }) => {
      if (!selectedCategory) return;
      updateCategory(selectedCategory.id, {
         name: data.title,
         description: data.description,
         img_url: data.img_url
      });
      setUpdateOpen(false);
      setSelectedCategory(null);
   };

   const handleDeleteConfirm = () => {
      if (!selectedCategory) return;
      deleteCategory(selectedCategory.id);
      setConfirmOpen(false);
      setSelectedCategory(null);
   };

   const getColumnSearchProps = (dataIndex: keyof Category): ColumnType<Category> => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
         <div style={{ padding: 8 }}>
            <Input
               ref={searchInput}
               placeholder={`Axtar: ${dataIndex}`}
               value={selectedKeys[0]}
               onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
               onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
               style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
               <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} size="small">
                  Axtar
               </Button>
               <Button onClick={() => handleReset(clearFilters)} size="small">
                  Sıfırla
               </Button>
            </Space>
         </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) =>
         (record[dataIndex] as string)
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
         if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
         }
      }
   });

   const handleSearch = (selectedKeys: React.Key[], confirm: () => void, dataIndex: keyof Category) => {
      confirm();
      setSearchText(selectedKeys[0] as string);
      setSearchedColumn(dataIndex);
   };

   const handleReset = (clearFilters?: () => void) => {
      clearFilters?.();
      setSearchText("");
   };

   const columns: ColumnsType<Category> = [
      {
         title: "No",
         dataIndex: "id",
         sorter: (a, b) => a.id - b.id,
         width: "5%"
      },
      {
         title: "Şəkil",
         dataIndex: "img_url",
         render: (img) => <img src={img} alt="img" className={styles.image} />,
         width: "10%"
      },
      {
         title: "Ad",
         dataIndex: "name",
         ...getColumnSearchProps("name"),
         sorter: (a, b) => a.name.localeCompare(b.name),
         width: "20%"
      },
      {
         title: "Açıqlama",
         dataIndex: "description",
         ...getColumnSearchProps("description"),
         width: "35%"
      },
      {
         title: "Tarix",
         dataIndex: "created_at",
         render: (text) => formatDate(text),
         sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
         width: "15%"
      },
      {
         title: "Əməliyyat",
         dataIndex: "actions",
         render: (_, record) => (
            <>
               <button
                  className={styles.textButton}
                  onClick={() => {
                     setSelectedCategory(record);
                     setUpdateOpen(true);
                  }}
               >
                  Düzəlt
               </button>
               <button
                  className={styles.textButton}
                  onClick={() => {
                     setSelectedCategory(record);
                     setConfirmOpen(true);
                  }}
               >
                  Sil
               </button>
            </>
         ),
         width: "15%"
      }
   ];

   return (
      <div className={styles.container}>
         <div className={styles.header}>
            <h2>Kateqoriyalar</h2>
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
            dataSource={categories}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5, showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} nəticə` }}
         />

         <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreateSubmit} />

         {selectedCategory && (
            <UpdateModal
               open={updateOpen}
               onClose={() => {
                  setUpdateOpen(false);
                  setSelectedCategory(null);
               }}
               data={{
                  img_url: selectedCategory.img_url,
                  title: selectedCategory.name,
                  description: selectedCategory.description
               }}
               onSubmit={handleUpdateSubmit}
            />
         )}

         {selectedCategory && (
            <ConfirmationModal
               open={confirmOpen}
               onCancel={() => {
                  setConfirmOpen(false);
                  setSelectedCategory(null);
               }}
               onConfirm={handleDeleteConfirm}
               imageUrl={deleteCategoryPicture}
               message={`“${selectedCategory.name}” kateqoriyasını silməyə əminsinizmi?`}
            />
         )}
      </div>
   );
};

export default Categories;
