import type { Proveedor } from '../types/proveedores';

const getProveedores = async (): Promise<Proveedor[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/proveedores`);
    if (!response.ok) {
        throw new Error("No se pudo obtener los proveedores");
    }
    return response.json();
};

export { getProveedores };