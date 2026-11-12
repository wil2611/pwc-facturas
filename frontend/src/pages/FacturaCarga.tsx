import { useEffect, useState } from 'react';
import { uploadFactura } from '../services/facturas'
import '../styles/FacturaCarga.css'
import { useNavigate } from 'react-router-dom'
function FacturaCarga() {
    const [archivo, setArchivo] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [previsualizacion, setPrevisualizacion] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleArchivoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (!file) {
            setArchivo(null);
            return;
        }
        setError(null)
        setPrevisualizacion(null)
        const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!tiposPermitidos.includes(file.type)) {
            setError('Tipo de archivo no permitido. Solo se permiten PDF, JPG y PNG.');
            setArchivo(null);
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('El tamaño del archivo excede el límite de 10MB.');
            setArchivo(null);
            return;
        }
        setArchivo(file);
    };
    useEffect(() => {
        if (!archivo) {
            setPrevisualizacion(null);
            return;
        }
        const url = URL.createObjectURL(archivo);
        setPrevisualizacion(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [archivo]);
    const handleSubmit = async () => {
        if (!archivo) {
            setError('No se ha seleccionado ningún archivo.');
            return;
        }
        try {
            setLoading(true)
            setError(null)
            const facturaCreada = await uploadFactura(archivo)
            navigate(`/facturas/${facturaCreada.id}`)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Error al cargar la factura.');
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="factura-carga">
            <h1>Carga de Factura</h1>
            <label htmlFor="archivo">Seleccionar archivo de factura:</label>
            <input
                id="archivo"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={loading}
                onChange={handleArchivoChange}
            />
            <p className="archivo-ayuda">
                Formatos permitidos: PDF, JPG y PNG. Máximo 10 MB.
            </p>
            {error && <p className="error">{error}</p>}
            {archivo && previsualizacion && (archivo.type === 'application/pdf' ? (
                <iframe
                    src={previsualizacion}
                    title="Previsualización del archivo"
                />
            ) : (
                <img
                    src={previsualizacion}
                    alt="Previsualización del archivo"
                />
            ))}
            <button type="button" onClick={handleSubmit} disabled={!archivo || loading}>
                {loading ? 'Cargando...' : 'Cargar Factura'}
            </button>
            {loading && (
                <div>
                    <progress aria-label="Procesamiento de la factura" />
                    <p>Subiendo y procesando factura...</p>
                </div>
            )}
        </div>
    );
}
export default FacturaCarga;