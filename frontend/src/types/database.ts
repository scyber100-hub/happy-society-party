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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          is_deleted: boolean | null
          like_count: number | null
          parent_id: string | null
          post_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          like_count?: number | null
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          like_count?: number | null
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      committees: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      communities: {
        Row: {
          committee_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          member_count: number | null
          name: string
          post_count: number | null
          region_id: string | null
          type: Database["public"]["Enums"]["community_type"]
          updated_at: string | null
        }
        Insert: {
          committee_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          member_count?: number | null
          name: string
          post_count?: number | null
          region_id?: string | null
          type: Database["public"]["Enums"]["community_type"]
          updated_at?: string | null
        }
        Update: {
          committee_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          member_count?: number | null
          name?: string
          post_count?: number | null
          region_id?: string | null
          type?: Database["public"]["Enums"]["community_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communities_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communities_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          paid_at: string | null
          payment_type: Database["public"]["Enums"]["payment_type"]
          period_end: string | null
          period_start: string | null
          pg_provider: string | null
          pg_transaction_id: string | null
          receipt_url: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          payment_type: Database["public"]["Enums"]["payment_type"]
          period_end?: string | null
          period_start?: string | null
          pg_provider?: string | null
          pg_transaction_id?: string | null
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          payment_type?: Database["public"]["Enums"]["payment_type"]
          period_end?: string | null
          period_start?: string | null
          pg_provider?: string | null
          pg_transaction_id?: string | null
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          comment_count: number | null
          community_id: string | null
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          is_published: boolean | null
          like_count: number | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          comment_count?: number | null
          community_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          is_published?: boolean | null
          like_count?: number | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          comment_count?: number | null
          community_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          is_published?: boolean | null
          like_count?: number | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          created_at: string | null
          id: string
          level: number
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level?: number
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "regions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          admin_note: string | null
          created_at: string | null
          description: string | null
          id: string
          reason: string
          reporter_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["report_status"] | null
          target_comment_id: string | null
          target_post_id: string | null
          target_type: Database["public"]["Enums"]["report_target_type"]
          target_user_id: string | null
        }
        Insert: {
          admin_note?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          reason: string
          reporter_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          target_comment_id?: string | null
          target_post_id?: string | null
          target_type: Database["public"]["Enums"]["report_target_type"]
          target_user_id?: string | null
        }
        Update: {
          admin_note?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string
          reporter_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          target_comment_id?: string | null
          target_post_id?: string | null
          target_type?: Database["public"]["Enums"]["report_target_type"]
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_target_comment_id_fkey"
            columns: ["target_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_target_post_id_fkey"
            columns: ["target_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_committees: {
        Row: {
          committee_id: string | null
          id: string
          joined_at: string | null
          user_id: string | null
        }
        Insert: {
          committee_id?: string | null
          id?: string
          joined_at?: string | null
          user_id?: string | null
        }
        Update: {
          committee_id?: string | null
          id?: string
          joined_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_committees_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_committees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_communities: {
        Row: {
          community_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          community_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          community_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_communities_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_communities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          district: string | null
          email_verified: boolean | null
          id: string
          is_party_member: boolean | null
          name: string
          party_member_since: string | null
          phone: string | null
          phone_verified: boolean | null
          region_id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          activity_score: number | null
          regional_activity_score: number | null
          committee_activity_score: number | null
          last_activity_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          district?: string | null
          email_verified?: boolean | null
          id: string
          is_party_member?: boolean | null
          name: string
          party_member_since?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          region_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          activity_score?: number | null
          regional_activity_score?: number | null
          committee_activity_score?: number | null
          last_activity_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          district?: string | null
          email_verified?: boolean | null
          id?: string
          is_party_member?: boolean | null
          name?: string
          party_member_since?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          region_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          activity_score?: number | null
          regional_activity_score?: number | null
          committee_activity_score?: number | null
          last_activity_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      activities: {
        Row: {
          id: string
          user_id: string
          activity_type: Database["public"]["Enums"]["activity_type"]
          points: number
          scope: Database["public"]["Enums"]["activity_scope"]
          scope_id: string | null
          reference_type: string | null
          reference_id: string | null
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: Database["public"]["Enums"]["activity_type"]
          points?: number
          scope?: Database["public"]["Enums"]["activity_scope"]
          scope_id?: string | null
          reference_type?: string | null
          reference_id?: string | null
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: Database["public"]["Enums"]["activity_type"]
          points?: number
          scope?: Database["public"]["Enums"]["activity_scope"]
          scope_id?: string | null
          reference_type?: string | null
          reference_id?: string | null
          description?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          id: string
          title: string
          description: string | null
          vote_type: Database["public"]["Enums"]["vote_type"]
          scope: Database["public"]["Enums"]["vote_scope"]
          scope_id: string | null
          options: Json
          allow_multiple: boolean | null
          max_selections: number | null
          start_date: string
          end_date: string
          deliberation_start: string | null
          min_participation: number | null
          status: Database["public"]["Enums"]["vote_status"] | null
          result: Json | null
          total_votes: number | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          vote_type: Database["public"]["Enums"]["vote_type"]
          scope?: Database["public"]["Enums"]["vote_scope"]
          scope_id?: string | null
          options?: Json
          allow_multiple?: boolean | null
          max_selections?: number | null
          start_date: string
          end_date: string
          deliberation_start?: string | null
          min_participation?: number | null
          status?: Database["public"]["Enums"]["vote_status"] | null
          result?: Json | null
          total_votes?: number | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          vote_type?: Database["public"]["Enums"]["vote_type"]
          scope?: Database["public"]["Enums"]["vote_scope"]
          scope_id?: string | null
          options?: Json
          allow_multiple?: boolean | null
          max_selections?: number | null
          start_date?: string
          end_date?: string
          deliberation_start?: string | null
          min_participation?: number | null
          status?: Database["public"]["Enums"]["vote_status"] | null
          result?: Json | null
          total_votes?: number | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vote_records: {
        Row: {
          id: string
          vote_id: string
          user_id: string
          selected_options: Json
          voted_at: string | null
        }
        Insert: {
          id?: string
          vote_id: string
          user_id: string
          selected_options: Json
          voted_at?: string | null
        }
        Update: {
          id?: string
          vote_id?: string
          user_id?: string
          selected_options?: Json
          voted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vote_records_vote_id_fkey"
            columns: ["vote_id"]
            isOneToOne: false
            referencedRelation: "votes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vote_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nominations: {
        Row: {
          id: string
          user_id: string
          election_type: Database["public"]["Enums"]["election_type"]
          region_id: string | null
          constituency: string | null
          status: Database["public"]["Enums"]["nomination_status"] | null
          application_text: string | null
          career_summary: string | null
          policy_pledges: string | null
          regional_activity_score: number | null
          committee_activity_score: number | null
          direct_vote_score: number | null
          final_score: number | null
          nomination_vote_id: string | null
          screening_note: string | null
          review_note: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          election_type: Database["public"]["Enums"]["election_type"]
          region_id?: string | null
          constituency?: string | null
          status?: Database["public"]["Enums"]["nomination_status"] | null
          application_text?: string | null
          career_summary?: string | null
          policy_pledges?: string | null
          regional_activity_score?: number | null
          committee_activity_score?: number | null
          direct_vote_score?: number | null
          final_score?: number | null
          nomination_vote_id?: string | null
          screening_note?: string | null
          review_note?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          election_type?: Database["public"]["Enums"]["election_type"]
          region_id?: string | null
          constituency?: string | null
          status?: Database["public"]["Enums"]["nomination_status"] | null
          application_text?: string | null
          career_summary?: string | null
          policy_pledges?: string | null
          regional_activity_score?: number | null
          committee_activity_score?: number | null
          direct_vote_score?: number | null
          final_score?: number | null
          nomination_vote_id?: string | null
          screening_note?: string | null
          review_note?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nominations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominations_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominations_nomination_vote_id_fkey"
            columns: ["nomination_vote_id"]
            isOneToOne: false
            referencedRelation: "votes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominations_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_proposals: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category: string | null
          status: string
          reviewed_by: string | null
          reviewed_at: string | null
          admin_note: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          category?: string | null
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          admin_note?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          category?: string | null
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          admin_note?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_type: string
          location: string | null
          online_url: string | null
          start_date: string
          end_date: string
          max_participants: number | null
          current_participants: number
          scope: Database["public"]["Enums"]["activity_scope"]
          scope_id: string | null
          status: string
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_type: string
          location?: string | null
          online_url?: string | null
          start_date: string
          end_date: string
          max_participants?: number | null
          current_participants?: number
          scope?: Database["public"]["Enums"]["activity_scope"]
          scope_id?: string | null
          status?: string
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_type?: string
          location?: string | null
          online_url?: string | null
          start_date?: string
          end_date?: string
          max_participants?: number | null
          current_participants?: number
          scope?: Database["public"]["Enums"]["activity_scope"]
          scope_id?: string | null
          status?: string
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          id: string
          event_id: string
          user_id: string
          registered_at: string | null
          attended_at: string | null
          check_in_method: string | null
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          registered_at?: string | null
          attended_at?: string | null
          check_in_method?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          registered_at?: string | null
          attended_at?: string | null
          check_in_method?: string | null
        }
        Relationships: []
      }
      vote_objections: {
        Row: {
          id: string
          vote_id: string
          user_id: string
          reason: string
          evidence: string | null
          status: string
          admin_response: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          vote_id: string
          user_id: string
          reason: string
          evidence?: string | null
          status?: string
          admin_response?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          vote_id?: string
          user_id?: string
          reason?: string
          evidence?: string | null
          status?: string
          admin_response?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string | null
          link: string | null
          is_read: boolean
          metadata: Json
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message?: string | null
          link?: string | null
          is_read?: boolean
          metadata?: Json
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string | null
          link?: string | null
          is_read?: boolean
          metadata?: Json
          created_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          id: string
          slug: string
          category: string
          title: string
          excerpt: string | null
          content: string | null
          author: string | null
          thumbnail_url: string | null
          is_featured: boolean
          is_published: boolean
          published_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          category: string
          title: string
          excerpt?: string | null
          content?: string | null
          author?: string | null
          thumbnail_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          category?: string
          title?: string
          excerpt?: string | null
          content?: string | null
          author?: string | null
          thumbnail_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tenants: {
        Row: {
          id: string
          slug: string
          name: string
          country_code: string
          default_language: string
          supported_languages: string[]
          logo_url: string | null
          favicon_url: string | null
          primary_color: string
          secondary_color: string
          custom_domain: string | null
          settings: Json
          features: Json
          status: string
          is_headquarters: boolean
          contact_email: string | null
          admin_user_id: string | null
          founded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          country_code: string
          default_language?: string
          supported_languages?: string[]
          logo_url?: string | null
          favicon_url?: string | null
          primary_color?: string
          secondary_color?: string
          custom_domain?: string | null
          settings?: Json
          features?: Json
          status?: string
          is_headquarters?: boolean
          contact_email?: string | null
          admin_user_id?: string | null
          founded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          country_code?: string
          default_language?: string
          supported_languages?: string[]
          logo_url?: string | null
          favicon_url?: string | null
          primary_color?: string
          secondary_color?: string
          custom_domain?: string | null
          settings?: Json
          features?: Json
          status?: string
          is_headquarters?: boolean
          contact_email?: string | null
          admin_user_id?: string | null
          founded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tenant_members: {
        Row: {
          id: string
          tenant_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
        Relationships: []
      }
      tenant_settings: {
        Row: {
          id: string
          tenant_id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          key?: string
          value?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_liked: {
        Args: { p_comment_id?: string; p_post_id?: string; p_user_id: string }
        Returns: boolean
      }
      generate_phone_verification_code: {
        Args: { p_phone: string }
        Returns: string
      }
      increment_view_count: { Args: { post_id: string }; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      is_moderator_or_admin: { Args: never; Returns: boolean }
      toggle_like: {
        Args: { p_comment_id?: string; p_post_id?: string; p_user_id: string }
        Returns: Json
      }
      verify_phone_code: {
        Args: { p_phone: string; p_code: string }
        Returns: boolean
      }
      record_activity: {
        Args: {
          p_user_id: string
          p_activity_type: Database["public"]["Enums"]["activity_type"]
          p_points: number
          p_scope?: Database["public"]["Enums"]["activity_scope"]
          p_scope_id?: string
          p_reference_type?: string
          p_reference_id?: string
          p_description?: string
        }
        Returns: string
      }
      get_activity_stats: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_monthly_activities: {
        Args: {
          p_user_id: string
          p_year?: number
          p_month?: number
        }
        Returns: {
          id: string
          activity_type: Database["public"]["Enums"]["activity_type"]
          points: number
          scope: Database["public"]["Enums"]["activity_scope"]
          description: string
          created_at: string
        }[]
      }
      calculate_user_activity_score: {
        Args: { p_user_id: string }
        Returns: {
          total_score: number
          regional_score: number
          committee_score: number
        }[]
      }
      check_vote_eligibility: {
        Args: { p_vote_id: string; p_user_id: string }
        Returns: boolean
      }
      cast_vote: {
        Args: { p_vote_id: string; p_user_id: string; p_selected_options: Json }
        Returns: Json
      }
      count_votes: {
        Args: { p_vote_id: string }
        Returns: Json
      }
      get_available_votes: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          title: string
          description: string
          vote_type: Database["public"]["Enums"]["vote_type"]
          scope: Database["public"]["Enums"]["vote_scope"]
          status: Database["public"]["Enums"]["vote_status"]
          start_date: string
          end_date: string
          total_votes: number
          has_voted: boolean
        }[]
      }
      update_vote_status: {
        Args: { p_vote_id: string; p_new_status: Database["public"]["Enums"]["vote_status"] }
        Returns: Json
      }
      check_nomination_eligibility: {
        Args: { p_user_id: string }
        Returns: Json
      }
      apply_nomination: {
        Args: {
          p_user_id: string
          p_election_type: Database["public"]["Enums"]["election_type"]
          p_region_id: string | null
          p_constituency: string | null
          p_application_text: string
          p_career_summary: string
          p_policy_pledges: string
        }
        Returns: Json
      }
      calculate_nomination_scores: {
        Args: { p_nomination_id: string }
        Returns: Json
      }
      update_nomination_status: {
        Args: {
          p_nomination_id: string
          p_new_status: Database["public"]["Enums"]["nomination_status"]
          p_note?: string | null
          p_reviewer_id?: string | null
        }
        Returns: Json
      }
      get_nomination_candidates: {
        Args: {
          p_election_type?: Database["public"]["Enums"]["election_type"] | null
          p_region_id?: string | null
          p_status?: Database["public"]["Enums"]["nomination_status"] | null
        }
        Returns: {
          id: string
          user_id: string
          user_name: string
          election_type: Database["public"]["Enums"]["election_type"]
          region_name: string
          constituency: string
          status: Database["public"]["Enums"]["nomination_status"]
          final_score: number
          created_at: string
        }[]
      }
      register_for_event: {
        Args: { p_event_id: string; p_user_id: string }
        Returns: Json
      }
      check_in_event: {
        Args: { p_event_id: string; p_user_id: string; p_check_in_method?: string }
        Returns: Json
      }
      submit_vote_objection: {
        Args: { p_vote_id: string; p_user_id: string; p_reason: string; p_evidence?: string | null }
        Returns: Json
      }
      send_notification: {
        Args: {
          p_user_id: string
          p_type: string
          p_title: string
          p_message?: string | null
          p_link?: string | null
          p_metadata?: Json
        }
        Returns: string
      }
      get_unread_notification_count: {
        Args: { p_user_id: string }
        Returns: number
      }
      mark_notifications_read: {
        Args: { p_user_id: string; p_notification_ids?: string[] | null }
        Returns: number
      }
    }
    Enums: {
      community_type: "region" | "committee"
      payment_status:
        | "pending"
        | "completed"
        | "failed"
        | "cancelled"
        | "refunded"
      payment_type: "monthly" | "yearly"
      report_status: "pending" | "reviewing" | "resolved" | "dismissed"
      report_target_type: "post" | "comment" | "user"
      user_role: "guest" | "user" | "member" | "active_member" | "candidate" | "moderator" | "admin"
      activity_type: "post_create" | "comment_create" | "event_attend" | "policy_propose" | "vote_participate" | "donation"
      activity_scope: "national" | "regional" | "committee"
      vote_type: "party_election" | "nomination" | "policy" | "committee" | "regional"
      vote_scope: "national" | "regional" | "committee" | "international"
      vote_status: "draft" | "deliberation" | "voting" | "counting" | "completed" | "cancelled"
      nomination_status: "pending" | "screening" | "evaluation" | "review" | "approved" | "rejected"
      election_type: "national_assembly" | "local_council" | "local_executive" | "party_representative" | "supreme_council"
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

// 편의를 위한 타입 별칭
export type Region = Tables<'regions'>
export type Committee = Tables<'committees'>
export type Community = Tables<'communities'>
export type UserProfile = Tables<'user_profiles'>
export type Post = Tables<'posts'>
export type Comment = Tables<'comments'>
export type Like = Tables<'likes'>
export type Report = Tables<'reports'>
export type Payment = Tables<'payments'>
export type UserCommunity = Tables<'user_communities'>

export type UserRole = Enums<'user_role'>
export type CommunityType = Enums<'community_type'>
export type PaymentStatus = Enums<'payment_status'>
export type PaymentType = Enums<'payment_type'>
export type ReportStatus = Enums<'report_status'>
export type ReportTargetType = Enums<'report_target_type'>
export type SiteSettings = Tables<'site_settings'>
export type News = Tables<'news'>
export type Activity = Tables<'activities'>
export type ActivityType = Enums<'activity_type'>
export type ActivityScope = Enums<'activity_scope'>
export type Vote = Tables<'votes'>
export type VoteRecord = Tables<'vote_records'>
export type VoteType = Enums<'vote_type'>
export type VoteScope = Enums<'vote_scope'>
export type VoteStatus = Enums<'vote_status'>
export type NominationStatus = Enums<'nomination_status'>
export type ElectionType = Enums<'election_type'>
export type Nomination = Tables<'nominations'>
export type Tenant = Tables<'tenants'>
export type TenantMember = Tables<'tenant_members'>
export type TenantSetting = Tables<'tenant_settings'>
