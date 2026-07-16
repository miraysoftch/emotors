import pg from 'pg'

const { Client } = pg

async function setupDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

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
        parent_id TEXT,
        "order" INTEGER,
        active BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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
        category_id TEXT,
        subcategory_id TEXT,
        brand TEXT,
        sku TEXT UNIQUE,
        ean TEXT,
        image TEXT,
        images TEXT[],
        video_url TEXT,
        pdf_url TEXT,
        downloads TEXT[],
        image_360 TEXT,
        power_watts INTEGER,
        battery_capacity DECIMAL(10,2),
        range_km DECIMAL(10,2),
        max_speed INTEGER,
        weight_kg DECIMAL(10,2),
        charge_time TEXT,
        max_load DECIMAL(10,2),
        warranty TEXT,
        delivery_time TEXT,
        color TEXT,
        availability TEXT,
        stock_quantity INTEGER,
        financing_available BOOLEAN DEFAULT false,
        license_required BOOLEAN DEFAULT false,
        license_type TEXT,
        "condition" TEXT,
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
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Products table created')

    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_active ON products(active)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)`)
    console.log('✓ Indexes created')

    console.log('✓ Database setup complete!')
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('Tables already exist, skipping creation')
    } else {
      console.error('Error:', error.message)
      throw error
    }
  } finally {
    await client.end()
  }
}

setupDatabase().catch(console.error)
