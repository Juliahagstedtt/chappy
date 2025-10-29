import jwt from 'jsonwebtoken'

const Secret: string = process.env.JWT_SECRET || 'hemlig-dumlechoklad-3215'

export function createToken(userId: string) {
    return jwt.sign({ userId }, Secret, { expiresIn: '1h'})
}