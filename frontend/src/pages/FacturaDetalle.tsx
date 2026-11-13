import { getFacturaById, updateFactura } from '../services/facturas';
import type { Factura } from '../types/facturas';
import { getProveedores } from '../services/proveedores';
import type { Proveedor } from '../types/proveedores';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../styles/FacturaDetalle.css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import facturaSchema from '../schemas/factura.schema'
type FacturaFormData = z.infer<typeof facturaSchema>;

function FacturaDetalle() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [factura, setFactura] = useState<Factura | null>(null);
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FacturaFormData>({
        resolver: zodResolver(facturaSchema),
    });
    const [proveedores, setProveedores] = useState<Proveedor[]>([])

    const onSubmit = async (data: FacturaFormData) => {
        if (!id) {
            setError('ID de factura no proporcionado');
            return;
        }
        try {
            setError(null);
            setSuccess(null);
            const facturaActualizada = await updateFactura(id, {
                ...data,
                fecha_vencimiento: data.fecha_vencimiento || null,
                numero_contrato: data.numero_contrato || null
            });
            setFactura(facturaActualizada);
            setSuccess('Factura actualizada correctamente');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Error al actualizar la factura');
            }
        }
    };

    useEffect(() => {
        if (!id) return;

        const fetchFactura = async () => {
            try {
                setLoading(true)
                setError(null)
                setFactura(null)
                const factura = await getFacturaById(id)
                const proveedores = await getProveedores()
                setFactura(factura)
                setProveedores(proveedores)
                reset({
                    proveedor_id: factura.proveedor_id,
                    numero_factura: factura.numero_factura,
                    fecha_emision: factura.fecha_emision.slice(0, 10),
                    fecha_vencimiento: factura.fecha_vencimiento?.slice(0, 10) ?? '',
                    valor_total: factura.valor_total,
                    moneda: factura.moneda,
                    numero_contrato: factura.numero_contrato ?? ''
                });
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Error al cargar la información de la factura');
                }
            }
            finally {
                setLoading(false);
            }
        };
        fetchFactura();

    }, [id, reset]);
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
                <form onSubmit={handleSubmit(onSubmit)} className="detalle-datos">
                    <div>
                        <label htmlFor="numero_factura">Número de factura</label>
                        <input
                            id="numero_factura"
                            type="text"
                            {...register('numero_factura')}
                        />
                        {errors.numero_factura && (
                            <p>{errors.numero_factura.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="proveedor_id">Proveedor</label>
                        <select id="proveedor_id" {...register('proveedor_id')}>
                            {proveedores.map((proveedor) => (
                                <option key={proveedor.id} value={proveedor.id}>
                                    {proveedor.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.proveedor_id && <p>{errors.proveedor_id.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="fecha_emision">Fecha de emisión</label>
                        <input
                            id="fecha_emision"
                            type="date"
                            {...register('fecha_emision')}
                        />
                        {errors.fecha_emision && (
                            <p>{errors.fecha_emision.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="fecha_vencimiento">Fecha de vencimiento</label>
                        <input
                            id="fecha_vencimiento"
                            type="date"
                            {...register('fecha_vencimiento')}
                        />
                        {errors.fecha_vencimiento && (
                            <p>{errors.fecha_vencimiento.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="numero_contrato">Número de contrato</label>
                        <input
                            id="numero_contrato"
                            type="text"
                            {...register('numero_contrato')}
                        />
                        {errors.numero_contrato && (
                            <p>{errors.numero_contrato.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="valor_total">Valor total</label>
                        <input
                            id="valor_total"
                            type="text"
                            inputMode="decimal"
                            {...register('valor_total')}
                        />
                        {errors.valor_total && (
                            <p>{errors.valor_total.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="moneda">Moneda</label>
                        <input
                            id="moneda"
                            type="text"
                            {...register('moneda')}
                        />
                        {errors.moneda && (
                            <p>{errors.moneda.message}</p>
                        )}
                    </div>
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Actualizar factura'}</button>
                    {success && <p role="status">{success}</p>}
                </form>
            )}
            <Link to="/facturas" className="back-link">Volver al listado</Link>
        </div>
    );

}

export default FacturaDetalle;