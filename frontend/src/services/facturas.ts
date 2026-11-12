import type {Factura, FacturasResponse} from "../types/facturas";

const getFacturas = async (page: number, pageSize: number, proveedor?: string, fechaDesde?: string, fechaHasta?: string): Promise<FacturasResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (proveedor) {
        params.append('proveedor', proveedor);
    }
    if (fechaDesde) {
        params.append('fechaDesde', fechaDesde);
    }
    if (fechaHasta) {
        params.append('fechaHasta', fechaHasta);
    }
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/facturas?${params.toString()}`);
    
    if (!response.ok) {
        throw new Error("No se pudo obtener las facturas");
    }
    
    return response.json();
};

const getFacturaById = async (id: string): Promise<Factura> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/facturas/${id}`);
    if (!response.ok) {
        throw new Error("No se pudo obtener la factura");
    }
    return response.json();
};

export {getFacturas, getFacturaById};