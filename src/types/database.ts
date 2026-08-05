export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole =
  | "student"
  | "teacher"
  | "academy_admin"
  | "platform_admin";

export interface Database {
  public: {
    Tables: {
      platform_features: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string;
          tag: string;
          href: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          icon: string;
          tag: string;
          href?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          icon?: string;
          tag?: string;
          href?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      platform_statistics: {
        Row: {
          id: string;
          label: string;
          value: string;
          suffix: string | null;
          icon: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          label: string;
          value: string;
          suffix?: string | null;
          icon: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          value?: string;
          suffix?: string | null;
          icon?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          quote: string;
          author_name: string;
          author_role: string;
          author_institution: string | null;
          instrument: string | null;
          rating: number;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          quote: string;
          author_name: string;
          author_role: string;
          author_institution?: string | null;
          instrument?: string | null;
          rating?: number;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          quote?: string;
          author_name?: string;
          author_role?: string;
          author_institution?: string | null;
          instrument?: string | null;
          rating?: number;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      melakartas: {
        Row: {
          id: string;
          number: number;
          name: string;
          chakra: string;
          arohana: string;
          avarohana: string;
          swara_frequencies: Json | null;
          description: string | null;
          metadata: Json | null;
          embedding: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          number: number;
          name: string;
          chakra: string;
          arohana: string;
          avarohana: string;
          swara_frequencies?: Json | null;
          description?: string | null;
          metadata?: Json | null;
          embedding?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          number?: number;
          name?: string;
          chakra?: string;
          arohana?: string;
          avarohana?: string;
          swara_frequencies?: Json | null;
          description?: string | null;
          metadata?: Json | null;
          embedding?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          role: UserRole;
          institution_id: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role?: UserRole;
          institution_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: UserRole;
          institution_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type PlatformFeature =
  Database["public"]["Tables"]["platform_features"]["Row"];
export type PlatformStatistic =
  Database["public"]["Tables"]["platform_statistics"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type Melakarta = Database["public"]["Tables"]["melakartas"]["Row"];

export interface MelakartaMetadata {
  western_equivalent?: string;
  time_of_day?: string;
  mood?: string;
  popular_janyas?: string[];
}

export interface LandingPageData {
  features: PlatformFeature[];
  statistics: PlatformStatistic[];
  testimonials: Testimonial[];
  featuredRaga: Melakarta | null;
}
