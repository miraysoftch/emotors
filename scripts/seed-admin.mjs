import pg from 'pg'
import { hashPassword } from 'better-auth/crypto'
import crypto from 'crypto'

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log('🌱 Seeding admin user...')

    const client = await pool.connect()

    try {
      // Create admin user
      const hashedPassword = await hashPassword('Blevh4np1@@')

      // Check if user already exists
      const userResult = await client.query(
        `SELECT id FROM "user" WHERE email = $1`,
        ['info@mk-emotorsdornach.ch']
      )

      let adminId
      if (userResult.rows.length > 0) {
        adminId = userResult.rows[0].id
        console.log('ℹ️ Admin user already exists')
      } else {
        adminId = crypto.randomUUID()
        // Insert user
        await client.query(
          `INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            adminId,
            'Admin',
            'info@mk-emotorsdornach.ch',
            true,
            new Date(),
            new Date(),
          ]
        )
      }

      const accountId = crypto.randomUUID()

      // Insert account with password (add password field if it doesn't exist)
      try {
        await client.query(
          `INSERT INTO "account" (id, "userId", type, provider, "providerAccountId", password, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT DO NOTHING`,
          [
            accountId,
            adminId,
            'email',
            'credential',
            'info@mk-emotorsdornach.ch',
            hashedPassword,
            new Date(),
            new Date(),
          ]
        )
      } catch (error) {
        if (error.message.includes('column "password" of relation "account" does not exist')) {
          console.log('⚠️ Adding password column to account table...')
          await client.query(`ALTER TABLE "account" ADD COLUMN "password" text`)
          
          // Retry insert
          await client.query(
            `INSERT INTO "account" (id, "userId", type, provider, "providerAccountId", password, "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              accountId,
              adminId,
              'email',
              'credential',
              'info@mk-emotorsdornach.ch',
              hashedPassword,
              new Date(),
              new Date(),
            ]
          )
        } else {
          throw error
        }
      }

      console.log('✅ Admin user seeded successfully!')
      console.log('')
      console.log('Admin credentials:')
      console.log('Email: info@mk-emotorsdornach.ch')
      console.log('Password: Blevh4np1@@')
      console.log('')
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

seed()
