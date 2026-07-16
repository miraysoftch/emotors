import crypto from 'crypto'

const PBKDF2_ITERATIONS = 210000

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, hash) {
  const [salt, original] = hash.split(':')
  if (!salt || !original) {
    console.log('Invalid hash format - missing salt or original')
    return false
  }
  const newHash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 64, 'sha512').toString('hex')
  const expected = Buffer.from(original, 'hex')
  const actual = Buffer.from(newHash, 'hex')
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
}

// Test
const password = 'TestPass123'
const hash = hashPassword(password)
console.log('Password:', password)
console.log('Hash:', hash)
console.log('Verify result:', verifyPassword(password, hash))
console.log('Wrong password:', verifyPassword('WrongPass123', hash))

// Test with DB hash
const dbHash = '19d2057bf2075e30ba5d3001ab8a545c:d01202d16bae18d5e17f437d228a9ac4637b3d455fba4c4478dd0c213ff921b8f6d68cd9b3687bc7324ff5874b206d4b7d52c91f40b08a7cf90479b45150e157'
console.log('\nDB Hash:', dbHash)
console.log('Verify with TestPass123:', verifyPassword('TestPass123', dbHash))
