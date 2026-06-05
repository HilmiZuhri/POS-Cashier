export type TProduct = {
    id: number,
    name: string,
    code: string,
    image_url: string | null,
    sku: string,
    product_category_id: number,
    product_unit_id: number,
    sell_price: number,
    barcode: string,
    product_unit: {
        id: number,
        name: string
    },
    product_category: {
        id: number,
        name: string
    },
    product_location_stock: {
        product_id: number,
        stock: number,
        average_buy_price: number
    }
}

export type TInvoice = {
  id: number,
  sales_no: string,
  cashier_first_name: string,
  cashier_last_name: string,
  net_sales_after_tax: number,
  local_sales_at: string,
  invoice_number: string,
  cashier_name: string,
  total_items: number,
  total_price: number,
  total_paid: number,
  total_return: number,
  created_at: string,
  product_ids: number[], // Tambahan properti untuk menyimpan ID produk yang terlibat dalam invoice
  items: {
    product: TProduct,
    quantity: number,
    subtotal: number
  }[];
};