export interface Factura {
    id: string;
    proveedor_id: string;
    numero_factura: string;
    fecha_emision: string;
    fecha_vencimiento?: string | null;
    valor_total: string;
    moneda: string;
    numero_contrato?: string | null;
    proveedor: {
        id: string;
        nombre: string;
    };
}
export type FacturasResponse = {
    facturas: Factura[];
    totalCount: number;
};