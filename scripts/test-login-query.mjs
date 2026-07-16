import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

async function testLogin() {
  try {
    // Step 1: Find user by email
    const userResult = await pool.query(
      'SELECT id FROM "user" WHERE LOWER(email) = LOWER($1)',
      ['testuser@example.com']
    )

    console.log('User query result:', userResult.rows)

    if (userResult.rows.length === 0) {
      console.log('User not found')
      return
    }

    const user = userResult.rows[0]
    console.log('User ID:', user.id)

    // Step 2: Find account with password
    const accountResult = await pool.query(
      'SELECT password FROM "account" WHERE "userId" = $1 AND provider = $2',
      [user.id, 'credential']
    )

    console.log('Account query result:', accountResult.rows)
    console.log('Account rows count:', accountResult.rows.length)

    if (accountResult.rows.length > 0) {
      const account = accountResult.rows[0]
      console.log('Password exists?', !!account.password)
      console.log('Password value:', account.password)
    }
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await pool.end()
  }
}

testLogin()
