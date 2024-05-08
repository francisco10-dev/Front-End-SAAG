import Swal from "sweetalert2";
import { toast } from "react-toastify";
import  'moment-timezone';
import moment from 'moment';


export async function showConfirmation(): Promise<boolean> {
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer',
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
      icon: 'warning',
    });
    return result.isConfirmed;
}

export async function showNotification({ icon, text, success = true }: {
    icon: 'success' | 'error' | 'info' | 'warning' | 'question';
    text: string;
    success?: boolean;
  }): Promise<void> {
    await Swal.fire({
      position: 'bottom-right',
      icon,
      text,
      showConfirmButton: false,
      timer: 4000,
      width: '400',
      toast: true,
      timerProgressBar: true,
      background: success ? 'green' : '#ff9999',
      color: 'white'
    });
}

export function showError(text: any) {
  toast.error(text, { position: 'bottom-right', autoClose: 2000});
}

export function showSuccess(text: any) {
  toast.success(text, { position: 'bottom-right', autoClose: 2000 });
}

//muestra msj de cargando
export function loading(){
  toast.loading('Cargando...', { position: 'bottom-right', autoClose: false, });
}

//cierra el msj
export function closeLoad(){
  toast.dismiss();
}

//DÍA-MES-AÑO
export const formatDate = (dateString: string) => {
  if(dateString !== null){
    const date = new Date(dateString);
    return moment(date).tz('America/Costa_Rica').format('YYYY-MM-DD HH:mm:ss');
  }
  else
    return "--";
};

  
