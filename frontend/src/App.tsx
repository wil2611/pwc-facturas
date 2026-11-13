import { Routes, Route, Navigate } from 'react-router-dom'
import FacturasListado from './pages/FacturasListado'
import FacturaDetalle from './pages/FacturaDetalle'
import FacturaCarga from './pages/FacturaCarga'
import FacturasResumen from './pages/FacturasResumen'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/facturas" replace />} />
      <Route path="/facturas" element={<FacturasListado />} />
      <Route path="/facturas/:id" element={<FacturaDetalle />} />
      <Route path="/carga" element={<FacturaCarga />} />
      <Route path="/resumen" element={<FacturasResumen />} />
    </Routes>
  )
}

export default App
