import { hashPassword } from 'better-auth/crypto'

const password = 'Blevh4np1@@'
const hashed = await hashPassword(password)
console.log('Hashed password:', hashed)
