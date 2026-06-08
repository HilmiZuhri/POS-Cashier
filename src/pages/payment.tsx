import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CreditCard, QrCode} from "lucide-react";
import type { TCartItem } from './POS';
import { useNavigate } from 'react-router-dom';
import CashPaymentModal from '@/components/ui/numpad-modal';
import ReceiptTemplate from '@/components/ui/receipt-template';
import axios from 'axios';

const PaymentPage: React.FC = () => {
   const navigate = useNavigate();
   const [cart, setCart] = useState<TCartItem[]>([]);
   const [paymentOptions, setPaymentOptions] = useState<any[]>([]);
   const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
   const [finalCash, setFinalCash] = useState<number>(0);
   const [cartSummary, setCartSummary] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(false);

   // For Receipt Printing
    const [successData, setSuccessData] = useState<any>(null);

    useEffect(() => {
      if (successData) {
        const timer = setTimeout(() => {
          window.print();
          localStorage.removeItem("pos_cart");
          navigate('/pos');
        }, 300);

        return () => clearTimeout(timer);
      }
    }, [successData, navigate]);

   const API_CONFIG = {
      headers: {
         'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
         'x-employee-code': 'admin-zakiah',
         'x-device-code': '8ee32711-54e4-4e45-b189-53e8b77a10db'
      }
   };


   useEffect(() => {
      const savedCart = localStorage.getItem("pos_cart");
      if (savedCart) {
         const parsedCart = JSON.parse(savedCart);
         setCart(parsedCart);
         handleRecalculate(parsedCart, null);
      } else {
         navigate('/pos');
      }
      
      fetchPaymentOptions();
   }, []);

   const fetchPaymentOptions = async () => {
      try {
         const response = await axios.get("https://backend-dev.secacastore.com/api/backoffice/payment_methods?limit=100&statuses[]=active", API_CONFIG);
         setPaymentOptions(response.data.data);
      } catch (err) {
         console.error("Gagal fetch payment options:", err);
      }
   }; 

   const handleRecalculate = async (currentCart: any[], methodId?: number | null) => {
      try {
         const payload = {
            customer_order_id: null,
            location_id: 5,
            order_type_id: 5,
            payment_method_id: methodId,
            products: currentCart.map(item => ({
               product_id: item.id,
               quantity: item.quantity,
               sell_price: item.sell_price,
               brand_id: item.brand_id || 1,
               product_unit_id: item.product_unit_id || 5,
               product_category_id: item.product_category_id || 1,
               order_type_id: 5,
               custom_price: false
            }))
         };

         const response = await axios.post("https://backend-dev.secacastore.com/api/kasir/customer_orders/calculate_promo", payload, API_CONFIG);
         setCartSummary(response.data.data);
      } catch (err) {
         console.error("Gagal kalkulasi ulang:", err);
      }
   };

   const handleConfirmPayment = async () => {
      if (!paymentMethodId || !cartSummary) return;
      setIsLoading(true);

      try {
         const payload = {
            ...cartSummary,
            employee_sales_id: 18,
            location_id: 5,
            order_type_id: 5,
            adjustment: null,
            customerOrderId: null,
            payments: [{
               payment_method_id: paymentMethodId,
               amount_receive: isCashSelected ? finalCash : cartSummary.totalAmount,
               change: isCashSelected ? (finalCash - cartSummary.totalAmount) : 0
            }],
            products: cart.map(item => ({
               ...item,
               product_id: item.id,
               customer_order_detail_id: 0,
               custom_price: false,
               product: { id: item.id, name: item.name, sku: item.sku, code: item.code },
               product_category: { id: item.product_category_id, name: "Category" },
               product_unit: { id: item.product_unit_id, name: "PCS" },
               order_type: { id: 5, name: "Ecer" },
               order_type_id: 5
            }))
         };

         const response = await axios.post("https://backend-dev.secacastore.com/api/kasir/sale_transactions", payload, API_CONFIG);

         // For Receipt Preview (using response data)
      if (response.data.data?.id) {
        setSuccessData({
          transactionId: response.data.data.id,
          date: new Date(). toLocaleString('id-Id'),
          items: cart,
          summary: cartSummary,
          payment: {
            method: paymentOptions.find(p => p.id === paymentMethodId)?.name || "Unknown",
            received: isCashSelected ? finalCash : cartSummary.totalAmount,
            change: isCashSelected ? (finalCash - cartSummary.totalAmount) : 0
          }
        });
        localStorage.removeItem("pos_cart");
      }

         if (response.data.data?.id) {
            localStorage.removeItem("pos_cart");
            alert("Transaksi Berhasil! ID");
         }
      } catch (err) {
         console.error("Gagal memproses transaksi:", err);
         alert("Gagal memproses transaksi.");
      } finally {
         setIsLoading(false);
      }
    };

   // Helper Values
   const cashOption = paymentOptions.find(p => p.kind === 'cash');
   const isCashSelected = paymentMethodId === cashOption?.id;
   const formatIDR = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <>
    { successData && <ReceiptTemplate data={successData} /> }
<div className="flex gap-8 h-[calc(100vh-140px)] overflow-hidden p-4 print:hidden">
      {/* Kolom Kiri: Ringkasan Belanja */}
      <div className="flex-[1.5] bg-white border rounded-2xl p-8 flex flex-col">
        <button onClick={() => navigate('/pos')} className="flex items-center gap-2 text-slate-400 mb-6 font-bold text-sm">
          <ArrowLeft size={16} /> Kembali
        </button>
        
        <h2 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Ringkasan Order</h2>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-bold text-sm uppercase">{item.name}</p>
                <p className="text-xs text-slate-400">{item.quantity} x {formatIDR(item.sell_price)}</p>
              </div>
              <p className="font-black italic">{formatIDR(item.sell_price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-dashed space-y-2">
          <div className="flex justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Subtotal</span>
            <span>{formatIDR(cartSummary?.subTotal || 0)}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-black italic">GRAND TOTAL</span>
            <span className="text-3xl font-black text-primary">{formatIDR(cartSummary?.totalAmount || 0)}</span>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Metode Pembayaran */}
      <aside className="flex-1">
        <Card className="p-8 h-full flex flex-col">
          <h3 className="font-black uppercase mb-6 italic">Pilih Pembayaran</h3>
          
          <div className="space-y-6 flex-1 overflow-y-auto">
            {/* Opsi Tunai */}
            {cashOption && (
              <CashPaymentModal 
      subtotal={cartSummary?.totalAmount || 0} 
      isActive={paymentMethodId === cashOption.id} 
      onConfirm={(amount) => {
        setPaymentMethodId(cashOption.id);
        setFinalCash(amount);
        handleRecalculate(cart, cashOption.id); // Trigger API calculate_promo
      }} 
    />
            )}

            {/* Info Kembalian (Hanya muncul jika tunai dipilih) */}
  {paymentMethodId === cashOption?.id && finalCash > 0 && (
    <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[10px] text-green-600 font-black uppercase">Dibayar</p>
          <p className="text-lg font-bold text-green-800">{formatIDR(finalCash)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-green-600 font-black uppercase">Kembalian</p>
          <p className="text-2xl font-black text-green-700 italic">
            {formatIDR(finalCash - (cartSummary?.totalAmount || 0))}
          </p>
        </div>
      </div>
    </div>
  )}

            {/* Opsi Non-Tunai */}
            <div className="grid grid-cols-2 gap-3">
              {paymentOptions.filter(p => p.kind !== 'cash').map(method => (
                <button
                  key={method.id}
                  onClick={() => {
                    setPaymentMethodId(method.id);
                    handleRecalculate(cart, method.id);
                    setFinalCash(0);
                  }}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    paymentMethodId === method.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400'
                  }`}
                >
                  {method.name.includes('QRIS') ? <QrCode size={20} /> : <CreditCard size={20} />}
                  <span className="text-[10px] font-black uppercase italic">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          <Button 
            className="w-full h-16 mt-6 text-lg font-black italic uppercase"
            disabled={!paymentMethodId || isLoading || (isCashSelected && finalCash < cartSummary?.totalAmount)}
            onClick={handleConfirmPayment}
          >
            {isLoading ? "Memproses..." : "Konfirmasi & Bayar"}
          </Button>
        </Card>
      </aside>
    </div>
  </>
  );
};

export default PaymentPage;