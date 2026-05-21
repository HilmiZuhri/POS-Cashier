import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Filter, User, FileText, Receipt, Printer, RotateCcw } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import FilterInvoiceModal from "@/components/ui/filter-invoice-modal";
import PrevButton from '@/components/ui/prev-button';
import NextButton from '@/components/ui/next-button';
import { set } from 'date-fns';

const InvoicePage: React.FC = () => {
  const navigate = useNavigate();
  
  // States
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<'me' | 'all'>('me');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Data dari API
  const fetchInvoices = async (keyword: string, cursorToken: string | null = null) => {
    setIsLoading(true);
    try {
      const isOnlyMe = filterMode === 'me';
      const url = "https://backend-dev.secacastore.com/api/kasir/sale_transactions?locs[]=5";
      
      const res = await axios.get(url, {
        params: {
          limit: 10,
          refund_amount: -1,
          only_logged_cashier: isOnlyMe,
          keyword: keyword,
          cursor: cursorToken
        },
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-employee-code': 'admin-zakiah',
          'x-device-code': '8ee32711-54e4-4e45-b189-53e8b77a10db'
        }
      });

      const result = res.data;

      const getCursorValue = (urlStr: string | null | undefined) => {
      if (!urlStr) return null;
      try {
        const urlObj = new URL(urlStr);
        return urlObj.searchParams.get("cursor");
      } catch (e) {
        return urlStr;
      }
    };

      const nextLink = result.next_cursor || result.next_page_url || result.data?.next_page_url || result.data?.links?.next;
      const prevLink = result.prev_cursor || result.prev_page_url || result.data?.prev_page_url || result.data?.links?.prev;

      setNextCursor(getCursorValue(nextLink));
      setPrevCursor(getCursorValue(prevLink));

      if (res.data?.data) {
        setInvoices(res.data.data);
      }
    } catch (err) {
      console.error("Gagal load riwayat:", err);
    } finally {
      setIsLoading(false);
    }

    

  };

  useEffect(() => {
    fetchInvoices(searchQuery, null);
  }, [filterMode]);

  // Logic: Invoice Filter 
  const filteredInvoices = invoices.filter((inv) =>
    inv.sales_no.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inv.cashier_first_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatIDR = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // Next & Prev Cursor
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);

  const [isDetailLoading, setIsDetailLoading] = useState(false);

// Fungsi Fetch Detail Invoice
const fetchInvoiceDetail = async (id: number) => {
  setIsDetailLoading(true);
  try {
    const url = `https://backend-dev.secacastore.com/api/kasir/sale_transactions/${id}`;
    const res = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'x-employee-code': 'admin-zakiah',
        'x-device-code': '8ee32711-54e4-4e45-b189-53e8b77a10db'
      }
    });
    
    if (res.data?.data) {
      // Kita update selectedInvoice dengan data lengkap dari API detail
      setSelectedInvoice(res.data.data);
    }
  } catch (err) {
    console.error("Gagal load detail invoice:", err);
  } finally {
    setIsDetailLoading(false);
  }
};

// Modifikasi klik pada Card List
const handleSelectInvoice = (inv: any) => {
  // Set data awal dari list dulu biar UI langsung bereaksi
  setSelectedInvoice(inv);
  // Baru fetch detailnya
  fetchInvoiceDetail(inv.id);
};

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)] p-4">
      {/* ========= Kolom Kiri: List Struk ========= */}
      <div className="flex-[1.5] flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800">Riwayat Penjualan</h2>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari nomor struk..." 
                className="pl-10 h-12 border-2 border-slate-100 focus:border-primary transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className={`h-12 w-12 p-0 border-2 transition-all ${filterMode === 'me' ? 'border-primary text-primary bg-primary/5' : 'border-slate-200'}`}
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Filter size={20} />
            </Button>
          </div>

          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black uppercase px-2 py-1 bg-slate-900 text-white rounded italic tracking-widest">
               MODE: {filterMode === 'me' ? 'SAYA' : 'SEMUA'}
             </span>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-24 w-full bg-slate-100 animate-pulse rounded-xl" />)}
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {filteredInvoices.map((inv) => (
                <Card 
                  key={inv.id}
                  onClick={() => handleSelectInvoice(inv)}
                  className={`p-5 cursor-pointer transition-all border-2 ${
                    selectedInvoice?.id === inv.id 
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5 translate-x-2' 
                    : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono text-[10px] text-slate-400 font-bold mb-1">{inv.sales_no}</p>
                      <h4 className="font-black text-xl text-slate-800 italic tracking-tighter">
                        {formatIDR(inv.net_sales_after_tax)}
                      </h4>
                    </div>
                    <span className="text-[10px] bg-white px-2 py-1 rounded border font-bold text-slate-500">
                      {inv.local_sales_at.split(' ')[1].substring(0, 5)} WIB
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4 text-[11px] font-bold uppercase text-slate-500 italic">
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-primary" />
                      {inv.cashier_first_name} {inv.cashier_last_name}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText size={12} className="text-primary" />
                      {inv.product_ids.length} Jenis Barang
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
        {/* Controls Pagination */}
    <div className="py-3 border-t bg-white flex items-center justify-between mt-auto">
      <div className="flex gap-2"> 
        <PrevButton disabled={!prevCursor} loading={isLoading} onClick={() => fetchInvoices(searchQuery, prevCursor)} />
        <NextButton disabled={!nextCursor} loading={isLoading} onClick={() => fetchInvoices(searchQuery, nextCursor)} />
      </div>
    </div>
      </div>
      

      {/* ========= Kolom Kanan: Detail ========= */}
<aside className="flex-1 bg-white border-2 border-slate-100 rounded-3xl shadow-sm flex flex-col overflow-hidden">
  {isDetailLoading ? (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
       <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
       <p className="text-[10px] font-black uppercase italic text-slate-400">Mengambil Data...</p>
    </div>
  ) : selectedInvoice && selectedInvoice.sale_transaction_details ? (
    <>
      <div className="p-6 border-b-2 border-dashed bg-slate-50/50 text-center">
        <h3 className="font-black text-2xl tracking-tighter text-slate-800 italic uppercase">Detail Invoice</h3>
        <p className="text-[10px] text-slate-400 font-mono mt-1 font-bold">{selectedInvoice.sales_no}</p>
      </div>
      
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {/* List Barang */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daftar Barang</p>
            {selectedInvoice.sale_transaction_details.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start border-b border-slate-50 pb-3">
                <div className="flex-1">
                  <p className="font-bold text-slate-700 text-sm uppercase">{item.product_name || item.product?.name}</p>
                  <p className="text-xs text-slate-400 font-medium">
                    {item.quantity} {item.product_unit_name || 'PCS'} x {formatIDR(item.sell_price)}
                  </p>
                </div>
                <p className="text-sm font-black text-slate-800 italic">{formatIDR(item.total_amount)}</p>
              </div>
            ))}
          </div>

          {/* Ringkasan Pembayaran */}
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border-2 border-slate-100">
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Subtotal</span>
              <span className="text-slate-800">{formatIDR(selectedInvoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Pajak</span>
              <span className="text-slate-800">{formatIDR(selectedInvoice.tax_amount || 0)}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-primary pt-3 border-t-2 border-dashed border-slate-200 italic">
              <span>TOTAL</span>
              <span>{formatIDR(selectedInvoice.net_sales_after_tax)}</span>
            </div>
          </div>

          {/* Info Pembayaran (Tunai/Non-Tunai) */}
          {selectedInvoice.sale_transaction_payments && selectedInvoice.sale_transaction_payments.length > 0 && (
            <div className="p-4 rounded-xl border-2 border-slate-100 space-y-2">
               <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                  <span>Metode</span>
                  <span>{selectedInvoice.sale_transaction_payments[0].payment_method_name}</span>
               </div>
               <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                  <span>Diterima</span>
                  <span className="text-slate-800">{formatIDR(selectedInvoice.sale_transaction_payments[0].amount_receive)}</span>
               </div>
               <div className="flex justify-between text-xs font-black text-green-600 uppercase border-t pt-2">
                  <span>Kembalian</span>
                  <span>{formatIDR(selectedInvoice.sale_transaction_payments[0].change)}</span>
               </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t-2 bg-white flex gap-3">
        <Button variant="outline" className="flex-1 h-14 gap-2 font-black italic border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none transition-all">
          <Printer size={18} /> CETAK ULANG
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 h-14 gap-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-black italic shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] active:translate-y-1 active:shadow-none transition-all"
          onClick={() => navigate('/refund')}
        >
          <RotateCcw size={18} /> REFUND
        </Button>
      </div>
    </>
  ) : (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200">
        <Receipt size={40} strokeWidth={1.5} />
      </div>
      <p className="text-sm font-black uppercase italic tracking-widest text-slate-400">Pilih struk untuk detail</p>
    </div>
  )}
</aside>

      {/* Modal Filter */}
      <FilterInvoiceModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilter={filterMode}
        onFilterChange={(val) => setFilterMode(val)}
      />
    </div>
  );
};

export default InvoicePage;