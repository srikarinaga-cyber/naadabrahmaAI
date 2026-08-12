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
      syllabus_knowledge: {
        Row: {
          id: string;
          title: string | null;
          section: string | null;
          content: string;
          source_file: string;
          page_number: number;
          chunk_index: number;
          language: string;
          embedding: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          section?: string | null;
          content: string;
          source_file: string;
          page_number: number;
          chunk_index?: number;
          language?: string;
          embedding?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string | null;
          section?: string | null;
          content?: string;
          source_file?: string;
          page_number?: number;
          chunk_index?: number;
          language?: string;
          embedding?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      janyas: {
        Row: {
          id: string;
          name: string;
          parent_melakarta_id: string;
          arohana: string;
          avarohana: string;
          vakra: boolean;
          bhashanga: boolean;
          upanga: boolean;
          description: string | null;
          metadata: Json | null;
          embedding: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          parent_melakarta_id: string;
          arohana: string;
          avarohana: string;
          vakra?: boolean;
          bhashanga?: boolean;
          upanga?: boolean;
          description?: string | null;
          metadata?: Json | null;
          embedding?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          parent_melakarta_id?: string;
          arohana?: string;
          avarohana?: string;
          vakra?: boolean;
          bhashanga?: boolean;
          upanga?: boolean;
          description?: string | null;
          metadata?: Json | null;
          embedding?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      composers: {
        Row: {
          id: string;
          name: string;
          era: string | null;
          biography: string | null;
          mudra: string | null;
          famous_compositions: string[] | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          era?: string | null;
          biography?: string | null;
          mudra?: string | null;
          famous_compositions?: string[] | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          era?: string | null;
          biography?: string | null;
          mudra?: string | null;
          famous_compositions?: string[] | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      talas: {
        Row: {
          id: string;
          name: string;
          beats: number;
          angas: string;
          aksharas: number | null;
          structure: string | null;
          description: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          beats: number;
          angas: string;
          aksharas?: number | null;
          structure?: string | null;
          description?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          beats?: number;
          angas?: string;
          aksharas?: number | null;
          structure?: string | null;
          description?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      kritis: {
        Row: {
          id: string;
          title: string;
          composer_id: string | null;
          melakarta_id: string | null;
          janya_id: string | null;
          tala_id: string | null;
          notation: string | null;
          lyrics: string | null;
          translation: string | null;
          audio_reference_url: string | null;
          difficulty_level: string;
          metadata: Json | null;
          embedding: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          composer_id?: string | null;
          melakarta_id?: string | null;
          janya_id?: string | null;
          tala_id?: string | null;
          notation?: string | null;
          lyrics?: string | null;
          translation?: string | null;
          audio_reference_url?: string | null;
          difficulty_level?: string;
          metadata?: Json | null;
          embedding?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          composer_id?: string | null;
          melakarta_id?: string | null;
          janya_id?: string | null;
          tala_id?: string | null;
          notation?: string | null;
          lyrics?: string | null;
          translation?: string | null;
          audio_reference_url?: string | null;
          difficulty_level?: string;
          metadata?: Json | null;
          embedding?: string | null;
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
          options: Json | null;
          correct_answer: string;
          explanation: string | null;
          raga_id: string | null;
          composer_id: string | null;
          kriti_id: string | null;
          embedding: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          level: string;
          question_text: string;
          options?: Json | null;
          correct_answer: string;
          explanation?: string | null;
          raga_id?: string | null;
          composer_id?: string | null;
          kriti_id?: string | null;
          embedding?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          level?: string;
          question_text?: string;
          options?: Json | null;
          correct_answer?: string;
          explanation?: string | null;
          raga_id?: string | null;
          composer_id?: string | null;
          kriti_id?: string | null;
          embedding?: string | null;
          created_at?: string;
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
          embedding: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          source_raga_id?: string | null;
          source_kriti_id?: string | null;
          embedding?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          source_raga_id?: string | null;
          source_kriti_id?: string | null;
          embedding?: string | null;
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
          topics_completed: string[] | null;
          quiz_score: number | null;
          daily_streak: number;
          badges: string[] | null;
          last_studied_at: string;
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
          topics_completed?: string[] | null;
          quiz_score?: number | null;
          daily_streak?: number;
          badges?: string[] | null;
          last_studied_at?: string;
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
          topics_completed?: string[] | null;
          quiz_score?: number | null;
          daily_streak?: number;
          badges?: string[] | null;
          last_studied_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      study_streaks: {
        Row: {
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_activity_date: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string;
          created_at?: string;
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
          due_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          title: string;
          description?: string | null;
          pdf_attachment_url?: string | null;
          due_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          title?: string;
          description?: string | null;
          pdf_attachment_url?: string | null;
          due_date?: string;
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
      class_enrollments: {
        Row: {
          id: string;
          class_id: string;
          student_id: string;
          enrolled_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          student_id: string;
          enrolled_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          student_id?: string;
          enrolled_at?: string;
        };
        Relationships: [];
      };
      ragas: {
        Row: {
          id: string;
          name: string;
          melakarta_number: number | null;
          arohanam: string;
          avarohanam: string;
          swaras: string | null;
          parent_melakarta: string | null;
          rasa: string | null;
          time: string | null;
          famous_kritis: string[] | null;
          audio_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          melakarta_number?: number | null;
          arohanam: string;
          avarohanam: string;
          swaras?: string | null;
          parent_melakarta?: string | null;
          rasa?: string | null;
          time?: string | null;
          famous_kritis?: string[] | null;
          audio_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          melakarta_number?: number | null;
          arohanam?: string;
          avarohanam?: string;
          swaras?: string | null;
          parent_melakarta?: string | null;
          rasa?: string | null;
          time?: string | null;
          famous_kritis?: string[] | null;
          audio_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      quizzes: {
        Row: {
          id: string;
          question: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_answer: string;
          difficulty: string | null;
          topic: string | null;
          explanation: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_answer: string;
          difficulty?: string | null;
          topic?: string | null;
          explanation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          option_a?: string;
          option_b?: string;
          option_c?: string;
          option_d?: string;
          correct_answer?: string;
          difficulty?: string | null;
          topic?: string | null;
          explanation?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_chat_history: {
        Row: {
          id: string;
          user_id: string;
          user_message: string;
          ai_response: string;
          language: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_message: string;
          ai_response: string;
          language?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_message?: string;
          ai_response?: string;
          language?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_syllabus_knowledge: {
        Args: {
          query_embedding: number[];
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          title: string | null;
          section: string | null;
          content: string;
          source_file: string;
          page_number: number;
          language: string;
          similarity: number;
        }[];
      };
    };
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
export type SyllabusKnowledge = Database["public"]["Tables"]["syllabus_knowledge"]["Row"];

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
