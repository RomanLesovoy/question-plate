import * as crypto from 'crypto';

// Secret key should be stored in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-secret-key-32-chars-long!!!';
const IV_LENGTH = 16; // For AES, this is always 16

export const hashAnswer = (answer: string): string => {
  // Generate random initialization vector
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Create cipher with key and iv
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  
  // Encrypt the answer
  let encrypted = cipher.update(answer, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return iv + encrypted (iv needed for decryption)
  return iv.toString('hex') + ':' + encrypted;
};

export const decryptAnswer = (hashedAnswer: string): string => {
  const [ivHex, encrypted] = hashedAnswer.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

export const compareAnswer = (answer: string, hashedAnswer: string): boolean => {
  try {
    const decrypted = decryptAnswer(hashedAnswer);
    
    return decrypted === answer;
  } catch (error) {
    return false;
  }
};
