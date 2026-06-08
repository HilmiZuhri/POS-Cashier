import { useEffect, useState } from 'react';
import { Users, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from 'axios';

interface SalesMember {
  id: number;
  first_name: string;
  last_name: string;
}

interface SalesModalProps {
  selectedSales: string | null;
  onSelect: (name: string, id: number) => void;
}

const SalesModal = ({ selectedSales, onSelect }: SalesModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<SalesMember[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch API
  useEffect(() => {
    if (isOpen) {
      const fetchEmployees = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('access_token');
          const response = await axios.get("https://backend-dev.secacastore.com/api/kasir/employees", {
            params: {
              limit: 100,
              loc_id: 5
            },
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'x-employee-code': 'admin-zakiah',
              'x-device-code': '8ee32711-54e4-4e45-b189-53e8b77a10db'
            }
          });
          const result = response.data;
          setEmployees(result.data || []);
        } catch (err) {
          console.error("Failed fetching sales data:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchEmployees();
    }
  }, [isOpen]);

  // Data Filter
  const filteredSales = employees.filter(s => {
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
   <DialogTrigger asChild>
      <Button 
         variant="outline" 
         className="bg-white border-primary text-primary hover:bg-primary/5 font-bold text-xs h-10 gap-2"
         >
         <Users size={16} />
         {selectedSales || "Sales"}
      </Button>
   </DialogTrigger>
   <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
         <DialogTitle className="font-black italic uppercase tracking-tighter text-2xl">
            Pilih Sales
         </DialogTitle>
      </DialogHeader>
      <div className="relative my-4">
         <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
         <Input 
            placeholder="Cari nama sales..." 
            className="pl-10 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
         />
      </div>
      <div className="max-h-[300px] overflow-y-auto space-y-1 pr-2">
      {loading ? (
      <div className="space-y-2 p-2">
         {[...Array(5)].map((_, i) => (
         <div key={i} className="h-10 bg-slate-100 animate-pulse rounded-lg" />
            ))}
         </div>
         ) : filteredSales.length > 0 ? (
         filteredSales.map((sales) => {
         const fullName = `${sales.first_name} ${sales.last_name}`;
         return (
         <Button
            key={sales.id}
            variant="ghost"
            onClick={() =>
            {
            onSelect(fullName, sales.id);
            setIsOpen(false);
            setSearch(""); 
            }}
            className="w-full justify-between text-left p-3 rounded-lg hover:bg-slate-100 font-bold text-slate-700 transition-colors group"
            >
            <span className="truncate">{fullName}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-primary transition-all" />
         </Button>
         );
         })
         ) : (
         <p className="text-center text-slate-400 py-10 text-sm italic">
            {search ? "Sales tidak ditemukan" : "Tidak ada data sales di lokasi ini"}
         </p>
         )}
      </div>
   </DialogContent>
</Dialog>
  );
};

export default SalesModal;