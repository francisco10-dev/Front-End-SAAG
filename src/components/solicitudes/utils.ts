import SolicitudService from "../../services/solicitud.service";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const service = new SolicitudService();

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

//elimina una o  varias
export async function dropRequests(idSolicitudes: number[]): Promise<void> {
    try {
      loading();
      const statuses = await service.eliminarSolicitudes(idSolicitudes);
      if (statuses.every(status => status === 200)) {
        closeLoad();
        statuses.length === 1 ? showSuccess('Registro eliminado exitosamente!') : 
          showSuccess('Registros eliminados exitosamente!');
      } else {
        closeLoad();
        showError('Ocurrió un error');
      }
    } catch (error: any) {
      closeLoad();
      showError(error.message);
    }
}

export async function updateSolicitud(idSolicitud: number, solicitud: any) {
  try {
    loading();
    const response = await service.actualizarSolicitud(idSolicitud, solicitud);
    if (response) {
      closeLoad();
      showSuccess('Operación realizada exitosamente!');
      return response;
    } else {
      closeLoad();
      showError('Ocurrió un error al actualizar la solicitud');
    }
  } catch (error: any) {
    closeLoad();
    showError(error.message);
  }
}

//DÍA-MES-AÑO
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear());
  return `${day}-${month}-${year}`;
};

  
