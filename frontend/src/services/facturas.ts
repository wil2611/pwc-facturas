import type { Factura, FacturasResponse, ActualizarFactura,ResumenFactura } from "../types/facturas";
import {verificarRespuesta,fetchSeguro} from "./apiErrores";
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
    const response = await  fetchSeguro(`${import.meta.env.VITE_API_URL}/api/facturas?${params.toString()}`);
    verificarRespuesta(response, "No se pudo obtener las facturas");
    return response.json();
};

const getFacturaById = async (id: string): Promise<Factura> => {
    const response = await fetchSeguro(`${import.meta.env.VITE_API_URL}/api/facturas/${id}`);
    verificarRespuesta(response, "No se pudo obtener la factura");
    return response.json();
};

const updateFactura = async (id: string, facturaData: ActualizarFactura): Promise<Factura> => {
    const response = await fetchSeguro(`${import.meta.env.VITE_API_URL}/api/facturas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(facturaData),
    });
    verificarRespuesta(response, "No se pudo actualizar la factura");
    return response.json();
};

const uploadFactura = async (archivo: File): Promise<Factura> => {
    const formData = new FormData();
    formData.append('archivo', archivo);
    const response = await fetchSeguro(`${import.meta.env.VITE_API_URL}/api/facturas`, {
        method: 'POST',
        body: formData,
    });
    verificarRespuesta(response, "No se pudo subir la factura");
    return response.json();
};

const deleteFactura = async (id: string): Promise<void> => {
    const response = await fetchSeguro(`${import.meta.env.VITE_API_URL}/api/facturas/${id}`, {
        method: 'DELETE',
    });
    verificarRespuesta(response, "No se pudo eliminar la factura");
}

const getResumenFacturas = async (): Promise<ResumenFactura[]> => {
    const response = await fetchSeguro(`${import.meta.env.VITE_API_URL}/api/facturas/reportes/resumen`);
    verificarRespuesta(response, "No se pudo obtener el resumen de facturas");
    return response.json();
}

export { getFacturas, getFacturaById, updateFactura, uploadFactura, deleteFactura, getResumenFacturas };