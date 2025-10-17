/*
  # Add Shirt Number Tracking

  1. New Tables
    - `shirt_numbers`
      - `number` (integer, primary key) - The shirt number (1-100)
      - `is_sold` (boolean) - Whether this number is sold
      - `sold_at` (timestamptz) - When it was sold
      - `order_email` (text) - Email of buyer who purchased this number
      - `created_at` (timestamptz) - Timestamp

  2. Changes to existing tables
    - Add `shirt_number` column to `orders` table to track which number each order has

  3. Security
    - Enable RLS on `shirt_numbers` table
    - Public can read all numbers to see availability
    - Only system can update (no public updates allowed)
*/

-- Create shirt_numbers table
CREATE TABLE IF NOT EXISTS shirt_numbers (
  number integer PRIMARY KEY CHECK (number >= 1 AND number <= 100),
  is_sold boolean DEFAULT false NOT NULL,
  sold_at timestamptz,
  order_email text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Insert all numbers 1-100
INSERT INTO shirt_numbers (number)
SELECT generate_series(1, 100)
ON CONFLICT (number) DO NOTHING;

-- Add shirt_number column to orders if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shirt_number'
  ) THEN
    ALTER TABLE orders ADD COLUMN shirt_number integer REFERENCES shirt_numbers(number);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE shirt_numbers ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read shirt numbers (to see availability)
CREATE POLICY "Anyone can view shirt numbers"
  ON shirt_numbers
  FOR SELECT
  TO public
  USING (true);

-- No public updates (system only)
CREATE POLICY "No public updates to shirt numbers"
  ON shirt_numbers
  FOR UPDATE
  TO public
  USING (false);
