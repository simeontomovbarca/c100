import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Collection {
  id: string;
  slug: string;
  name: string;
  drop_date_time: string;
  short_description: string;
  story_description: string;
  price_bgn: number;
  price_eur: number;
  total_stock: number;
  remaining_stock: number;
  is_sold_out: boolean;
  hero_image_url: string | null;
  gallery_images: string[];
  seo_title: string;
  seo_description: string;
  og_image_url: string | null;
}

export interface CollectionInventory {
  id: string;
  collection_id: string;
  size: string;
  total_quantity: number;
  remaining_quantity: number;
}

export interface FAQItem {
  id: string;
  collection_id: string | null;
  question: string;
  answer: string;
  display_order: number;
}

export interface Review {
  id: string;
  collection_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  serial_number: number | null;
  image_url: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface ClubMember {
  id: string;
  email: string;
  name: string;
  joined_at: string;
  is_early_access: boolean;
  total_purchases: number;
}
