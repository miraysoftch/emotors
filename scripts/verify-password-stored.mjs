import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

async function checkPasswords() {
  try {
    const result = await pool.query(
      `SELECT u.email, u.id, a.password, a."providerAccountId"
       FROM "user" u
       LEFT JOIN "account" a ON u.id = a."userId"
       ORDER BY u."createdAt" DESC
       LIMIT 10`
    )

    console.log('Users ve passwordleri:')
    console.log(JSON.stringify(result.rows, null, 2))

    if (result.rows.length > 0) {
      const firstUser = result.rows[0]
      console.log('\nSon kullanıcı:', firstUser.email)
      console.log('Password hash var mı?', !!firstUser.password)
      console.log('Password hash length:', firstUser.password?.length || 0)
    }
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await pool.end()
  }
}

checkPasswords()
