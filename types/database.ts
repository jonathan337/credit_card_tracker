export interface Card {
  id: string
  user_id: string
  card_number: string
  cardholder_name: string
  due_date: string
  ttd_limit: number
  usd_limit: number
  cycle_date: number
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  card_id: string
  amount: number
  date: string
  description: string
  type: 'purchase' | 'payment'
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      cards: {
        Row: Card
        Insert: Omit<Card, 'id' | 'created_at'>
        Update: Partial<Omit<Card, 'id' | 'created_at'>>
      }
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, 'id' | 'created_at'>
        Update: Partial<Omit<Transaction, 'id' | 'created_at'>>
      }
    }
  }
}

