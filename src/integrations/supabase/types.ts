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
      analyses: {
        Row: {
          created_at: string
          id: string
          name: string
          status: string | null
          template: string | null
          updated_at: string
          user_id: string | null
          website: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: string | null
          template?: string | null
          updated_at?: string
          user_id?: string | null
          website: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: string | null
          template?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string
        }
        Relationships: []
      }
      analysis_content: {
        Row: {
          analysis_id: string | null
          content: string
          content_type: string
          generated_at: string
          id: string
        }
        Insert: {
          analysis_id?: string | null
          content: string
          content_type: string
          generated_at?: string
          id?: string
        }
        Update: {
          analysis_id?: string | null
          content?: string
          content_type?: string
          generated_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_content_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          analysis_id: string | null
          created_at: string
          description: string | null
          features: Json | null
          id: string
          last_analyzed: string | null
          name: string
          positioning: string | null
          pricing_model: string | null
          pricing_start: number | null
          strengths: string[] | null
          weaknesses: string[] | null
          website: string
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          last_analyzed?: string | null
          name: string
          positioning?: string | null
          pricing_model?: string | null
          pricing_start?: number | null
          strengths?: string[] | null
          weaknesses?: string[] | null
          website: string
        }
        Update: {
          analysis_id?: string | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          last_analyzed?: string | null
          name?: string
          positioning?: string | null
          pricing_model?: string | null
          pricing_start?: number | null
          strengths?: string[] | null
          weaknesses?: string[] | null
          website?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitors_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      differentiation_angles: {
        Row: {
          analysis_id: string | null
          created_at: string
          description: string
          id: string
          opportunity_level: string | null
          title: string
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string
          description: string
          id?: string
          opportunity_level?: string | null
          title: string
        }
        Update: {
          analysis_id?: string | null
          created_at?: string
          description?: string
          id?: string
          opportunity_level?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "differentiation_angles_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      monitoring_alerts: {
        Row: {
          alert_type: string
          competitor_id: string | null
          detected_at: string
          id: string
          is_read: boolean | null
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          alert_type: string
          competitor_id?: string | null
          detected_at?: string
          id?: string
          is_read?: boolean | null
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          alert_type?: string
          competitor_id?: string | null
          detected_at?: string
          id?: string
          is_read?: boolean | null
          new_value?: string | null
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monitoring_alerts_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          analyses_used: number
          created_at: string
          email: string
          id: string
          max_analyses: number
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analyses_used?: number
          created_at?: string
          email: string
          id?: string
          max_analyses?: number
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analyses_used?: number
          created_at?: string
          email?: string
          id?: string
          max_analyses?: number
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          features: Json
          id: string
          is_active: boolean
          max_analyses: number | null
          name: string
          price_annual: number
          price_monthly: number
          stripe_price_id_annual: string | null
          stripe_price_id_monthly: string | null
        }
        Insert: {
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          max_analyses?: number | null
          name: string
          price_annual: number
          price_monthly: number
          stripe_price_id_annual?: string | null
          stripe_price_id_monthly?: string | null
        }
        Update: {
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          max_analyses?: number | null
          name?: string
          price_annual?: number
          price_monthly?: number
          stripe_price_id_annual?: string | null
          stripe_price_id_monthly?: string | null
        }
        Relationships: []
      }
      website_context: {
        Row: {
          analysis_id: string | null
          business_model: string
          company_name: string
          competitive_positioning: Json
          core_offerings: Json
          created_at: string
          id: string
          industry: string
          pricing_strategy: Json
          strategic_context: Json
          target_audience: Json
          value_proposition: string
          website_quality: Json
        }
        Insert: {
          analysis_id?: string | null
          business_model: string
          company_name: string
          competitive_positioning: Json
          core_offerings: Json
          created_at?: string
          id?: string
          industry: string
          pricing_strategy: Json
          strategic_context: Json
          target_audience: Json
          value_proposition: string
          website_quality: Json
        }
        Update: {
          analysis_id?: string | null
          business_model?: string
          company_name?: string
          competitive_positioning?: Json
          core_offerings?: Json
          created_at?: string
          id?: string
          industry?: string
          pricing_strategy?: Json
          strategic_context?: Json
          target_audience?: Json
          value_proposition?: string
          website_quality?: Json
        }
        Relationships: [
          {
            foreignKeyName: "website_context_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
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
