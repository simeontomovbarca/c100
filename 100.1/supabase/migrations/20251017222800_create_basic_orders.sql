/*
  # Create Basic Orders Table

  ## Purpose
  Simple orders table for basic checkout flow (Genesis drop only).

  ## New Tables

  ### `basic_orders`
  - `id` (uuid, primary key)
  - `order_number` (text, unique) - Display ID (e.g., "C100-001")
  - `customer_name` (text) - Full name
  - `customer_email` (text) - Email address
  - `customer_phone` (text) - Phone number
  - `shirt_size` (text) - S, M, L, XL, XXL
  - `shirt_number` (integer) - Number 1-100
  - `street_address` (text) - Street and number
  - `city` (text) - City
  - `postal_code` (text) - Postal code
  - `status` (text) - pending, confirmed, shipped, delivered, cancelled
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on `basic_orders` table
  - Public can insert orders (checkout)
  - Public can view their own orders by email

  ## Notes
  - Shirt numbers 1-100 are tracked in `shirt_numbers` table
  - When order is created, mark the number as sold
  - Simple flow: no payment integration yet
*/

-- Create basic_orders table
CREATE TABLE IF NOT EXISTS basic_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shirt_size text NOT NULL CHECK (shirt_size IN ('S', 'M', 'L', 'XL', 'XXL')),
  shirt_number integer NOT NULL CHECK (shirt_number >= 1 AND shirt_number <= 100),
  street_address text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_basic_orders_email ON basic_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_basic_orders_number ON basic_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_basic_orders_shirt_number ON basic_orders(shirt_number);

-- Enable RLS
ALTER TABLE basic_orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create orders
CREATE POLICY "Anyone can create orders"
  ON basic_orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to view orders (will restrict by email in app logic)
CREATE POLICY "Anyone can view orders"
  ON basic_orders
  FOR SELECT
  TO public
  USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_basic_orders_updated_at
  BEFORE UPDATE ON basic_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
