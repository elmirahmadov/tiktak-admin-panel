import ConfirmationModal from "@/common/components/Modals/ConfirmationModal/ConfirmationModal";
import CreateModal from "@/common/components/Modals/CreateModal/CreateModal";
import UpdateModal from "@/common/components/Modals/UpdateModal/UpdateModal";
import { useCampaignActions, useCampaigns } from "@/common/store";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./Compaigns.module.css";
import deleteCompaignPicture from "../../../assets/images/0d698440dfdd3dfe26530636a5db03b51ed51fdd.png";


const formatDate = (isoDate: string | null): string => {
   if (!isoDate) return "Məlumat yoxdur";

   const date = new Date(isoDate);
   const day = String(date.getDate()).padStart(2, "0");
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const year = date.getFullYear();

   return `${day}.${month}.${year}`;
};

const Compaigns: React.FC = () => {
   const { campaigns, loading } = useCampaigns();
   const { getCampaigns, deleteCampaign, createCampaign, updateCampaign } = useCampaignActions();

   // Modalların açılıb bağlanması üçün state-lər
   const [createOpen, setCreateOpen] = useState(false);
   const [updateOpen, setUpdateOpen] = useState(false);
   const [confirmOpen, setConfirmOpen] = useState(false);

   // Hazırda update və confirm üçün seçilmiş kampaniya
   const [selectedCampaign, setSelectedCampaign] = useState<null | {
      id: number;
      title: string;
      description: string;
      img_url: string;
   }>(null);

   useEffect(() => {
      getCampaigns();
   }, [getCampaigns]);

   // CREATE modal callback
   const handleCreateSubmit = (data: { img_url: string; title: string; description: string }) => {
      createCampaign(data);
      setCreateOpen(false);
   };

   // UPDATE modal callback
   const handleUpdateSubmit = (data: { img_url: string; title: string; description: string }) => {
      if (!selectedCampaign) return;
      updateCampaign(selectedCampaign.id, data);
      setUpdateOpen(false);
      setSelectedCampaign(null);
   };

   // DELETE confirmation callback
   const handleDeleteConfirm = () => {
      if (!selectedCampaign) return;
      deleteCampaign(selectedCampaign.id);
      setConfirmOpen(false);
      setSelectedCampaign(null);
   };

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

         <table className={styles.table}>
            <thead>
               <tr>
                  <th className={styles.firstTh}>No</th>
                  <th>Tarix</th>
                  <th>Açıqlama</th>
                  <th>Başlıq</th>
                  <th className={styles.lastTh}></th>
               </tr>
            </thead>
            <tbody>
               {!loading && campaigns.length > 0 ? (
                  campaigns.map((item) => (
                     <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{formatDate(`${item.created_at}`)}</td>
                        <td>{item.description || "Məlumat yoxdur"}</td>
                        <td>{item.title || "Məlumat yoxdur"}</td>
                        <td>
                           <button
                              className={styles.textButton}
                              onClick={() => {
                                 setSelectedCampaign({
                                    id: item.id,
                                    title: item.title || "",
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
                                 setSelectedCampaign({
                                    id: item.id,
                                    title: item.title || "",
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
                     <td colSpan={5}>Heç bir kampaniya yoxdur.</td>
                  </tr>
               )}
            </tbody>
         </table>

         {/* Create Modal */}
         <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreateSubmit} />

         {/* Update Modal */}
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

         {/* Confirmation Modal */}
         {selectedCampaign && (
            <ConfirmationModal
               open={confirmOpen}
               onCancel={() => {
                  setConfirmOpen(false);
                  setSelectedCampaign(null);
               }}
               onConfirm={handleDeleteConfirm}
               imageUrl={deleteCompaignPicture}
               message={`“${selectedCampaign.title}” kampaniyasını silməyə əminsinizmi?`}
            />
         )}
      </div>
   );
};

export default Compaigns;
