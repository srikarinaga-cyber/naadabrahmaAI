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
      janyas: {
        Row: {
          id: string;
          name: string;
          parent_melakarta_id: string | null;
          arohana: string;
          avarohana: string;
          description: string | null;
          embedding: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          parent_melakarta_id?: string | null;
          arohana: string;
          avarohana: string;
          description?: string | null;
          embedding?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          parent_melakarta_id?: string | null;
          arohana?: string;
          avarohana?: string;
          description?: string | null;
          embedding?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      composers: {
        Row: {
          id: string;
          name: string;
          period: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          period?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          period?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      talas: {
        Row: {
          id: string;
          name: string;
          beats: number | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          beats?: number | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          beats?: number | null;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      kritis: {
        Row: {
          id: string;
          title: string;
          melakarta_id: string | null;
          janya_id: string | null;
          composer_id: string | null;
          tala: string | null;
          language: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          melakarta_id?: string | null;
          janya_id?: string | null;
          composer_id?: string | null;
          tala?: string | null;
          language?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          melakarta_id?: string | null;
          janya_id?: string | null;
          composer_id?: string | null;
          tala?: string | null;
          language?: string | null;
          description?: string | null;
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
      ai_notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          source_raga_id: string | null;
          source_kriti_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          source_raga_id?: string | null;
          source_kriti_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          source_raga_id?: string | null;
          source_kriti_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_bookmarks: {
        Row: {
          id: string;
          user_id: string;
          entity_type: string;
          entity_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entity_type: string;
          entity_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          entity_type?: string;
          entity_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      practice_sessions: {
        Row: {
          id: string;
          user_id: string;
          shruti: string;
          instrument: string;
          duration_seconds: number;
          pitch_summary: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          shruti?: string;
          instrument?: string;
          duration_seconds?: number;
          pitch_summary?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          shruti?: string;
          instrument?: string;
          duration_seconds?: number;
          pitch_summary?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      exam_questions: {
        Row: {
          id: string;
          type: string;
          level: string;
          question_text: string;
          options: Json;
          correct_answer: string;
          explanation: string | null;
          raga_id: string | null;
          composer_id: string | null;
          kriti_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type?: string;
          level?: string;
          question_text: string;
          options: Json;
          correct_answer: string;
          explanation?: string | null;
          raga_id?: string | null;
          composer_id?: string | null;
          kriti_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          level?: string;
          question_text?: string;
          options?: Json;
          correct_answer?: string;
          explanation?: string | null;
          raga_id?: string | null;
          composer_id?: string | null;
          kriti_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          entity_type: string;
          entity_id: string;
          status: string;
          score: number | null;
          last_studied_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entity_type: string;
          entity_id: string;
          status?: string;
          score?: number | null;
          last_studied_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          entity_type?: string;
          entity_id?: string;
          status?: string;
          score?: number | null;
          last_studied_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      study_streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_activity_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      teacher_classes: {
        Row: {
          id: string;
          teacher_id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      assignments: {
        Row: {
          id: string;
          class_id: string;
          title: string;
          description: string | null;
          pdf_attachment_url: string | null;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          title: string;
          description?: string | null;
          pdf_attachment_url?: string | null;
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          title?: string;
          description?: string | null;
          pdf_attachment_url?: string | null;
          due_date?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      syllabus_knowledge: {
        Row: {
          id: string;
          title: string;
          section: string;
          content: string;
          page_number: number | null;
          source_file: string;
          language: string | null;
          embedding: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          section: string;
          content: string;
          page_number?: number | null;
          source_file: string;
          language?: string | null;
          embedding?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          section?: string;
          content?: string;
          page_number?: number | null;
          source_file?: string;
          language?: string | null;
          embedding?: string | null;
          created_at?: string;
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
