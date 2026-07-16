import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTables() {
  try {
    console.log('[v0] Creating products and categories tables...');

    // Categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        description TEXT,
        long_description TEXT,
        type VARCHAR(50),
        parent_id UUID,
        license_required BOOLEAN DEFAULT false,
        icon VARCHAR(255),
        image VARCHAR(255),
        banner VARCHAR(255),
        color VARCHAR(50),
        featured BOOLEAN DEFAULT false,
        active BOOLEAN DEFAULT true,
        seo_title VARCHAR(255),
        seo_description TEXT,
        sort_priority INTEGER DEFAULT 0,
        "order" INTEGER DEFAULT 0,
        metadata JSONB,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[v0] Categories table created');

    // Products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(500) UNIQUE,
        title VARCHAR(500) NOT NULL,
        short_description VARCHAR(1000),
        description TEXT,
        long_description TEXT,
        price DECIMAL(10,2),
        discount_price DECIMAL(10,2),
        discount_percentage DECIMAL(5,2),
        monthly_price DECIMAL(10,2),
        category_id UUID,
        subcategory_id UUID,
        brand VARCHAR(255),
        sku VARCHAR(255) UNIQUE,
        ean VARCHAR(255),
        image VARCHAR(255),
        images JSONB,
        video_url VARCHAR(255),
        pdf_url VARCHAR(255),
        downloads JSONB,
        image_360 JSONB,
        power_watts INTEGER,
        battery_capacity DECIMAL(10,2),
        range_km DECIMAL(10,2),
        max_speed DECIMAL(10,2),
        weight_kg DECIMAL(10,2),
        charge_time VARCHAR(100),
        max_load DECIMAL(10,2),
        warranty VARCHAR(255),
        delivery_time VARCHAR(100),
        color VARCHAR(100),
        availability VARCHAR(100),
        stock_quantity INTEGER DEFAULT 0,
        financing_available BOOLEAN DEFAULT false,
        license_required BOOLEAN DEFAULT false,
        license_type VARCHAR(100),
        condition VARCHAR(50),
        seo_title VARCHAR(255),
        seo_description TEXT,
        og_image VARCHAR(255),
        og_title VARCHAR(255),
        og_description TEXT,
        structured_data JSONB,
        featured BOOLEAN DEFAULT false,
        bestseller BOOLEAN DEFAULT false,
        new_product BOOLEAN DEFAULT false,
        recommended BOOLEAN DEFAULT false,
        active BOOLEAN DEFAULT true,
        archived BOOLEAN DEFAULT false,
        specs JSONB,
        metadata JSONB,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);
    console.log('[v0] Products table created');

    // Create indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_products_active ON products(active)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active)`);
    console.log('[v0] Indexes created');

    console.log('[v0] All tables created successfully!');
    await pool.end();
  } catch (error) {
    console.error('[v0] Error creating tables:', error.message);
    process.exit(1);
  }
}

createTables();
