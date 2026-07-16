import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

async function clean() {
  const client = await pool.connect()
  
  try {
    console.log('Cleaning up test user data...')
    
    // Delete test email addresses
    await client.query(
      `DELETE FROM "user" WHERE email LIKE $1 OR email LIKE $2`,
      ['%@test%', '%example%']
    )
    
    console.log('✅ Test data cleaned')
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message)
  } finally {
    client.release()
    await pool.end()
  }
}

clean()
