import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const Secret: string = process.env.JWT_SECRET || 'hemlig-dumlechoklad-3215'

export function createToken(userId: string) {
    return jwt.sign({ userId }, Secret, { expiresIn: '1h'})
}