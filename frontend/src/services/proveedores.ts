import type { Proveedor } from '../types/proveedores';
import { verificarRespuesta } from './apiErrores';
const getProveedores = async (): Promise<Proveedor[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/proveedores`);
    verificarRespuesta(response, "No se pudo obtener los proveedores");
    return response.json();
};

export { getProveedores };