import { useEffect, useState } from 'react'
import '../styles/FacturasListado.css'
import type { ResumenFactura } from '../types/facturas'
import { getResumenFacturas } from '../services/facturas'
import { Link } from 'react-router-dom'

const formatearFecha = (fecha: string) => {
  const [anio, mes] = fecha.slice(0, 10).split('-')
  return `${mes}/${anio}`
}

function FacturasResumen() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resumenFacturas, setResumenFacturas] = useState<ResumenFactura[]>([])

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        setLoading(true)
        setError(null)
        const data: ResumenFactura[] = await getResumenFacturas()
        setResumenFacturas(data)
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
    fetchFacturas()
  }, [])

  return (
    <div className="App">
      <h1>Resumen de facturas</h1>
      <p className="description">Resumen mensual de facturas por proveedor y moneda</p>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : resumenFacturas.length === 0 ? (
        <p>No hay facturas</p>
      ) : (
        <div className="table-container">
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Proveedor</th>
                  <th>Total de facturas</th>
                  <th>Mes de la factura</th>
                  <th className="amount">Valor total</th>
                  <th>Moneda</th>
                </tr>
              </thead>
              <tbody>
                {resumenFacturas.map((factura) => (
                  <tr key={`${factura.proveedor}-${factura.mes_factura}-${factura.moneda}`}>
                    <td>{factura.proveedor}</td>
                    <td>{factura.total_facturas}</td>
                    <td>{formatearFecha(factura.mes_factura)}</td>
                    <td className="amount">{new Intl.NumberFormat('es-CO').format(Number(factura.total_valor))}</td>
                    <td>{factura.moneda}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Link to="/facturas" className="back-link">Volver al listado</Link>
    </div>
  )
}

export default FacturasResumen
