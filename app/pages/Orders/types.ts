export interface OrderItem {
  product?: {
    img_url?: string;
    title?: string;
    category?: {
      name?: string;
    };
    type?: string;
    price?: string;
  };
  quantity: number;
  total_price: string;
}

export interface Order {
  createdAt: string;
  address: string;
  phone: string;
  paymentMethod: string;
  note?: string;
}
