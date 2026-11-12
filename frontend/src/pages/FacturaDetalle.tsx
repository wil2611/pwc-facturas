import { getFacturaById } from '../services/facturas';
import type { Factura } from '../types/facturas';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../styles/FacturaDetalle.css'

function FacturaDetalle() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [factura, setFactura] = useState<Factura | null>(null);
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        if (!id) return;

        const fetchFactura = async () => {
            try {
                setLoading(true)
                setError(null)
                setFactura(null)
                const factura = await getFacturaById(id);
                setFactura(factura);
            } catch {
                setError('Error al obtener la factura');
            }
            finally {
                setLoading(false);
            }
        };
        fetchFactura();
    }, [id]);
    if (!id) {
        return <p>ID de factura no proporcionado</p>;
    }
    if (loading) {
        return <p>Cargando...</p>;
    }
    return (
        <div className="factura-detalle">
            <h1>Detalle de la Factura</h1>
            {error && <p className="error">{error}</p>}
            {factura && (
                <div className="detalle-datos">
                    <p><strong>Número de factura:</strong> {factura.numero_factura}</p>
                    <p><strong>Proveedor:</strong> {factura.proveedor.nombre}</p>
                    <p><strong>Fecha de emisión:</strong> {factura.fecha_emision.slice(0, 10)}</p>
                    <p><strong>Fecha de vencimiento:</strong> {factura.fecha_vencimiento?.slice(0, 10) ?? 'No especificada'}</p>
                    <p><strong>Número de contrato:</strong> {factura.numero_contrato ?? 'No especificado'}</p>
                    <p><strong>Valor total:</strong> {new Intl.NumberFormat('es-CO').format(Number(factura.valor_total))}</p>
                    <p><strong>Moneda:</strong> {factura.moneda}</p>
                </div>
            )}
            <Link to="/facturas" className="back-link">Volver al listado</Link>
        </div>
    );

}

export default FacturaDetalle;