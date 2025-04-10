export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_name: string
          id: string
          ip_address: string | null
          page_path: string
          referrer: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_name: string
          id?: string
          ip_address?: string | null
          page_path: string
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_name?: string
          id?: string
          ip_address?: string | null
          page_path?: string
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      billing_entries: {
        Row: {
          activity_type: string
          amount: number | null
          case_id: string | null
          client_name: string | null
          created_at: string | null
          date: string | null
          description: string | null
          hourly_rate: number | null
          hours_spent: number
          id: string
          invoice_number: string | null
          invoice_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          amount?: number | null
          case_id?: string | null
          client_name?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          hourly_rate?: number | null
          hours_spent: number
          id?: string
          invoice_number?: string | null
          invoice_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          amount?: number | null
          case_id?: string | null
          client_name?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          hourly_rate?: number | null
          hours_spent?: number
          id?: string
          invoice_number?: string | null
          invoice_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_entries_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "court_filings"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      court_filings: {
        Row: {
          case_number: string | null
          case_title: string | null
          client_name: string | null
          court_name: string | null
          court_type: string | null
          created_at: string | null
          description: string | null
          documents: Json | null
          filing_date: string | null
          filing_deadline: string | null
          filing_notes: string | null
          filing_type: string | null
          hearing_date: string | null
          id: string
          jurisdiction: string | null
          opposing_party: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          case_number?: string | null
          case_title?: string | null
          client_name?: string | null
          court_name?: string | null
          court_type?: string | null
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          filing_date?: string | null
          filing_deadline?: string | null
          filing_notes?: string | null
          filing_type?: string | null
          hearing_date?: string | null
          id?: string
          jurisdiction?: string | null
          opposing_party?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          case_number?: string | null
          case_title?: string | null
          client_name?: string | null
          court_name?: string | null
          court_type?: string | null
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          filing_date?: string | null
          filing_deadline?: string | null
          filing_notes?: string | null
          filing_type?: string | null
          hearing_date?: string | null
          id?: string
          jurisdiction?: string | null
          opposing_party?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      deadlines: {
        Row: {
          case_id: string | null
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          priority: string | null
          reminder_date: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          priority?: string | null
          reminder_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          priority?: string | null
          reminder_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deadlines_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "court_filings"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number | null
          client_id: string | null
          created_at: string | null
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string | null
          matter_id: string | null
          notes: string | null
          paid_date: string | null
          status: string | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string | null
          matter_id?: string | null
          notes?: string | null
          paid_date?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string | null
          matter_id?: string | null
          notes?: string | null
          paid_date?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_matter_id_fkey"
            columns: ["matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["id"]
          },
        ]
      }
      ma_applicable_laws: {
        Row: {
          created_at: string
          description: string
          diligence_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          diligence_id: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          diligence_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ma_applicable_laws_diligence_id_fkey"
            columns: ["diligence_id"]
            isOneToOne: false
            referencedRelation: "ma_due_diligence"
            referencedColumns: ["id"]
          },
        ]
      }
      ma_due_diligence: {
        Row: {
          created_at: string
          financial_data: string
          id: string
          industry: string
          summary: string | null
          target_company: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          financial_data: string
          id?: string
          industry: string
          summary?: string | null
          target_company: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          financial_data?: string
          id?: string
          industry?: string
          summary?: string | null
          target_company?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ma_recommendations: {
        Row: {
          created_at: string
          description: string
          diligence_id: string
          id: string
        }
        Insert: {
          created_at?: string
          description: string
          diligence_id: string
          id?: string
        }
        Update: {
          created_at?: string
          description?: string
          diligence_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ma_recommendations_diligence_id_fkey"
            columns: ["diligence_id"]
            isOneToOne: false
            referencedRelation: "ma_due_diligence"
            referencedColumns: ["id"]
          },
        ]
      }
      ma_risks: {
        Row: {
          created_at: string
          description: string
          diligence_id: string
          id: string
          level: string
        }
        Insert: {
          created_at?: string
          description: string
          diligence_id: string
          id?: string
          level: string
        }
        Update: {
          created_at?: string
          description?: string
          diligence_id?: string
          id?: string
          level?: string
        }
        Relationships: [
          {
            foreignKeyName: "ma_risks_diligence_id_fkey"
            columns: ["diligence_id"]
            isOneToOne: false
            referencedRelation: "ma_due_diligence"
            referencedColumns: ["id"]
          },
        ]
      }
      matters: {
        Row: {
          client_id: string | null
          closed_date: string | null
          created_at: string | null
          description: string | null
          id: string
          matter_number: string | null
          opened_date: string | null
          practice_area: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          client_id?: string | null
          closed_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          matter_number?: string | null
          opened_date?: string | null
          practice_area?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          client_id?: string | null
          closed_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          matter_number?: string | null
          opened_date?: string | null
          practice_area?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matters_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bar_number: string | null
          enrollment_date: string | null
          full_name: string | null
          id: string
          jurisdiction: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bar_number?: string | null
          enrollment_date?: string | null
          full_name?: string | null
          id: string
          jurisdiction?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bar_number?: string | null
          enrollment_date?: string | null
          full_name?: string | null
          id?: string
          jurisdiction?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
