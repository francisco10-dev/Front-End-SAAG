import { toast } from "react-toastify";

export function loading(){
  toast.loading('Cargando...', { position: 'bottom-right', autoClose: false, });
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear());
  return `${day}-${month}-${year}`;
};

  
