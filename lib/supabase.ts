import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type EvaluationRow = {
  id?: string;
  created_at?: string;
  gender: string;
  full_name: string;
  age: number;
  residence: string;
  household_size: number;
  phone: string;
  email: string;
  employment: string;
  family_income: string;
  own_capital: string;
  investments_abroad: boolean;
  has_land: boolean;
  property_status: string;
  pension_checked: boolean;
  mortgage_pct: number | null;
  insurance_pct: number | null;
  decile: number;
  score: number;
};
