import { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, ArrowLeft, Save, CheckCircle2 } from "lucide-react";

const RekapPage = () => {
  const [actualCash, setActualCash] = useState({
    tunai: 0,
    bca: 0,
    nonBca: 0,
    qris: 0
  });

  const systemData = {
    tunai: 13000,
    bca: 0,
    nonBca: 0,
    qris: 0
  };

  const actualTotal = useMemo(() => 
    Object.values(actualCash).reduce((a, b) => a + b, 0), [actualCash]
  );
  
  const systemTotal = Object.values(systemData).reduce((a, b) => a + b, 0);
  const totalSelisih = actualTotal - systemTotal;

  const formatIDR = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)] overflow-hidden">
   <div className="flex-1 flex flex-col gap-4 min-h-0">
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl shrink-0">
         <h2 className="text-amber-700 font-bold flex items-center gap-2 text-sm uppercase tracking-tight">
            <AlertCircle size={16} />
            Rekap Pembayaran
         </h2>
         <p className="text-[11px] text-amber-600 mt-1 leading-relaxed">
            Pastikan nominal fisik sesuai dengan catatan sistem untuk menghindari selisih.
         </p>
      </div>
      <ScrollArea className="flex-1 pr-2">
         <div className="space-y-3 pb-4">
            {[
            { id: 'tunai', label: 'TUNAI' },
            { id: 'bca', label: 'BCA' },
            { id: 'nonBca', label: 'Non BCA' },
            { id: 'qris', label: 'QRIS' }
            ].map((item) => (
            <Card key={item.id} className="p-4 flex justify-between items-center shadow-sm hover:border-slate-300 transition-all group">
               <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">{item.label}</span>
               <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-400 font-mono">IDR</span>
                  <Input 
                     type="number" 
                     className="w-40 text-right h-10 font-bold text-slate-800 bg-slate-50/50" 
                     placeholder="0"
                     onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setActualCash(prev => ({ ...prev, [item.id]: val }));
                  }}
                  />
               </div>
            </Card>
            ))}
         </div>
      </ScrollArea>
      <div className={`p-5 rounded-2xl border transition-all shrink-0 shadow-sm ${
      totalSelisih === 0 ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-100'
      }`}>
      <div className="flex justify-between text-[10px] text-slate-400 mb-1 uppercase font-black tracking-widest">
         <span>Tercatat di Sistem</span>
         <span>{formatIDR(systemTotal)}</span>
      </div>
      <div className="flex justify-between items-center border-t border-slate-200 pt-3 mt-2">
         <span className={`text-sm font-bold ${totalSelisih === 0 ? 'text-slate-600' : 'text-red-600'}`}>
         Selisih Akhir
         </span>
         <span className={`text-2xl font-black ${totalSelisih === 0 ? 'text-slate-900' : 'text-red-700'}`}>
         {formatIDR(totalSelisih)}
         </span>
      </div>
   </div>
   <div className="flex gap-2 shrink-0">
      <Button className="flex-1 h-12 gap-2 font-bold" disabled={actualTotal === 0}>
      <Save size={18} />
      Simpan Laporan
      </Button>
      <Button variant="outline" className="h-12 gap-2 text-slate-500">
         <ArrowLeft size={18} />
         Kembali
      </Button>
   </div>
</div>
<aside className="flex-[1.2] bg-white border rounded-2xl shadow-xl overflow-hidden flex flex-col">
   <div className="bg-primary p-5 text-white flex justify-between items-center shrink-0">
      <div className="flex items-center gap-2">
         <CheckCircle2 className="text-white h-5 w-5" />
         <h3 className="font-bold tracking-tight uppercase text-xs">Pratinjau Laporan</h3>
      </div>
      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded tracking-tighter">OFFLINE RECAP</span>
   </div>
   <ScrollArea className="flex-1 p-6">
      <div className="space-y-8">
         <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
               <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Transaksi</p>
               <p className="text-lg font-black text-slate-800">1</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
               <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Tanggal</p>
               <p className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString('id-ID')}</p>
            </div>
         </div>
         <div>
            <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-4">Perbandingan Kas</h4>
            <div className="space-y-4">
               {Object.keys(systemData).map((key) => {
               const k = key as keyof typeof systemData;
               const diff = actualCash[k] - systemData[k];
               return (
               <div key={k} className="flex justify-between items-end border-b border-slate-50 pb-2">
                  <div className="space-y-1">
                     <p className="text-xs font-black text-slate-800 uppercase italic">{k}</p>
                     <p className="text-[10px] text-slate-400 font-mono">Sistem: {formatIDR(systemData[k])}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-bold text-slate-900">{formatIDR(actualCash[k])}</p>
                     <p className={`text-[10px] font-bold ${diff === 0 ? 'text-slate-400' : 'text-red-500'}`}>
                     {diff > 0 ? '+' : ''}{formatIDR(diff)}
                     </p>
                  </div>
               </div>
               );
               })}
            </div>
         </div>
         <section className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <div className="flex justify-between text-xs text-slate-500">
               <span>Penjualan Kotor</span>
               <span className="font-bold text-slate-700">{formatIDR(systemTotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
               <span>Potongan/Promo</span>
               <span className="font-bold text-slate-700">{formatIDR(0)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-black text-slate-900 text-lg">
               <span className="uppercase tracking-tighter">Penjualan Bersih</span>
               <span>{formatIDR(systemTotal)}</span>
            </div>
         </section>
      </div>
   </ScrollArea>
</aside>
</div>
  );
};

export default RekapPage;