import { Client } from 'pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('DATABASE_URL not set')
  process.exit(1)
}

const client = new Client({ connectionString })

async function migrate() {
  try {
    await client.connect()
    console.log('Connected to database')

    // Create categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        icon TEXT,
        parent_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
        sort_order INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        metadata JSONB
      )
    `)
    console.log('✓ Categories table created')

    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        short_description TEXT,
        description TEXT,
        long_description TEXT,
        price DECIMAL(10,2),
        discount_price DECIMAL(10,2),
        discount_percentage DECIMAL(5,2),
        monthly_price DECIMAL(10,2),
        category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
        subcategory_id TEXT,
        brand TEXT,
        sku TEXT UNIQUE,
        ean TEXT UNIQUE,
        image TEXT,
        images JSONB,
        video_url TEXT,
        pdf_url TEXT,
        downloads JSONB,
        image_360 TEXT,
        power_watts INTEGER,
        battery_capacity DECIMAL(10,2),
        range_km DECIMAL(10,2),
        max_speed DECIMAL(10,2),
        weight_kg DECIMAL(10,2),
        charge_time TEXT,
        max_load DECIMAL(10,2),
        warranty TEXT,
        delivery_time TEXT,
        color TEXT,
        availability TEXT,
        stock_quantity INTEGER DEFAULT 0,
        financing_available BOOLEAN DEFAULT false,
        license_required BOOLEAN DEFAULT false,
        license_type TEXT,
        condition TEXT DEFAULT 'new',
        seo_title TEXT,
        seo_description TEXT,
        og_image TEXT,
        og_title TEXT,
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
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✓ Products table created')

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_active ON products(active)
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)
    `)
    console.log('✓ Indexes created')

    console.log('✅ Migration complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

migrate()
