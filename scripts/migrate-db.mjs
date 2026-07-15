import pg from 'pg'

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log('🚀 Running migrations...')
    
    const client = await pool.connect()
    
    try {
      // Create tables if they don't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS "user" (
          "id" text PRIMARY KEY,
          "name" text,
          "email" text NOT NULL UNIQUE,
          "emailVerified" boolean NOT NULL DEFAULT false,
          "image" text,
          "createdAt" timestamp NOT NULL DEFAULT NOW(),
          "updatedAt" timestamp NOT NULL DEFAULT NOW()
        );
      `)

      await client.query(`
        CREATE TABLE IF NOT EXISTS "account" (
          "id" text PRIMARY KEY,
          "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
          "type" text NOT NULL,
          "provider" text NOT NULL,
          "providerAccountId" text NOT NULL,
          "password" text,
          "createdAt" timestamp NOT NULL DEFAULT NOW(),
          "updatedAt" timestamp NOT NULL DEFAULT NOW(),
          UNIQUE("provider", "providerAccountId")
        );
      `)

      await client.query(`
        CREATE TABLE IF NOT EXISTS "session" (
          "id" text PRIMARY KEY,
          "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
          "expiresAt" timestamp NOT NULL,
          "token" text NOT NULL UNIQUE,
          "createdAt" timestamp NOT NULL DEFAULT NOW(),
          "updatedAt" timestamp NOT NULL DEFAULT NOW()
        );
      `)

      await client.query(`
        CREATE TABLE IF NOT EXISTS "verification" (
          "id" text PRIMARY KEY,
          "identifier" text NOT NULL,
          "token" text NOT NULL UNIQUE,
          "expiresAt" timestamp NOT NULL,
          "createdAt" timestamp,
          "updatedAt" timestamp
        );
      `)

      console.log('✅ Database tables created successfully!')
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
