import { LayoutDashboard, Receipt, BarChart3, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { id: 'pos', label: 'Kasir (POS)', icon: LayoutDashboard, path: '/pos' },
  { id: 'invoice', label: 'Riwayat Invoice', icon: Receipt, path: '/invoice' },
  { id: 'rekap', label: 'Rekap Penjualan', icon: BarChart3, path: '/rekap' },
  { id: 'stok', label: 'Stok Produk', icon: Boxes, path: '/stok' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <aside className="w-64 bg-white border-r flex flex-col h-full shadow-sm">
      <div className="p-6">
        <h1 className="text-2xl font-black text-primary tracking-tighter">
          ZAKIAH<span className="text-slate-400 text-lg italic font-light">POS</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
  
  return (
    <Button
      key={item.id}
      variant={isActive ? "default" : "ghost"}
      className={`w-full justify-start gap-3 h-12 text-sm font-medium transition-all ${
        isActive 
          ? "shadow-md shadow-primary/20" 
          : "text-slate-500 hover:text-primary hover:bg-slate-50"
      }`}
      onClick={() => navigate(item.path)}
    >
      <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
      {item.label}
    </Button>
  );
})}
      </nav>
    </aside>
  );
};

export default Sidebar;