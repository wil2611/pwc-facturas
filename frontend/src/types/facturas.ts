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

export interface ActualizarFactura {
    proveedor_id?: string;
    numero_factura?: string;
    fecha_emision?: string;
    fecha_vencimiento?: string | null;
    valor_total?: string;
    moneda?: string;
    numero_contrato?: string | null;
}

export interface ResumenFactura {
    proveedor: string;
    mes_factura: string;
    total_facturas: number;
    total_valor: string;
    moneda: string;
}