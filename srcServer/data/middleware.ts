import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../data/Jwt.js";

// Sparar info om användaren
export interface AuthRequest extends Request {
    user?: {
    userId: string; } | null;
}

// Kollar om användaren är inloggad
export const checkLogin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization; // Hämtar token från headers

  if (!authHeader) {
    req.user = null; // inte inloggad
    return next(); 
  }

  const token = authHeader.startsWith("Bearer ")
  ? authHeader.split(" ")[1]
  : authHeader;

// Om ingen tonken finns = blir man gäst
  if (!token) {
    req.user = null;
    return res.sendStatus(401); // Returnera 401 om token saknas
  }

  try {

    const payload = verifyToken(token); 
    req.user = { userId: payload.userId };
    
  } catch {
      return res.sendStatus(401); 
  }


  next();
};