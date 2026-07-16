import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

async function migrate() {
  const client = await pool.connect()
  
  try {
    console.log('Adding password column to account table...')
    
    // Check if column exists first
    const columnCheck = await client.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = 'account' AND column_name = 'password'`
    )
    
    if (columnCheck.rows.length === 0) {
      // Add password column
      await client.query(
        `ALTER TABLE "account" ADD COLUMN "password" text DEFAULT NULL`
      )
      console.log('✅ Password column added to account table')
    } else {
      console.log('ℹ️ Password column already exists')
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

migrate()
