import { Routes, Route, Navigate } from 'react-router-dom'
import FacturasListado from './pages/FacturasListado'
import FacturaDetalle from './pages/FacturaDetalle'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/facturas" replace />} />
      <Route path="/facturas" element={<FacturasListado />} />
      <Route path="/facturas/:id" element={<FacturaDetalle />} />
    </Routes>
  )
}

export default App
