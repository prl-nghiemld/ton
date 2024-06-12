import 'dotenv/config'

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI required')
export const MONGODB_URI = process.env.MONGODB_URI

if (!process.env.MNEMONICS) throw new Error('MONGODB_URI required')
export const MNEMONICS = process.env.MNEMONICS.split(' ')
    