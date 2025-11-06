import jwt from 'jsonwebtoken'
import { string, success } from 'zod'
import { payloadSchema, type Payload } from './types.js'

// Secret används för att skapa och verifiera jwt
const Secret: string = process.env.JWT_SECRET || 'hemlig-dumlechoklad-3215'

// Skapar en jwt för en användare med userId
export function createToken(userId: string) {
    // jwt innehåller userId och går ut efter 1 timme
    return jwt.sign({ userId }, Secret, { expiresIn: '1h'})
}

// Verifierar en jwt och returnerar payload
export function verifyToken(token: string) {
    // Kontrollera att token är giltig
    // const payload: Payload = jwt.verify(token, Secret) as Payload // TODO byt ut mot zod
    const payload = jwt.verify(token, Secret);

    const parsed = payloadSchema.safeParse(payload);


    // Om payload inte är ett objekt eller null är token ogiltig
    if(!parsed.success) {
        throw new Error('Ogiltig token')
    }
    

    // returnerar payload, innehåller info om användaren
    return parsed.data;
}