import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export type Database = {
  public: {
    Tables: {
      anime: {
        Row: {
          id: string;
          anime_id: string;
          title: string;
          japanese: string | null;
          poster: string | null;
          score: string | null;
          type: string | null;
          status: string | null;
          episodes: string | null;
          duration: string | null;
          aired: string | null;
          studios: string | null;
          producers: string | null;
          synopsis: string | null;
          release_day: string | null;
          latest_release_date: string | null;
          last_release_date: string | null;
          season: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['anime']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['anime']['Insert']>;
      };
      genres: {
        Row: {
          id: string;
          genre_id: string;
          title: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['genres']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['genres']['Insert']>;
      };
      episodes: {
        Row: {
          id: string;
          anime_id: string;
          episode_id: string;
          title: string;
          eps: number;
          release_time: string | null;
          default_streaming_url: string | null;
          has_prev_episode: boolean;
          has_next_episode: boolean;
          credit: string | null;
          encoder: string | null;
          duration: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['episodes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['episodes']['Insert']>;
      };
    };
  };
};
