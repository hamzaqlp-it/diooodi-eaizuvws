export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          brand: string;
          description: string;
          features: string[];
          specifications: Record<string, string>;
          base_price: number;
          images: string[];
          category: string;
          is_featured: boolean;
          stock_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          color: string;
          color_hex: string;
          storage: string;
          price: number;
          stock_quantity: number;
          sku: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>;
      };
    };
  };
}

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductVariant = Database['public']['Tables']['product_variants']['Row'];

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}
