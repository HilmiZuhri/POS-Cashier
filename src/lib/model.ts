export type TProduct = {
    id: number,
    name: string,
    code: string,
    image_url: string | null,
    sku: string,
    product_category_id: number,
    product_unit_id: number,
    brand_id: number,
    customer_order_detail_id: number,
    catalogue_detail_id: number,
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
  invoice_number: string,
  cashier_name: string,
  total_items: number,
  total_price: number,
  total_paid: number,
  total_return: number,
  created_at: string,
  items: {
    product: TProduct,
    quantity: number,
    subtotal: number
  }[];
};