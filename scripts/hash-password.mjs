import { hash } from 'better-auth/crypto'

const password = 'Blevh4np1@@'
const hashed = await hash(password)
console.log('Hashed password:', hashed)
