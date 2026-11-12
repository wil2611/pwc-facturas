import { useEffect, useState } from 'react'
import './App.css'
import type { Factura } from './types/facturas'
import { getFacturas } from './services/facturas'

function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [facturas, setFacturas] = useState<Factura[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [proveedor, setProveedor] = useState<string>('')
  const [fechaDesde, setFechaDesde] = useState<string>('')
  const [fechaHasta, setFechaHasta] = useState<string>('')
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    proveedor: '',
    fechaDesde: '',
    fechaHasta: '',
  })

  const fetchFacturas = async () => {
    try {
      setLoading(true)
      setError(null)
      const data: Factura[] = await getFacturas(page, pageSize, filtrosAplicados.proveedor, filtrosAplicados.fechaDesde, filtrosAplicados.fechaHasta)
      setFacturas(data)
    } catch (error) {
      console.error(error)
      setError(error instanceof Error ? error.message : 'Error cargando facturas')
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
        <button type="button" onClick={() => {
          if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
            setError('La fecha desde no puede ser mayor que la fecha hasta')
            return
          };
          setPage(1);  
          setFiltrosAplicados({ proveedor, fechaDesde, fechaHasta });
        }}>Buscar</button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : facturas.length === 0 ? (
        <p>No hay facturas</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Numero Factura</th>
              <th>Proveedor</th>
              <th>Fecha Emision</th>
              <th>Valor Total</th>
              <th>Moneda</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => (
              <tr key={factura.id}>
                <td>{factura.numero_factura}</td>
                <td>{factura.proveedor.nombre}</td>
                <td>{factura.fecha_emision.slice(0, 10)}</td>
                <td>{factura.valor_total}</td>
                <td>{factura.moneda}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={loading || page === 1}>
          Anterior
        </button>
        <span>Página {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)} disabled={loading || facturas.length < pageSize}>
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default App
