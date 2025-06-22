export const formatDate = (isoDate: string | null): string => {
   if (!isoDate) return "Məlumat yoxdur";

	console.log(isoDate);


   const date = new Date(isoDate);
   const day = String(date.getDate()).padStart(2, "0");
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const year = date.getFullYear();

   return `${day}.${month}.${year}`;
};
