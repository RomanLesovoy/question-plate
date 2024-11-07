import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const algorithm = 'aes-256-cbc';
const key = scryptSync(process.env.JWT_SECRET || 'your-secret-key', 'salt', 32);
const iv = randomBytes(16);

export function hashAnswer(text: string): string {
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptAnswer(hash: string): string {
  const [ivHex, encryptedHex] = hash.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = createDecipheriv(algorithm, key, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString();
}

export function compareAnswer(answer: string, hash: string): boolean {
  try {
    const decrypted = decryptAnswer(hash);
    return answer.toLowerCase() === decrypted.toLowerCase();
  } catch (e) {
    console.error('Error comparing answers:', e);
    return false;
  }
}
