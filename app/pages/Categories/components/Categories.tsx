import React, { useEffect, useState } from "react";
import { Button, Pagination } from "antd";

import ConfirmationModal from "@/common/components/Modals/ConfirmationModal/ConfirmationModal";
import CreateModal from "@/common/components/Modals/CreateModal/CreateModal";
import UpdateModal from "@/common/components/Modals/UpdateModal/UpdateModal";

import { useCategories, useCategoryActions } from "@/common/store";
import deleteCategoryPicture from "@/assets/images/0d698440dfdd3dfe26530636a5db03b51ed51fdd.png";
import { formatDate } from "@/common/helpers/formatDate";

import styles from "./Categories.module.css";

const Categories: React.FC = () => {
   const { categories, loading } = useCategories();
   const { getCategories, createCategory, updateCategory, deleteCategory } = useCategoryActions();

   const [createOpen, setCreateOpen] = useState(false);
   const [updateOpen, setUpdateOpen] = useState(false);
   const [confirmOpen, setConfirmOpen] = useState(false);

   const [currentPage, setCurrentPage] = useState(1);
   const pageSize = 5;

   const paginatedCategories = categories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

   const [selectedCategory, setSelectedCategory] = useState<null | {
      id: number;
      name: string;
      description: string;
      img_url: string;
   }>(null);

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

         <table className={styles.table}>
            <thead>
               <tr>
                  <th>No</th>
                  <th>Şəkil</th>
                  <th>Ad</th>
                  <th>Açıqlama</th>
                  <th>Tarix</th>
                  <th></th>
               </tr>
            </thead>
            <tbody>
               {!loading && paginatedCategories.length > 0 ? (
                  paginatedCategories.map((item) => (
                     <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>
                           <img src={item.img_url} alt={item.name} className={styles.image} />
                        </td>
                        <td>{item.name || "Məlumat yoxdur"}</td>
                        <td>{item.description || "Məlumat yoxdur"}</td>
                        <td>{formatDate(`${item.created_at}`)}</td>
                        <td>
                           <button
                              className={styles.textButton}
                              onClick={() => {
                                 setSelectedCategory({
                                    id: item.id,
                                    name: item.name || "",
                                    description: item.description || "",
                                    img_url: item.img_url || ""
                                 });
                                 setUpdateOpen(true);
                              }}
                           >
                              Düzəlt
                           </button>
                           <button
                              className={styles.textButton}
                              onClick={() => {
                                 setSelectedCategory({
                                    id: item.id,
                                    name: item.name || "",
                                    description: item.description || "",
                                    img_url: item.img_url || ""
                                 });
                                 setConfirmOpen(true);
                              }}
                           >
                              Sil
                           </button>
                        </td>
                     </tr>
                  ))
               ) : (
                  <tr>
                     <td colSpan={6}>Heç bir kateqoriya yoxdur.</td>
                  </tr>
               )}
            </tbody>
         </table>

         {/* Pagination */}
         <div className={styles.pagination}>
            <Pagination
               current={currentPage}
               pageSize={pageSize}
               total={categories.length}
               onChange={(page) => setCurrentPage(page)}
               showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} nəticə`}
            />
         </div>

         {/* Create Modal */}
         <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreateSubmit} />

         {/* Update Modal */}
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

         {/* Confirmation Modal */}
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
