import { useState } from 'react';
import { UserPlus, Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface MemberModalProps {
  selectedMember: string | null;
  onSelect: (name: string) => void;
}

const MemberModal = ({ selectedMember, onSelect }: MemberModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'search' | 'add'>('search');
  const [search, setSearch] = useState("");
  
  // State Form untuk Member Baru
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  const handleClose = () => {
    setIsOpen(false);
    setView('search'); // Reset ke tampilan cari saat ditutup
  };

  const handleSave = () => {
    // Simulasi simpan: Mengambil nama dari form atau string default
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    onSelect(fullName || "Pelanggan Baru");
    handleClose();
  };

  return (
    <>
      {/* Trigger Button */}
      <Button 
        variant="outline" 
        className="bg-white border-primary text-primary hover:bg-primary/5 font-bold text-xs h-10 gap-2"
        onClick={() => setIsOpen(true)}
      >
        <UserPlus size={16} />
        {selectedMember || "Member"}
      </Button>

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 pb-0 text-left">
            <DialogTitle className="font-black text-3xl text-slate-900 leading-none">
              Member
            </DialogTitle>
            <p className="text-sm text-slate-500 mt-2">
              Masukkan member yang sedang melakukan pembelian.
            </p>
          </DialogHeader>

          <div className="p-6">
            {view === 'search' ? (
              /* --- TAMPILAN CARI --- */
              <div className="space-y-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="cari pelanggan ..." 
                      className="pl-10 h-12 border-slate-300 focus:border-primary focus:ring-primary font-medium"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Button className="h-12 px-6 bg-primary font-bold">Cari</Button>
                </div>

                <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <p className="text-slate-600 font-medium">
                    Silahkan cari atau menambahkan member baru
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-4 border-t border-slate-100">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary/5 font-bold h-11 px-6"
                    onClick={() => setView('add')}
                  >
                    Tambah member
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold h-11 px-6"
                    onClick={handleClose}
                  >
                    Kembali
                  </Button>
                </div>
              </div>
            ) : (
              /* --- TAMPILAN TAMBAH --- */
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-800">Nama depan</label>
                    <Input 
                      placeholder="Masukkan nama depan" 
                      className="h-11"
                      value={form.firstName}
                      onChange={(e) => setForm({...form, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-800">Nama belakang</label>
                    <Input 
                      placeholder="Masukkan nama belakang" 
                      className="h-11"
                      value={form.lastName}
                      onChange={(e) => setForm({...form, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800">Nomor handphone</label>
                  <div className="flex gap-2">
                    <div className="w-20 h-11 bg-slate-100 rounded-md border flex items-center justify-center font-mono text-slate-500 text-sm">
                      62
                    </div>
                    <Input 
                      placeholder="Masukkan nomor handphone" 
                      className="flex-1 h-11" 
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Masukkan email" 
                      className="pl-10 h-11" 
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-slate-100">
                  <Button 
                    className="bg-primary font-bold h-12 px-8"
                    onClick={handleSave}
                  >
                    Simpan member
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold h-12 px-8"
                    onClick={() => setView('search')}
                  >
                    Kembali
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemberModal;