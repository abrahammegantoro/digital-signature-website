import crypto from 'crypto';
import fs from 'fs/promises';

const algorithm = 'aes-256-ctr';
let key = 'TEST KEY';

// Generate a 256-bit key from the provided key string
key = crypto.createHash('sha256').update(String(key)).digest().slice(0, 32);

// ENCRYPT FUNCTION
const encrypt = (buffer) => {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);

    return result;
}

// DECRYPT FUNCTION
const decrypt = (encrypted) => {
    const iv = encrypted.slice(0, 16); // Extract the IV from the beginning
    encrypted = encrypted.slice(16); // The rest is the ciphertext
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    return result;
}

// FUNCTION TO ENCRYPT FILE
const encryptFile = async (inputPath, outputPath) => {
    try {
        const file = await fs.readFile(inputPath);
        const encryptedFile = encrypt(file);
        await fs.writeFile(outputPath, encryptedFile);
        console.log('File encrypted');
    } catch (err) {
        console.error(err.message);
    }
};

// FUNCTION TO DECRYPT FILE
const decryptFile = async (inputPath, outputPath) => {
    try {
        const encryptedData = await fs.readFile(inputPath);
        const decryptedFile = decrypt(encryptedData);
        await fs.writeFile(outputPath, decryptedFile);
        console.log('File decrypted');
    } catch (err) {
        console.error(err.message);
    }
};

// Example usage
// encryptFile('./src/ciphers/bundel.pdf', './src/ciphers/cipher_bundel.pdf');
// decryptFile('./src/ciphers/cipher_bundel.pdf', './src/ciphers/decipher_bundel.pdf');