import POSPage from "./pages/POS"
import InvoicePage from "./pages/invoice"
import Sidebar from "./components/ui/sidebar"
import { useState } from "react"
import RekapPage from "./pages/rekap"
import StokPage from "./pages/product-stock"
import PaymentPage from "./pages/payment"
import RefundPage from "./pages/refund-page"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar /> 

        <main className="flex-1 flex flex-col p-6 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/pos" />} />
            <Route path="/pos" element={<POSPage />} />
            
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/invoice" element={<InvoicePage />} />
            
            <Route path="/refund" element={<RefundPage />} />
            
            <Route path="/stok" element={<StokPage />} />
            <Route path="/rekap" element={<RekapPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App;