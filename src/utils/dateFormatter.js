import { format } from 'date-fns';

export const getFormattedDate = (date = new Date()) => {
  // Format as YYYY-MM-DD for storage and consistency
  return format(date, 'yyyy-MM-dd');
};

export const getDisplayDate = (dateString) => {
  // Format for user display
   if (!dateString) return '';
   try {
     return format(new Date(dateString), 'MMMM do, yyyy');
   } catch (e) {
       console.error("Error formatting date:", dateString, e);
       return dateString; // Fallback
   }
};