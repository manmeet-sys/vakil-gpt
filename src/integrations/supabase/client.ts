
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://clyqfnqkicwvpymbqijn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNseXFmbnFraWN3dnB5bWJxaWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MDczODAsImV4cCI6MjA1OTM4MzM4MH0.CiGisrTRO87EcpytzoUUAnmpJKAkDyt-qx8oed2yQ5A";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

// Define temporary types for our custom tables until the types.ts is regenerated
export type MADueDiligence = {
  id: string;
  user_id: string;
  target_company: string;
  industry: string;
  financial_data: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
};

export type MARisk = {
  id: string;
  diligence_id: string;
  level: 'low' | 'medium' | 'high';
  description: string;
  created_at: string;
};

export type MARecommendation = {
  id: string;
  diligence_id: string;
  description: string;
  created_at: string;
};

export type MAApplicableLaw = {
  id: string;
  diligence_id: string;
  name: string;
  description: string;
  created_at: string;
};

// Define UserReview type
export type UserReviewTable = {
  id: string;
  user_id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count: number;
};

// Extra type safety for our tables
export type Tables = Database['public']['Tables'] & {
  ma_due_diligence: {
    Row: MADueDiligence;
    Insert: Omit<MADueDiligence, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<MADueDiligence, 'id' | 'created_at' | 'updated_at'>>;
    Relationships: [];
  };
  ma_risks: {
    Row: MARisk;
    Insert: Omit<MARisk, 'id' | 'created_at'>;
    Update: Partial<Omit<MARisk, 'id' | 'created_at'>>;
    Relationships: [
      {
        foreignKeyName: "ma_risks_diligence_id_fkey";
        columns: ["diligence_id"];
        isOneToOne: false;
        referencedRelation: "ma_due_diligence";
        referencedColumns: ["id"];
      }
    ];
  };
  ma_recommendations: {
    Row: MARecommendation;
    Insert: Omit<MARecommendation, 'id' | 'created_at'>;
    Update: Partial<Omit<MARecommendation, 'id' | 'created_at'>>;
    Relationships: [
      {
        foreignKeyName: "ma_recommendations_diligence_id_fkey";
        columns: ["diligence_id"];
        isOneToOne: false;
        referencedRelation: "ma_due_diligence";
        referencedColumns: ["id"];
      }
    ];
  };
  ma_applicable_laws: {
    Row: MAApplicableLaw;
    Insert: Omit<MAApplicableLaw, 'id' | 'created_at'>;
    Update: Partial<Omit<MAApplicableLaw, 'id' | 'created_at'>>;
    Relationships: [
      {
        foreignKeyName: "ma_applicable_laws_diligence_id_fkey";
        columns: ["diligence_id"];
        isOneToOne: false;
        referencedRelation: "ma_due_diligence";
        referencedColumns: ["id"];
      }
    ];
  };
  user_reviews: {
    Row: UserReviewTable;
    Insert: Omit<UserReviewTable, 'id' | 'created_at' | 'helpful_count'>;
    Update: Partial<Omit<UserReviewTable, 'id' | 'created_at'>>;
    Relationships: [
      {
        foreignKeyName: "user_reviews_user_id_fkey";
        columns: ["user_id"];
        isOneToOne: false;
        referencedRelation: "users";
        referencedColumns: ["id"];
      }
    ];
  };
};

// Type-safe helper functions
export const fromMA = {
  dueDiligence() {
    return supabase.from('ma_due_diligence');
  },
  risks() {
    return supabase.from('ma_risks');
  },
  recommendations() {
    return supabase.from('ma_recommendations');
  },
  applicableLaws() {
    return supabase.from('ma_applicable_laws');
  }
};

// Helper function for user reviews
export const fromUserReviews = {
  reviews() {
    return supabase.from('user_reviews');
  }
};
