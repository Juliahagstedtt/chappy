import type { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyToken } from "../data/Jwt.js";

// Sparar info om användaren
export interface AuthRequest extends Request {
  user: { userId: string } | null;
}

// Logger
const logger: RequestHandler = (req, _res, next) => {
  console.log(`${req.method}  ${req.url}`);
  next();
};

// Kollar om användaren är inloggad
export const checkLogin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization; // Hämtar token från headers

  if (!authHeader) {
    req.user = null; // inte inloggad
    return next(); 
  }

// Hämtar och plockar ut token för att verifiera användaren
    const token = authHeader.split(" ")[1];

// Om ingen tonken finns = blir man gäst
  if (!token) {
    req.user = null;
    return res.sendStatus(401); // Returnera 401 om token saknas
  }

  try {
    // Kolla att token är giltig

    // TODO: fixa payload
    const payload = verifyToken(token); 
    req.user = { userId: payload.userId };
    
  } catch {
    // Om token är ogiltig = gäst
    req.user = null;
  }


  next();
};