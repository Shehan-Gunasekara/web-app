//import internal from "stream";

export interface ItemOption {
  id: string;
  label: string;
  price: string;
  index_no?: number;
}

export interface ItemOptionGroup {
  type: string;
  label: string;
  description: string;
  text: string;
  option_id?: number;
}

export interface ItemOptionList {
  id?: number;
  type: string;
  title: string;
  label: string;
  description: string;
  choice_limit: number;
  index_no?: number;
  choices: ItemOption[];
}

export interface Item {
  id: number;
  restaurant_id?: number;
  name?: string;
  description?: string;
  img_urls?: string[];
  price?: number;
  is_active?: boolean;
  labels?: string[];
  custom_labels?: string[];
  action: (clickedItem: string, itemId: number) => any;
  clickedComponent: string;
  item_options: ItemOptionList[];
}
export interface OrderItemOptionDetails {
  id: number;
  item_id: number;
  item_option_id: number;
  choice_index: number;
}
export interface OrderDetail {
  id: number;
  item_id: number;
  quantity: number;
  orderItemOptionDetails: OrderItemOptionDetails[];
  order_item_options: OrderItemOptionDetails[]; //bad name but this one actually works, database is messy
}

export interface Order {
  id: number;
  table: {
    id: number;
    table_number: number;
  };
  customer: {
    id: number;
    name: string;
    index?: number;
  };
  order_no: number;
  status: string;
  orderStatusChange: string;
  isBumpedBack: boolean;
  items: Item[];
  orderDetails: OrderDetail[];
  is_bumped: boolean;
  amount: number;
  cancelled_reason: string;
  is_active: boolean;
  bounce_reset: boolean;
  date: string;
  tax: number;
}

export interface RequestList {
  created_at: Date;
  customer_name: string;
  id: number;
  message: string;
  restaurant_id: number;
  status: string;
  table_number: number;
}

export interface Handwave {
  table_number: number;
  data: RequestList[];
}

export interface HandwaveContent {
  allRequest: Handwave[];
  attendedRequest: Handwave[];
  newRequest: Handwave[];
}

export interface APINotification {
  id: number;
  table_id: number;
  sender_id: number;
  message: string; // JSON stringified object maybe
  created_at: Date;
  updated_at: Date;
}
