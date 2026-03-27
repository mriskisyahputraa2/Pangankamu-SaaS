export interface OrderItem {
  id: string;
  product_id: string | null;
  product_name: string;
  price_base_snapshot: number;
  price_sell_snapshot: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus = "pending" | "paid" | "cancelled" | "expired";

export interface Order {
  id: string;
  store_id: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: OrderStatus;
  payment_method: string | null;
  payment_token: string | null;
  expires_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  order_items?: OrderItem[];
}

export interface OrderMeta {
  total_data: number;
  current_page: number;
  row_per_page: number;
  total_pages: number;
}
