export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      albums: {
        Row: {
          album_name: string | null
          artist_username: string | null
          created_at: string
          id: string
          release_date: string | null
        }
        Insert: {
          album_name?: string | null
          artist_username?: string | null
          created_at?: string
          id?: string
          release_date?: string | null
        }
        Update: {
          album_name?: string | null
          artist_username?: string | null
          created_at?: string
          id?: string
          release_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "albums_artist_username_fkey"
            columns: ["artist_username"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["username"]
          },
        ]
      }
      artists: {
        Row: {
          artist_name: string | null
          created_at: string
          username: string
        }
        Insert: {
          artist_name?: string | null
          created_at?: string
          username: string
        }
        Update: {
          artist_name?: string | null
          created_at?: string
          username?: string
        }
        Relationships: []
      }
      blockouts: {
        Row: {
          created_at: string
          end: string | null
          id: string
          profile: string | null
          start: string | null
        }
        Insert: {
          created_at?: string
          end?: string | null
          id?: string
          profile?: string | null
          start?: string | null
        }
        Update: {
          created_at?: string
          end?: string | null
          id?: string
          profile?: string | null
          start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blockouts_profile_fkey"
            columns: ["profile"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      "church-membership-request": {
        Row: {
          church: string
          created_at: string
          id: number
          profile: string
        }
        Insert: {
          church: string
          created_at?: string
          id?: number
          profile: string
        }
        Update: {
          church?: string
          created_at?: string
          id?: number
          profile?: string
        }
        Relationships: [
          {
            foreignKeyName: "church-membership-request_church_fkey"
            columns: ["church"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church-membership-request_profile_fkey"
            columns: ["profile"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      "church-share-code": {
        Row: {
          church: string | null
          code: string | null
          created_at: string
          description: string | null
          id: string
        }
        Insert: {
          church?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
        }
        Update: {
          church?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church-share-code_church_fkey"
            columns: ["church"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      "church-teams": {
        Row: {
          church: string | null
          created_at: string
          id: string
          is_worship: boolean | null
          team_name: string | null
        }
        Insert: {
          church?: string | null
          created_at?: string
          id?: string
          is_worship?: boolean | null
          team_name?: string | null
        }
        Update: {
          church?: string | null
          created_at?: string
          id?: string
          is_worship?: boolean | null
          team_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church-teams_church_fkey"
            columns: ["church"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      churches: {
        Row: {
          address: string | null
          church_name: string
          city: string | null
          comune: string | null
          created_at: string
          creator: string | null
          id: string
          ig_handle: string | null
          logo: string | null
          pastor: string
          plan: string | null
          provincia: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          church_name: string
          city?: string | null
          comune?: string | null
          created_at?: string
          creator?: string | null
          id?: string
          ig_handle?: string | null
          logo?: string | null
          pastor: string
          plan?: string | null
          provincia?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          church_name?: string
          city?: string | null
          comune?: string | null
          created_at?: string
          creator?: string | null
          id?: string
          ig_handle?: string | null
          logo?: string | null
          pastor?: string
          plan?: string | null
          provincia?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "churches_creator_fkey"
            columns: ["creator"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      "custom-event-types": {
        Row: {
          church: string | null
          id: string
          key: string | null
          label: string | null
        }
        Insert: {
          church?: string | null
          id?: string
          key?: string | null
          label?: string | null
        }
        Update: {
          church?: string | null
          id?: string
          key?: string | null
          label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom-event-types_church_fkey"
            columns: ["church"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom-event-types_key_fkey"
            columns: ["key"]
            isOneToOne: false
            referencedRelation: "event-types"
            referencedColumns: ["key"]
          },
        ]
      }
      "event-sections": {
        Row: {
          created_at: string
          id: string
          order: number | null
          service_id: string | null
          type: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          order?: number | null
          service_id?: string | null
          type?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          order?: number | null
          service_id?: string | null
          type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sections-sections_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service-sections_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "section-types"
            referencedColumns: ["id"]
          },
        ]
      }
      "event-team": {
        Row: {
          id: string
          last_email: string | null
          lead: boolean | null
          member: string | null
          roles: string | null
          setlist: string | null
          status: string | null
          team: string | null
        }
        Insert: {
          id?: string
          last_email?: string | null
          lead?: boolean | null
          member?: string | null
          roles?: string | null
          setlist?: string | null
          status?: string | null
          team?: string | null
        }
        Update: {
          id?: string
          last_email?: string | null
          lead?: boolean | null
          member?: string | null
          roles?: string | null
          setlist?: string | null
          status?: string | null
          team?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event-team_member_fkey"
            columns: ["member"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event-team_setlist_fkey"
            columns: ["setlist"]
            isOneToOne: false
            referencedRelation: "setlist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event-team_team_fkey"
            columns: ["team"]
            isOneToOne: false
            referencedRelation: "church-teams"
            referencedColumns: ["id"]
          },
        ]
      }
      "event-types": {
        Row: {
          key: string
        }
        Insert: {
          key: string
        }
        Update: {
          key?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          church_id: string | null
          created_at: string
          date: string | null
          description: string | null
          id: string
          location: string | null
          start_hour: string | null
          title: string
        }
        Insert: {
          church_id?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          location?: string | null
          start_hour?: string | null
          title: string
        }
        Update: {
          church_id?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          location?: string | null
          start_hour?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      "italian-songs": {
        Row: {
          album: string | null
          artist: string | null
          author: string | null
          bpm: string | null
          created_at: string
          id: string
          lyrics: string
          song_title: string
          tempo: string | null
          upload_key: string | null
        }
        Insert: {
          album?: string | null
          artist?: string | null
          author?: string | null
          bpm?: string | null
          created_at?: string
          id?: string
          lyrics: string
          song_title: string
          tempo?: string | null
          upload_key?: string | null
        }
        Update: {
          album?: string | null
          artist?: string | null
          author?: string | null
          bpm?: string | null
          created_at?: string
          id?: string
          lyrics?: string
          song_title?: string
          tempo?: string | null
          upload_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "global-songs_album_fkey"
            columns: ["album"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "global-songs_artist_fkey"
            columns: ["artist"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["username"]
          },
        ]
      }
      logs: {
        Row: {
          created_at: string | null
          event: string
          id: string
          level: string | null
          meta: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event: string
          id?: string
          level?: string | null
          meta?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event?: string
          id?: string
          level?: string | null
          meta?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_invites: {
        Row: {
          church: string | null
          created_at: string
          email: string | null
          email_status: string | null
          id: number
          last_email: string | null
          lastname: string | null
          name: string | null
          status: string | null
          token: string | null
        }
        Insert: {
          church?: string | null
          created_at?: string
          email?: string | null
          email_status?: string | null
          id?: number
          last_email?: string | null
          lastname?: string | null
          name?: string | null
          status?: string | null
          token?: string | null
        }
        Update: {
          church?: string | null
          created_at?: string
          email?: string | null
          email_status?: string | null
          id?: number
          last_email?: string | null
          lastname?: string | null
          name?: string | null
          status?: string | null
          token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pending_invites_church_fkey"
            columns: ["church"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions_by_role: {
        Row: {
          action: string
          allowed: boolean | null
          resource: string
          role: string
          team_id: string
        }
        Insert: {
          action: string
          allowed?: boolean | null
          resource: string
          role: string
          team_id: string
        }
        Update: {
          action?: string
          allowed?: boolean | null
          resource?: string
          role?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permissions_by_role_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "church-teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          church: string | null
          email: string | null
          id: string
          lastname: string | null
          name: string | null
          phone: string | null
          role: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          church?: string | null
          email?: string | null
          id: string
          lastname?: string | null
          name?: string | null
          phone?: string | null
          role?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          church?: string | null
          email?: string | null
          id?: string
          lastname?: string | null
          name?: string | null
          phone?: string | null
          role?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_church_fkey"
            columns: ["church"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          created_at: string
          endpoint: string
          id: number
          keys: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: number
          keys?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: number
          keys?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: number
          role_description: string | null
          role_name: string | null
        }
        Insert: {
          id?: number
          role_description?: string | null
          role_name?: string | null
        }
        Update: {
          id?: number
          role_description?: string | null
          role_name?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          address: string | null
          church: string | null
          comune: string | null
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          address?: string | null
          church?: string | null
          comune?: string | null
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          address?: string | null
          church?: string | null
          comune?: string | null
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_church_fkey"
            columns: ["church"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      "section-types": {
        Row: {
          created_at: string
          id: number
          "section-name": string | null
        }
        Insert: {
          created_at?: string
          id?: number
          "section-name"?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          "section-name"?: string | null
        }
        Relationships: []
      }
      setlist: {
        Row: {
          church: string | null
          color: string | null
          created_at: string
          created_by: string | null
          date: string | null
          event_title: string | null
          event_type: string | null
          hour: string | null
          id: string
          private: boolean | null
          room: string | null
        }
        Insert: {
          church?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          date?: string | null
          event_title?: string | null
          event_type?: string | null
          hour?: string | null
          id?: string
          private?: boolean | null
          room?: string | null
        }
        Update: {
          church?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          date?: string | null
          event_title?: string | null
          event_type?: string | null
          hour?: string | null
          id?: string
          private?: boolean | null
          room?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setlist_church_fkey"
            columns: ["church"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setlist_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setlist_event_type_fkey"
            columns: ["event_type"]
            isOneToOne: false
            referencedRelation: "event-types"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "setlist_room_fkey"
            columns: ["room"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      "setlist-notes": {
        Row: {
          id: string
          note: string | null
          order: number | null
          setlist_id: string | null
        }
        Insert: {
          id?: string
          note?: string | null
          order?: number | null
          setlist_id?: string | null
        }
        Update: {
          id?: string
          note?: string | null
          order?: number | null
          setlist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setlist-notes_setlist_id_fkey"
            columns: ["setlist_id"]
            isOneToOne: false
            referencedRelation: "setlist"
            referencedColumns: ["id"]
          },
        ]
      }
      "setlist-songs": {
        Row: {
          created_at: string
          id: string
          key: string | null
          notes: string | null
          order: number | null
          setlist_id: string | null
          singer: string | null
          song: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key?: string | null
          notes?: string | null
          order?: number | null
          setlist_id?: string | null
          singer?: string | null
          song?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string | null
          notes?: string | null
          order?: number | null
          setlist_id?: string | null
          singer?: string | null
          song?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setlist-songs_setlist_id_fkey"
            columns: ["setlist_id"]
            isOneToOne: false
            referencedRelation: "setlist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setlist-songs_singer_fkey"
            columns: ["singer"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setlist-songs_song_fkey"
            columns: ["song"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      "setlist-titles": {
        Row: {
          id: string
          order: number | null
          setlist_id: string | null
          title: string | null
        }
        Insert: {
          id?: string
          order?: number | null
          setlist_id?: string | null
          title?: string | null
        }
        Update: {
          id?: string
          order?: number | null
          setlist_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setlist-titles_setlist_id_fkey"
            columns: ["setlist_id"]
            isOneToOne: false
            referencedRelation: "setlist"
            referencedColumns: ["id"]
          },
        ]
      }
      "song-section": {
        Row: {
          created_at: string
          duration: string | null
          id: string
          key: string | null
          lead_singer: string | null
          notes: string | null
          "section-id": string | null
          song_id: string | null
        }
        Insert: {
          created_at?: string
          duration?: string | null
          id?: string
          key?: string | null
          lead_singer?: string | null
          notes?: string | null
          "section-id"?: string | null
          song_id?: string | null
        }
        Update: {
          created_at?: string
          duration?: string | null
          id?: string
          key?: string | null
          lead_singer?: string | null
          notes?: string | null
          "section-id"?: string | null
          song_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "song-section_section-id_fkey"
            columns: ["section-id"]
            isOneToOne: false
            referencedRelation: "event-sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song-section_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
        ]
      }
      songs: {
        Row: {
          author: string | null
          bpm: string | null
          church: string | null
          created_at: string
          id: string
          lyrics: string
          notes: string | null
          song_title: string
          tags: string | null
          upload_key: string | null
        }
        Insert: {
          author?: string | null
          bpm?: string | null
          church?: string | null
          created_at?: string
          id?: string
          lyrics: string
          notes?: string | null
          song_title: string
          tags?: string | null
          upload_key?: string | null
        }
        Update: {
          author?: string | null
          bpm?: string | null
          church?: string | null
          created_at?: string
          id?: string
          lyrics?: string
          notes?: string | null
          song_title?: string
          tags?: string | null
          upload_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "songs_church_fkey"
            columns: ["church"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          id: number
          metadata: string | null
          profile: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: number
          metadata?: string | null
          profile?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: number
          metadata?: string | null
          profile?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          church: string | null
          created_at: string
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          church?: string | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          church?: string | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_church_fkey"
            columns: ["church"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      "team-leaders": {
        Row: {
          created_at: string
          id: string
          profile: string
          team: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile: string
          team: string
        }
        Update: {
          created_at?: string
          id?: string
          profile?: string
          team?: string
        }
        Relationships: [
          {
            foreignKeyName: "team-leaders_profile_fkey"
            columns: ["profile"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team-leaders_team_fkey"
            columns: ["team"]
            isOneToOne: false
            referencedRelation: "church-teams"
            referencedColumns: ["id"]
          },
        ]
      }
      "team-members": {
        Row: {
          created_at: string
          id: string
          profile: string
          role: string | null
          roles: string[] | null
          team_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          profile: string
          role?: string | null
          roles?: string[] | null
          team_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          profile?: string
          role?: string | null
          roles?: string[] | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team-members_profile_fkey"
            columns: ["profile"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team-members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "church-teams"
            referencedColumns: ["id"]
          },
        ]
      }
      "temp-profiles": {
        Row: {
          avatar_url: string | null
          church: string | null
          email: string | null
          id: string
          lastname: string | null
          name: string | null
          role: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          church?: string | null
          email?: string | null
          id: string
          lastname?: string | null
          name?: string | null
          role?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          church?: string | null
          email?: string | null
          id?: string
          lastname?: string | null
          name?: string | null
          role?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "temp-profiles_church_fkey"
            columns: ["church"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "temp-profiles_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
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
