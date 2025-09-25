export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      case_status_updates: {
        Row: {
          case_id: string
          case_title: string
          client_id: string
          created_at: string | null
          id: string
          is_read: boolean
          message: string
          status: string
        }
        Insert: {
          case_id: string
          case_title: string
          client_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          status: string
        }
        Update: {
          case_id?: string
          case_title?: string
          client_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_status_updates_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "court_filings"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          context_summary: string | null
          created_at: string
          id: string
          title: string | null
          topic_keywords: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context_summary?: string | null
          created_at?: string
          id?: string
          title?: string | null
          topic_keywords?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context_summary?: string | null
          created_at?: string
          id?: string
          title?: string | null
          topic_keywords?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          legal_context: Json | null
          role: string
          tokens_used: number | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          legal_context?: Json | null
          role: string
          tokens_used?: number | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          legal_context?: Json | null
          role?: string
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chunks: {
        Row: {
          content: string
          court_level: string | null
          date: string | null
          doc_id: string | null
          embedding: string | null
          holding_direction: string | null
          id: string
          inserted_at: string | null
          is_primary: boolean | null
          posture: string | null
          provisions: string[] | null
          seq: number | null
          token_count: number | null
          tsv: unknown | null
        }
        Insert: {
          content: string
          court_level?: string | null
          date?: string | null
          doc_id?: string | null
          embedding?: string | null
          holding_direction?: string | null
          id?: string
          inserted_at?: string | null
          is_primary?: boolean | null
          posture?: string | null
          provisions?: string[] | null
          seq?: number | null
          token_count?: number | null
          tsv?: unknown | null
        }
        Update: {
          content?: string
          court_level?: string | null
          date?: string | null
          doc_id?: string | null
          embedding?: string | null
          holding_direction?: string | null
          id?: string
          inserted_at?: string | null
          is_primary?: boolean | null
          posture?: string | null
          provisions?: string[] | null
          seq?: number | null
          token_count?: number | null
          tsv?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "chunks_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      citations: {
        Row: {
          answer_id: string | null
          chat_id: string | null
          chunk_id: string | null
          created_at: string | null
          doc_id: string | null
          id: string
          score: number | null
        }
        Insert: {
          answer_id?: string | null
          chat_id?: string | null
          chunk_id?: string | null
          created_at?: string | null
          doc_id?: string | null
          id?: string
          score?: number | null
        }
        Update: {
          answer_id?: string | null
          chat_id?: string | null
          chunk_id?: string | null
          created_at?: string | null
          doc_id?: string | null
          id?: string
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "citations_chunk_id_fkey"
            columns: ["chunk_id"]
            isOneToOne: false
            referencedRelation: "chunks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citations_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      client_documents: {
        Row: {
          case_id: string | null
          client_id: string
          created_at: string | null
          id: string
          name: string
          notes: string | null
          path: string
          size: number
          status: string
          type: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          case_id?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          path: string
          size: number
          status?: string
          type: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          case_id?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          path?: string
          size?: number
          status?: string
          type?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "court_filings"
            referencedColumns: ["id"]
          },
        ]
      }
      client_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
          sender_name: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
          sender_name: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
          sender_name?: string
        }
        Relationships: []
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
          client_id: string | null
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
          client_id?: string | null
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
          client_id?: string | null
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
      documents: {
        Row: {
          court_level: string | null
          date: string | null
          id: string
          inserted_at: string | null
          is_primary: boolean | null
          jurisdiction: string | null
          posture: string | null
          provisions: string[] | null
          source_url: string | null
          title: string
        }
        Insert: {
          court_level?: string | null
          date?: string | null
          id?: string
          inserted_at?: string | null
          is_primary?: boolean | null
          jurisdiction?: string | null
          posture?: string | null
          provisions?: string[] | null
          source_url?: string | null
          title: string
        }
        Update: {
          court_level?: string | null
          date?: string | null
          id?: string
          inserted_at?: string | null
          is_primary?: boolean | null
          jurisdiction?: string | null
          posture?: string | null
          provisions?: string[] | null
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      evals: {
        Row: {
          created_at: string | null
          id: string
          input: Json | null
          name: string | null
          notes: string | null
          output: Json | null
          score: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          input?: Json | null
          name?: string | null
          notes?: string | null
          output?: Json | null
          score?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          input?: Json | null
          name?: string | null
          notes?: string | null
          output?: Json | null
          score?: number | null
        }
        Relationships: []
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
          encryption_key: string | null
          enrollment_date: string | null
          full_name: string | null
          id: string
          jurisdiction: string | null
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bar_number?: string | null
          encryption_key?: string | null
          enrollment_date?: string | null
          full_name?: string | null
          id: string
          jurisdiction?: string | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bar_number?: string | null
          encryption_key?: string | null
          enrollment_date?: string | null
          full_name?: string | null
          id?: string
          jurisdiction?: string | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          id: number
          monthly_credits: number
          plan_name: string
          price_in_inr: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          monthly_credits: number
          plan_name: string
          price_in_inr: number
        }
        Update: {
          created_at?: string | null
          id?: number
          monthly_credits?: number
          plan_name?: string
          price_in_inr?: number
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string | null
          complexity: string | null
          content: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          jurisdiction: string[] | null
          metadata: Json | null
          placeholders: Json | null
          subcategory: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          complexity?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          jurisdiction?: string[] | null
          metadata?: Json | null
          placeholders?: Json | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          complexity?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          jurisdiction?: string[] | null
          metadata?: Json | null
          placeholders?: Json | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          action_type: string | null
          balance_after: number
          created_at: string | null
          credits_used: number
          id: string
          user_id: string | null
        }
        Insert: {
          action_type?: string | null
          balance_after: number
          created_at?: string | null
          credits_used: number
          id?: string
          user_id?: string | null
        }
        Update: {
          action_type?: string | null
          balance_after?: number
          created_at?: string | null
          credits_used?: number
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_reviews: {
        Row: {
          comment: string
          created_at: string
          helpful_count: number
          id: string
          name: string
          rating: number
          role: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          helpful_count?: number
          id?: string
          name: string
          rating: number
          role: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          helpful_count?: number
          id?: string
          name?: string
          rating?: number
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          current_credits: number
          id: string
          last_updated: string | null
          user_id: string | null
        }
        Insert: {
          current_credits?: number
          id?: string
          last_updated?: string | null
          user_id?: string | null
        }
        Update: {
          current_credits?: number
          id?: string
          last_updated?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: {
        Args: { p_amount: number; p_source: string; p_user_id: string }
        Returns: undefined
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      deduct_credits: {
        Args: { p_action_type: string; p_cost: number; p_user_id: string }
        Returns: undefined
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      search_chunks_ts: {
        Args: { match_limit?: number; q: string }
        Returns: {
          content: string
          court_level: string | null
          date: string | null
          doc_id: string | null
          embedding: string | null
          holding_direction: string | null
          id: string
          inserted_at: string | null
          is_primary: boolean | null
          posture: string | null
          provisions: string[] | null
          seq: number | null
          token_count: number | null
          tsv: unknown | null
        }[]
      }
      search_chunks_vec: {
        Args: { match_count?: number; query_vec: string }
        Returns: {
          content: string
          court_level: string
          date: string
          doc_id: string
          embedding: string
          holding_direction: string
          id: string
          is_primary: boolean
          posture: string
          provisions: string[]
          seq: number
          similarity: number
          token_count: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
