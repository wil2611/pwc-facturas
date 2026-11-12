import type { Factura, FacturasResponse, ActualizarFactura } from "../types/facturas";

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

const updateFactura = async (id: string, facturaData: ActualizarFactura): Promise<Factura> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/facturas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(facturaData),
    });
    if (!response.ok) {
        throw new Error("No se pudo actualizar la factura");
    }
    return response.json();
};

const uploadFactura = async (archivo: File): Promise<Factura> => {
    const formData = new FormData();
    formData.append('archivo', archivo);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/facturas`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        throw new Error("No se pudo subir la factura");
    }
    return response.json();
};

export { getFacturas, getFacturaById, updateFactura, uploadFactura };