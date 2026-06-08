import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Users, Check } from "lucide-react";

interface FilterInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: 'me' | 'all';
  onFilterChange: (filter: 'me' | 'all') => void;
}

const FilterInvoiceModal = ({ isOpen, onClose, currentFilter, onFilterChange }: FilterInvoiceModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-6 border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Filter Riwayat</DialogTitle>
          <p className="text-sm text-slate-500 font-medium">Tentukan riwayat penjualan yang ingin ditampilkan</p>
        </DialogHeader>

        <div className="space-y-3 mt-6">
          <Button
            variant={currentFilter === 'me' ? "default" : "outline"}
            className={`w-full h-16 justify-between px-6 border-2 ${currentFilter === 'me' ? 'border-slate-900' : 'border-slate-100'}`}
            onClick={() => {
              onFilterChange('me');
              onClose();
            }}
          >
            <div className="flex items-center gap-4">
              <User size={20} />
              <span className="font-bold uppercase italic">Penjualan Saya</span>
            </div>
            {currentFilter === 'me' && <Check size={20} />}
          </Button>

          <Button
            variant={currentFilter === 'all' ? "default" : "outline"}
            className={`w-full h-16 justify-between px-6 border-2 ${currentFilter === 'all' ? 'border-slate-900' : 'border-slate-100'}`}
            onClick={() => {
              onFilterChange('all');
              onClose();
            }}
          >
            <div className="flex items-center gap-4">
              <Users size={20} />
              <span className="font-bold uppercase italic">Semua Penjualan</span>
            </div>
            {currentFilter === 'all' && <Check size={20} />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterInvoiceModal;