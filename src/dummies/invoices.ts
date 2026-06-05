import type { TInvoice } from "../lib/model";
import {products} from "./product";

export const mockInvoices: TInvoice[] = [
  {
    id: 92720,
    sales_no: "20260512/ZHPAN/00001",
    cashier_first_name: "Admin",
    cashier_last_name: "Zakiah",
    net_sales_after_tax: 22000,
    local_sales_at: "2026-05-12 20:41:32",
    invoice_number: "INV-20260512-00001",
    cashier_name: "Admin Zakiah",
    product_ids: [products[0].id, products[1].id, products[6].id], // ID produk yang terlibat dalam invoice
    total_items: 3,
    total_price: 22000,
    total_paid: 50000,
    total_return: 28000,
    created_at: "2026-05-12 20:41:32",
    items: [
      {
        product: products[0], // Bross Dagub Premium Silver
        quantity: 2,
        subtotal: 10000
      },
      {
        product: products[1], // Bross Hijab Mutiara Gold 5K
        quantity: 1,
        subtotal: 5000
      },
      {
        product: products[6], // Cermin Saku Kosmetik Mini
        quantity: 1,
        subtotal: 7500
      }
    ]
  },
  {
    id: 92721,
    net_sales_after_tax: 47000,
    local_sales_at: "2026-05-12 21:15:04",
    cashier_first_name: "Admin",
    cashier_last_name: "Zakiah",
    invoice_number: "INV-20260512-00002",
    cashier_name: "Admin Zakiah",
    product_ids: [products[2].id, products[4].id], // ID produk yang terlibat dalam invoice
    sales_no: "20260512/ZHPAN/00002",
    total_items: 2,
    total_price: 47000,
    total_paid: 47000,
    total_return: 0,
    created_at: "2026-05-12 21:15:04",
    items: [
      {
        product: products[2], // Jedai Bangkok 5cm Glossy
        quantity: 1,
        subtotal: 12000
      },
      {
        product: products[4], // Pashmina Ceruty Baby Doll Black
        quantity: 1,
        subtotal: 35000
      }
    ]
  },
  {
    id: 92722,
    net_sales_after_tax: 40000,
    local_sales_at: "2026-05-13 09:24:15",
    invoice_number: "INV-20260513-00001",
    cashier_name: "Balqis Sales",
    product_ids: [products[3].id, products[0].id], // ID produk yang terlibat dalam invoice
    sales_no: "20260513/ZHPAN/00001",
    cashier_first_name: "Balqis",
    cashier_last_name: "Sales",
    total_items: 4,
    total_price: 40000,
    total_paid: 100000,
    total_return: 60000,
    created_at: "2026-05-13 09:24:15",
    items: [
      {
        product: products[3], // Ikat Rambut Korea Dozen Pack
        quantity: 2,
        subtotal: 30000
      },
      {
        product: products[0], // Bross Dagub Premium Silver
        quantity: 2,
        subtotal: 10000
      }
    ]
  },
  {
    id: 92723,
    net_sales_after_tax: 25000,
    local_sales_at: "2026-05-13 14:02:11",
    invoice_number: "INV-20260513-00002",
    cashier_name: "Admin Zakiah",
    product_ids: [products[5].id], // ID produk yang terlibat dalam invoice
    sales_no: "20260513/ZHPAN/00002",
    cashier_first_name: "Admin",
    cashier_last_name: "Zakiah",
    total_items: 1,
    total_price: 25000,
    total_paid: 30000,
    total_return: 50000, // Simulasi salah ketik input kasir/pembayaran pas
    created_at: "2026-05-13 14:02:11",
    items: [
      {
        product: products[5], // Bella Square Hijab Segiempat Navy
        quantity: 1,
        subtotal: 25000
      }
    ]
  }
];