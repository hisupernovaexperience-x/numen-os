import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

// Hash constante usada para comparar cuando el usuario no existe, así el tiempo de
// respuesta no revela si un email está registrado (mitiga user enumeration por timing).
const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEeOxjb7c6d0m0e0h1c4Xr9y1B8YbT8N1Zi";

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, hash: string | null): Promise<boolean> {
  return bcrypt.compare(password, hash ?? DUMMY_HASH);
}
