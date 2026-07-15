import { db, getPool } from '@/lib/db'
import { user, account } from '@/lib/db/schema'
import { hash } from 'better-auth/crypto'
import crypto from 'crypto'

async function seed() {
  try {
    console.log('🌱 Seeding database...')

    // Create admin user
    const adminId = crypto.randomUUID()
    const hashedPassword = await hash('Blevh4np1@@')

    // Insert user
    await db.insert(user).values({
      id: adminId,
      name: 'Admin',
      email: 'info@mk-emotorsdornach.ch',
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Insert account with hashed password for email/password authentication
    await db.insert(account).values({
      id: crypto.randomUUID(),
      userId: adminId,
      type: 'email',
      provider: 'credential',
      providerAccountId: 'info@mk-emotorsdornach.ch',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log('✅ Database seeded successfully!')
    console.log('')
    console.log('Admin credentials:')
    console.log('Email: info@mk-emotorsdornach.ch')
    console.log('Password: Blevh4np1@@')
    console.log('')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    const pool = getPool()
    if (pool) await pool.end()
  }
}

seed()
