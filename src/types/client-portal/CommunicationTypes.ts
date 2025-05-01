
export interface StatusUpdate {
  id: string;
  client_id: string;
  case_id: string;
  case_title: string;
  status: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ClientMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  receiver_id: string;
  is_read: boolean;
  created_at: string;
}
