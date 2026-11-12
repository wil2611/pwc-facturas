import { useEffect, useState } from 'react'
import '../styles/FacturasListado.css'
import type { Factura, FacturasResponse } from '../types/facturas'
import { getFacturas } from '../services/facturas'
import { Link } from 'react-router-dom'

function FacturasListado() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [facturas, setFacturas] = useState<Factura[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.ceil(totalCount / pageSize)
  const [proveedor, setProveedor] = useState<string>('')
  const [fechaDesde, setFechaDesde] = useState<string>('')
  const [fechaHasta, setFechaHasta] = useState<string>('')
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    proveedor: '',
    fechaDesde: '',
    fechaHasta: '',
  })
  const [errorFiltros, setErrorFiltros] = useState<string | null>(null)

  const fetchFacturas = async () => {
    try {
      setLoading(true)
      setError(null)
      const data: FacturasResponse = await getFacturas(page, pageSize, filtrosAplicados.proveedor, filtrosAplicados.fechaDesde, filtrosAplicados.fechaHasta)
      setFacturas(data.facturas)
      setTotalCount(data.totalCount)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Error al obtener las facturas')
      }
    } finally {
      setLoading(false)
    }
  }



  useEffect(() => {
    fetchFacturas()
  }, [page, filtrosAplicados])

  return (
    <div className="App">
      <h1>Facturas</h1>
      <p className="description">Consulta de facturas registradas</p>
      <div className="filters">
        <div className="provider-filter">
          <label htmlFor="proveedor">Proveedor:</label>
          <input
            type="text"
            id="proveedor"
            value={proveedor}
            onChange={(e) =>
              setProveedor(e.target.value)
            }
          />
        </div>
        <div className="date-filter">
          <label htmlFor="fechaDesde">Fecha Desde:</label>
          <input
            type="date"
            id="fechaDesde"
            value={fechaDesde}
            onChange={(e) =>
              setFechaDesde(e.target.value)
            }
          />
        </div>
        <div className="date-filter">
          <label htmlFor="fechaHasta">Fecha Hasta:</label>
          <input
            type="date"
            id="fechaHasta"
            value={fechaHasta}
            onChange={(e) =>
              setFechaHasta(e.target.value)
            }
          />
        </div>
        <button type="button" className="filters-button" onClick={() => {
          if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
            setErrorFiltros('La fecha desde no puede ser mayor que la fecha hasta')
            return
          };
          setErrorFiltros(null);
          setPage(1);
          setFiltrosAplicados({ proveedor, fechaDesde, fechaHasta });
        }}>Buscar</button>
        <button type="button" className="clear-filters" onClick={() => {
          setProveedor('');
          setFechaDesde('');
          setFechaHasta('');
          setErrorFiltros(null);
          setPage(1);
          setFiltrosAplicados({ proveedor: '', fechaDesde: '', fechaHasta: '' });
        }}>Limpiar filtros</button>
        {errorFiltros && <p className="filter-error" role="alert">{errorFiltros}</p>}
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : facturas.length === 0 ? (
        <p>No hay facturas</p>
      ) : (
        <div className="table-container">
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Numero Factura</th>
                  <th>Proveedor</th>
                  <th>Fecha Emision</th>
                  <th>Fecha Vencimiento</th>
                  <th>Numero de contrato</th>
                  <th className="amount">Valor Total</th>
                  <th>Moneda</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura) => (
                  <tr key={factura.id}>
                    <td>{factura.numero_factura}</td>
                    <td>{factura.proveedor.nombre}</td>
                    <td>{factura.fecha_emision.slice(0, 10)}</td>
                    <td>{factura.fecha_vencimiento?.slice(0, 10) ?? 'No especificada'}</td>
                    <td>{factura.numero_contrato ?? 'No especificado'}</td>
                    <td className="amount">{new Intl.NumberFormat('es-CO').format(Number(factura.valor_total))}</td>
                    <td>{factura.moneda}</td>
                    <td><Link to={`/facturas/${factura.id}`}>Ver detalle</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={loading || page === 1}>
              Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button onClick={() => setPage((prev) => prev + 1)} disabled={loading || page >= totalPages}>
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FacturasListado
