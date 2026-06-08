// src/pages/Stok.tsx
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Store, Package, History, ArrowRight } from "lucide-react";
import axios from 'axios';

const StokPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]); 
  const [selectedBranchDetail, setSelectedBranchDetail] = useState<any>(null); 

  const searchProduct = async (keyword: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/kasir/catalogues/product_search`, {
        params: {
          limit: 16,
          location: 5,
          filter_stock: true,
          keyword: keyword
        },
         headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-employee-code': 'admin-zakiah',
          'x-device-code': '4f9deff9-80f7-4eb7-b3b8-08a49a41f3fc'
        }
      });
      const result = response.data;
      console.log(result);
      setProducts(result.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductStocks = async (product: any) => {
    setSelectedProduct(product);
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/kasir/product_location_stocks`, {
         params: {
          limit: 100,
          prod_id: product.id
         },
         headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-employee-code': 'admin-zakiah',
            'x-device-code': '4f9deff9-80f7-4eb7-b3b8-08a49a41f3fc'
        }
      });
      const result = response.data;
      setBranches(result.data); 
    } finally {
      setLoading(false);
    }
  };

  const fetchStockDetail = async (branchData: any) => {
    setLoading(true);
    
    setSelectedBranchDetail(branchData); 

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/kasir/product_location_stocks/${branchData.id}`, {
         headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-employee-code': 'admin-zakiah',
            'x-device-code': '4f9deff9-80f7-4eb7-b3b8-08a49a41f3fc'
        }
      });
      const result = response.data;
      
      setSelectedBranchDetail((prev: any) => ({
        ...prev,
        productStockMovements: result.data?.productStockMovements || result.data || []
      }));
      console.log("Detail & Riwayat:", result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce Search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm) searchProduct(searchTerm);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const formatIDR = (price: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)] overflow-hidden">
   <div className="flex-[1.5] flex flex-col min-h-0 gap-4">
      {/* Search Input */}
      <div className="relative shrink-0">
         <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
         <Input 
            placeholder="Cari produk..." 
            className="pl-10 h-11 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>
      <ScrollArea className="flex-1 bg-white border rounded-xl p-4 shadow-sm">
         {!selectedProduct ? (
         /* 1. Product Search Result */
         <div className="space-y-2">
            {products.map(product => (
            <Card 
               key={product.id}
               onClick={() =>
               fetchProductStocks(product)}
               className="p-4 cursor-pointer hover:border-primary group"
               >
               <div className="flex justify-between items-center">
                  <div>
                     <h4 className="font-bold text-slate-700">{product.name}</h4>
                     <p className="text-xs text-slate-400">SKU: {product.sku || product.product_code}</p>
                  </div>
                  <ArrowRight size={16} />
               </div>
            </Card>
            ))}
         </div>
         ) : (
         /* 2. STOCK PER LOCATION */
         <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <button onClick={() => {setSelectedProduct(null); setBranches([]); setSelectedBranchDetail(null);}} className="text-xs font-bold text-primary mb-4 flex items-center gap-1">
            ← Kembali ke pencarian
            </button>
            <h3 className="font-black text-lg mb-4">{selectedProduct.name}</h3>
            <table className="w-full text-sm">
               <thead>
                  <tr className="text-slate-400 border-b text-[10px] uppercase">
                     <th className="text-left py-3">Nama Cabang</th>
                     <th className="text-right py-3">Stok</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {branches.map((b) => (
                  <tr 
                     key={b.id} 
                     onClick={() =>
                     fetchStockDetail(b)} 
                     className={`cursor-pointer hover:bg-slate-50 ${selectedBranchDetail?.id === b.id ? 'bg-slate-50' : ''}`}
                     >
                     <td className="py-4 font-bold">{b.location?.name || "Lokasi Tidak Diketahui"}</td>
                     <td className="py-4 text-right font-black">{b.stock}</td>
                  </tr>
                  ))}
               </tbody>
            </table>
         </div>
         )}
      </ScrollArea>
   </div>
   {/* ASIDE: DETAIL & HISTORY */}
   <aside className="flex-1 bg-white border rounded-xl shadow-xl flex flex-col overflow-hidden">
      <div className="bg-slate-800 p-4 text-white flex items-center gap-2">
         <Package size={18} />
         <h3 className="font-bold text-sm uppercase tracking-tight">Detail Produk</h3>
      </div>
      <ScrollArea className="flex-1">
         {selectedBranchDetail ? (
         <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* ===== Informasi Dasar ===== */}
            <div className="space-y-3">
               {[
               { label: 'Nama Produk', value: selectedProduct?.name },
               { label: 'Barcode', value: selectedProduct?.barcode },
               { label: 'Lokasi', value: selectedBranchDetail?.location?.name},
               { label: 'Harga Jual', value: formatIDR(selectedBranchDetail?.product?.sell_price || selectedProduct?.sell_price) },
               { label: 'Stok Saat Ini', value: selectedBranchDetail?.stock ?? 0, highlight: true },
               ].map((info, i) => (
               <div key={i} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-medium">{info.label}</span>
                  <span className={`font-bold ${info.highlight ? 'text-primary text-xl' : 'text-slate-700'}`}>
                  {info.value}
                  </span>
               </div>
               ))}
            </div>
            {/* ===== Stock Movement Table ===== */}
            <div>
               <h4 className="flex items-center gap-2 font-black text-[10px] text-slate-400 uppercase tracking-widest mb-4">
                  <History size={14} />
                  Daftar Pergerakan Stok
               </h4>
               <table className="w-full text-[11px]">
                  <thead>
                     <tr className="text-slate-400 border-b">
                        <th className="text-left py-2 font-bold uppercase">Tanggal</th>
                        <th className="text-right py-2 font-bold uppercase">Masuk</th>
                        <th className="text-right py-2 font-bold uppercase">Keluar</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y text-slate-600">
                     {selectedBranchDetail?.productStockMovements && selectedBranchDetail.productStockMovements.length > 0 ? (
                     selectedBranchDetail.productStockMovements.map((log: any) => (
                     <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3">
                           {/* Format Tanggal dari created_at */}
                           {new Date(log.created_at).toLocaleString('id-ID', {
                           day: '2-digit',
                           month: '2-digit',
                           year: 'numeric',
                           hour: '2-digit',
                           minute: '2-digit'
                           })}
                        </td>
                        {/* Stock In */}
                        <td className={`text-right font-bold ${log.stock_in > 0 ? 'text-green-600' : 'text-slate-300'}`}>
                           {log.stock_in > 0 ? `+${log.stock_in}` : '0'}
                        </td>
                        {/* Stock (Out) */}
                        <td className={`text-right font-bold ${log.stock_out > 0 ? 'text-red-500' : 'text-slate-300'}`}>
                           {log.stock_out > 0 ? `-${log.stock_out}` : '0'}
                        </td>
                     </tr>
                     ))
                     ) : (
                     <tr>
                        <td colSpan={3} className="py-10 text-center text-slate-400 italic">
                           {loading? "Memuat data riwayat..." : "Tidak ada riwayat pergerakan stok di cabang ini"}
                        </td>
                     </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
         ) : (
         <div className="h-full flex flex-col items-center justify-center text-slate-300 p-10 text-center">
            <Store size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">Pilih cabang terlebih dahulu untuk melihat detail pergerakan stok</p>
         </div>
         )}
      </ScrollArea>
   </aside>
</div>
  );
};

export default StokPage;