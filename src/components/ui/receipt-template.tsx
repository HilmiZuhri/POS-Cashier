import React from 'react';

interface ReceiptTemplateProps {
  data: {
    transactionId: string | number;
    date: string;
    items: any[];
    summary: any;
    payment: {
      method: string;
      received: number;
      change: number;
    };
  };
}

const ReceiptTemplate = React.forwardRef<HTMLDivElement, ReceiptTemplateProps>(({ data }, ref) => {
  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID').format(val);

  return (
    <div ref={ref} className="p-4 w-[80mm] bg-white text-black font-mono text-[12px] leading-tight print:block hidden">
      <div className="text-center mb-4">
        <h1 className="text-xl font-black uppercase">ZAKIAH</h1>
        <p className="text-[10px]">Jl. Contoh No. 123, Madiun</p>
        <p className="text-[10px]">Telp: 0812-3456-7890</p>
      </div>

      <div className="border-b border-dashed border-black mb-2 pb-2">
        <p>No: #{data.transactionId}</p>
        <p>Tgl: {data.date}</p>
        <p>Kasir: Admin Zakiah</p>
      </div>

      <div className="border-b border-dashed border-black mb-2 pb-2">
        {data.items.map((item, idx) => (
          <div key={idx} className="mb-2">
            <p className="uppercase">{item.name}</p>
            <div className="flex justify-between">
              <span>{item.quantity} x {formatIDR(item.sell_price)}</span>
              <span>{formatIDR(item.quantity * item.sell_price)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1 mb-2">
        <div className="flex justify-between font-bold">
          <span>SUBTOTAL</span>
          <span>{formatIDR(data.summary?.subTotal || 0)}</span>
        </div>
        {data.summary?.totalAmount < data.summary?.subTotal && (
          <div className="flex justify-between">
            <span>DISKON</span>
            <span>-{formatIDR(data.summary.subTotal - data.summary.totalAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-black border-t border-black pt-1">
          <span>TOTAL</span>
          <span>{formatIDR(data.summary?.totalAmount || 0)}</span>
        </div>
      </div>

      <div className="border-t border-dashed border-black pt-2 mb-4">
        <div className="flex justify-between">
          <span>METODE:</span>
          <span className="uppercase">{data.payment.method}</span>
        </div>
        <div className="flex justify-between">
          <span>BAYAR:</span>
          <span>{formatIDR(data.payment.received)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>KEMBALI:</span>
          <span>{formatIDR(data.payment.change)}</span>
        </div>
      </div>

      <div className="text-center mt-6 uppercase">
        <p>*** Terima Kasih ***</p>
        <p className="text-[10px]">Barang yang sudah dibeli</p>
        <p className="text-[10px]">tidak dapat ditukar/dikembalikan</p>
      </div>
    </div>
  );
});

export default ReceiptTemplate;