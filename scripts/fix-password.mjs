import pg from 'pg'
import { hashPassword } from 'better-auth/crypto'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const client = await pool.connect()

try {
  // Add password column if it doesn't exist
  try {
    await client.query(`
      ALTER TABLE "account"
      ADD COLUMN "password" text DEFAULT NULL
    `)
    console.log('✅ Password column added')
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('ℹ️ Password column already exists')
    } else {
      throw e
    }
  }

  // Update the password for the existing account
  const hashedPassword = await hashPassword('Blevh4np1@@')
  const result = await client.query(
    `UPDATE "account" 
     SET "password" = $1 
     WHERE "providerAccountId" = $2 AND "provider" = $3`,
    [hashedPassword, 'info@mk-emotorsdornach.ch', 'credential']
  )
  
  console.log(`✅ Password updated for ${result.rowCount} account(s)`)
} finally {
  client.release()
  await pool.end()
}
