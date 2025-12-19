/*
  # Electronics Store - Smartphone Products Schema

  ## Overview
  Creates the database structure for a smartphone retail store in Morocco.

  ## New Tables
  
  ### `products`
  Stores base smartphone information:
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text) - Product name (e.g., "iPhone 15 Pro")
  - `brand` (text) - Manufacturer brand (e.g., "Apple", "Samsung")
  - `description` (text) - Detailed product description
  - `features` (jsonb) - Array of key features
  - `specifications` (jsonb) - Technical specifications object
  - `base_price` (decimal) - Starting price in MAD
  - `images` (jsonb) - Array of product image URLs
  - `category` (text) - Product category
  - `is_featured` (boolean) - Whether to feature on homepage
  - `stock_status` (text) - Overall stock availability
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `product_variants`
  Stores color and storage variants for each product:
  - `id` (uuid, primary key) - Unique variant identifier
  - `product_id` (uuid, foreign key) - Reference to parent product
  - `color` (text) - Color name (e.g., "Natural Titanium")
  - `color_hex` (text) - Hex color code for swatch display
  - `storage` (text) - Storage capacity (e.g., "256GB")
  - `price` (decimal) - Variant-specific price in MAD
  - `stock_quantity` (integer) - Available quantity
  - `sku` (text) - Stock keeping unit code
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on both tables
  - Add policies for public read access (suitable for e-commerce)
  - No insert/update/delete policies as these would be admin-only operations

  ## Notes
  - All prices are in Moroccan Dirham (MAD)
  - Images stored as URLs (using Pexels or product images)
  - JSONB used for flexible feature and specification storage
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  description text NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  specifications jsonb DEFAULT '{}'::jsonb,
  base_price decimal(10,2) NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  category text DEFAULT 'smartphone',
  is_featured boolean DEFAULT false,
  stock_status text DEFAULT 'in_stock',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color text NOT NULL,
  color_hex text NOT NULL,
  storage text NOT NULL,
  price decimal(10,2) NOT NULL,
  stock_quantity integer DEFAULT 0,
  sku text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view product variants"
  ON product_variants FOR SELECT
  TO anon, authenticated
  USING (true);