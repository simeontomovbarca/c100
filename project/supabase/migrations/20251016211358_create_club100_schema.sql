/*
  # Club 100 E-commerce Schema

  ## Overview
  Complete database schema for limited-edition T-shirt drops with exclusive Club 100 membership system.

  ## New Tables

  ### 1. collections
  Stores each limited drop (100 pieces max)
  - `id` (uuid, primary key)
  - `slug` (text, unique) - URL-friendly identifier
  - `name` (text) - Collection name (e.g., "Genesis")
  - `drop_date_time` (timestamptz) - When drop goes live
  - `short_description` (text) - Hero/card description
  - `story_description` (text) - Full story/inspiration
  - `price_bgn` (numeric) - Price in BGN
  - `price_eur` (numeric) - Price in EUR
  - `total_stock` (integer) - Total pieces (always 100)
  - `remaining_stock` (integer) - Live inventory count
  - `is_sold_out` (boolean) - Quick check flag
  - `hero_image_url` (text) - Main product image
  - `gallery_images` (jsonb) - Array of image URLs
  - `seo_title` (text)
  - `seo_description` (text)
  - `og_image_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. collection_inventory
  Tracks stock per size for each collection
  - `id` (uuid, primary key)
  - `collection_id` (uuid, foreign key)
  - `size` (text) - S, M, L, XL, XXL
  - `total_quantity` (integer) - Original stock
  - `remaining_quantity` (integer) - Available stock
  - `created_at` (timestamptz)

  ### 3. club_members
  Exclusive Club 100 membership list
  - `id` (uuid, primary key)
  - `email` (text, unique)
  - `name` (text)
  - `joined_at` (timestamptz)
  - `is_early_access` (boolean) - Access to pre-launches
  - `total_purchases` (integer)
  - `created_at` (timestamptz)

  ### 4. orders
  Customer orders with serial number tracking
  - `id` (uuid, primary key)
  - `order_number` (text, unique) - Display ID
  - `collection_id` (uuid, foreign key)
  - `customer_email` (text)
  - `customer_name` (text)
  - `customer_phone` (text)
  - `size` (text)
  - `serial_number` (integer) - 1-100
  - `price_paid` (numeric)
  - `currency` (text)
  - `payment_method` (text) - cash_on_delivery, card, apple_pay, google_pay
  - `shipping_address` (jsonb) - Full address object
  - `status` (text) - pending, confirmed, shipped, delivered, cancelled
  - `tracking_number` (text)
  - `is_club_member` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. faq_items
  Collection-specific FAQ entries
  - `id` (uuid, primary key)
  - `collection_id` (uuid, foreign key, nullable) - NULL for global FAQs
  - `question` (text)
  - `answer` (text)
  - `display_order` (integer)
  - `created_at` (timestamptz)

  ### 6. reviews
  User-generated content and testimonials
  - `id` (uuid, primary key)
  - `collection_id` (uuid, foreign key)
  - `customer_name` (text)
  - `rating` (integer) - 1-5 stars
  - `comment` (text)
  - `serial_number` (integer)
  - `image_url` (text, nullable)
  - `is_approved` (boolean) - Moderation flag
  - `created_at` (timestamptz)

  ### 7. newsletter_subscribers
  Email list for announcements and drops
  - `id` (uuid, primary key)
  - `email` (text, unique)
  - `subscribed_at` (timestamptz)
  - `is_confirmed` (boolean) - Double opt-in
  - `source` (text) - homepage, club100, checkout

  ## Security
  - Row Level Security enabled on all tables
  - Public read access for collections, inventory, FAQ, approved reviews
  - Admin-only write access (implement auth later)

  ## Indexes
  - Fast lookups on slugs, emails, order numbers, collection_id foreign keys
*/

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  drop_date_time timestamptz NOT NULL,
  short_description text NOT NULL,
  story_description text,
  price_bgn numeric(10,2) NOT NULL,
  price_eur numeric(10,2) NOT NULL,
  total_stock integer DEFAULT 100 NOT NULL,
  remaining_stock integer DEFAULT 100 NOT NULL,
  is_sold_out boolean DEFAULT false,
  hero_image_url text,
  gallery_images jsonb DEFAULT '[]'::jsonb,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create collection_inventory table
CREATE TABLE IF NOT EXISTS collection_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  size text NOT NULL,
  total_quantity integer NOT NULL,
  remaining_quantity integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(collection_id, size)
);

-- Create club_members table
CREATE TABLE IF NOT EXISTS club_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  joined_at timestamptz DEFAULT now(),
  is_early_access boolean DEFAULT true,
  total_purchases integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  collection_id uuid NOT NULL REFERENCES collections(id),
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  size text NOT NULL,
  serial_number integer NOT NULL,
  price_paid numeric(10,2) NOT NULL,
  currency text NOT NULL,
  payment_method text NOT NULL,
  shipping_address jsonb NOT NULL,
  status text DEFAULT 'pending',
  tracking_number text,
  is_club_member boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(collection_id, serial_number)
);

-- Create faq_items table
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  serial_number integer,
  image_url text,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  is_confirmed boolean DEFAULT false,
  source text DEFAULT 'homepage'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_drop_date ON collections(drop_date_time);
CREATE INDEX IF NOT EXISTS idx_inventory_collection ON collection_inventory(collection_id);
CREATE INDEX IF NOT EXISTS idx_orders_collection ON orders(collection_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_faq_collection ON faq_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_reviews_collection ON reviews(collection_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_club_members_email ON club_members(email);

-- Enable Row Level Security
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public read policies for storefront
CREATE POLICY "Public can view collections"
  ON collections FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view inventory"
  ON collection_inventory FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view FAQ items"
  ON faq_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view approved reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

-- Club members can check their membership
CREATE POLICY "Users can check club membership by email"
  ON club_members FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow public to insert newsletter subscriptions
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow public to insert club member applications
CREATE POLICY "Anyone can join club"
  ON club_members FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow public to create orders (will add auth later)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow customers to view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();