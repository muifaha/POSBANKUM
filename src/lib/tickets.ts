import { randomInt } from "crypto";
import { hashPassword, verifyPassword } from "./auth/password";

// Karakter yang tidak membingungkan (tanpa 0, O, 1, I, L)
const CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generateTicketCode(): string {
  let result = "LP-";
  for (let i = 0; i < 8; i++) {
    result += CHARS.charAt(randomInt(0, CHARS.length));
  }
  return result;
}

export function generatePin(): string {
  return String(randomInt(100000, 999999));
}

export function hashPin(pin: string): string {
  return hashPassword(pin);
}

export function verifyPin(pin: string, hash: string): boolean {
  return verifyPassword(pin, hash);
}
