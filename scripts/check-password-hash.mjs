import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

try {
  const result = await pool.query(
    `SELECT u.email, a.password FROM "user" u
     JOIN "account" a ON u.id = a."userId"
     WHERE LOWER(u.email) = LOWER($1)
     AND a.provider = $2`,
    ['max@mustermann.de', 'credential']
  )

  if (result.rows.length === 0) {
    console.log('User not found')
  } else {
    const row = result.rows[0]
    console.log('Email:', row.email)
    console.log('Password hash:', row.password)
    console.log('Hash length:', row.password ? row.password.length : 0)
  }
} catch (err) {
  console.error('Error:', err.message)
} finally {
  await pool.end()
  process.exit(0)
}
