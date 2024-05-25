import crypto from 'crypto';
// import fs from 'fs/promises';

const algorithm = 'aes-256-ctr';

export const encrypt = (buffer, key) => {
    const finalKey = crypto.createHash('sha256').update(String(key)).digest().slice(0, 32);

    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(algorithm, finalKey, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    return Buffer.concat([iv, encrypted]);
}

export const decrypt = (encrypted, key) => {
    const finalKey = crypto.createHash('sha256').update(String(key)).digest().slice(0, 32);

    const iv = encrypted.slice(0, 16);
    const data = encrypted.slice(16); 
    const decipher = crypto.createDecipheriv(algorithm, finalKey, iv);
    return Buffer.concat([decipher.update(data), decipher.final()]);
}

// FUNCTION TO ENCRYPT FILE
// export async function encryptFile(inputPath, outputPath) {
//     try {
//         const file = await fs.readFile(inputPath);
//         const encryptedFile = encrypt(file);
//         await fs.writeFile(outputPath, encryptedFile);
//         console.log('File encrypted');
//     } catch (err) {
//         console.error(err.message);
//     }
// }

// // FUNCTION TO DECRYPT FILE
// export async function decryptFile(inputPath, outputPath) {
//     try {
//         const encryptedData = await fs.readFile(inputPath);
//         const decryptedFile = decrypt(encryptedData);
//         await fs.writeFile(outputPath, decryptedFile);
//         console.log('File decrypted');
//     } catch (err) {
//         console.error(err.message);
//     }
// }

// // Example usage
// encryptFile('./src/ciphers/bundel.pdf', './src/ciphers/cipher_bundel.pdf');
// decryptFile('./src/ciphers/cipher_bundel.pdf', './src/ciphers/decipher_bundel.pdf');