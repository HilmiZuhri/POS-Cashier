import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Card } from "@/components/ui/card";
import { Search, Minus, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const RefundPage = () => {
  const navigate = useNavigate();
  
  // State dummy untuk produk yang bisa di-refund
  const [items] = useState([
    { id: 1, name: "Jarum pentul 5K", price: 5000, sku: "910403202336", qty: 1 },
    { id: 2, name: "Kartu Ucapan Kecil", price: 2000, sku: "9928062021002", qty: 1 },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header Halaman */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pengembalian dana</h1>
          <p className="text-sm text-slate-500">Silahkan lakukan pengembalian dana 20260416/ZHPAN/00001 disini</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft size={16} /> Kembali
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI: FORM DAFTAR PRODUK & ALASAN */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h3 className="font-bold text-lg mb-2">Daftar Produk</h3>
            <p className="text-xs text-slate-400 mb-4">Daftar produk yang diajukan untuk pengembalian...</p>
            
            <div className="flex gap-2 mb-6">
              <Button className="bg-primary px-6 font-bold">Refund semua</Button>
              <Button variant="secondary" className="px-6 font-bold">Reset</Button>
            </div>

            {/* List Produk */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Daftar produk</h4>
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.price.toLocaleString()} {item.sku}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="border rounded-md px-4 py-1 font-bold">{item.qty}</div>
                    <Button size="icon" variant="outline" className="h-8 w-8 bg-blue-100 border-blue-200 text-blue-600">
                      <Minus size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Form Alasan & Catatan */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-bold text-slate-700">Alasan Refund</label>
              <Textarea placeholder="Tuliskan alasan refund." className="min-h-[100px] bg-white" />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-slate-700">Catatan</label>
              <Textarea placeholder="Tuliskan catatan refund." className="min-h-[100px] bg-white" />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-slate-700">Transaksi Pengganti</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input placeholder="Pilih struk" className="pl-10 bg-white" />
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: RINGKASAN REFUND */}
        <div className="lg:col-span-1">
          <Card className="p-6 border-2 border-primary shadow-xl shadow-primary/5 sticky top-8">
            <h3 className="font-bold text-slate-900 mb-4">Produk yang akan di refund</h3>
            
            {/* Area List Refunded Items */}
            <div className="min-h-[200px] flex items-center justify-center border-b border-dashed mb-6">
               <p className="text-slate-400 text-sm italic">Tidak ada produk yang akan di refund</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-600">Ringkasan Refund</span>
              </div>
              <div className="flex justify-between items-center text-xl font-black">
                <span className="text-slate-400 uppercase tracking-tighter">Total Refund</span>
                <span className="text-primary">0</span>
              </div>
              <Button className="w-full h-12 bg-primary font-black uppercase italic tracking-widest mt-4">
                Proses refund
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RefundPage;