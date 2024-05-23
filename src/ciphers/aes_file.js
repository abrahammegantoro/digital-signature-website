import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
let key = process.env.NEXT_PUBLIC_RC4_KEY;

key = crypto.createHash('sha256').update(String(key)).digest().slice(0, 32);

const encrypt = (buffer) => {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    return Buffer.concat([iv, encrypted]);
}

const decrypt = (encrypted) => {
    const iv = encrypted.slice(0, 16);
    const data = encrypted.slice(16); 
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    return Buffer.concat([decipher.update(data), decipher.final()]);
}

export function encryptFile(fileData) {
    try {
        const encryptedFile = encrypt(fileData);
        return encryptedFile;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export function decryptFile(encryptedData) {
    try {
        const decryptedFile = decrypt(encryptedData);
        return decryptedFile;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

// Example usage
// In your React component:
// const handleEncrypt = () => {
//     const fileInput = document.getElementById('fileInput');
//     const file = fileInput.files[0];
//     const reader = new FileReader();
//     reader.onload = () => {
//         const encryptedData = encryptFile(reader.result);
//         // Use encryptedData as needed, e.g., send it to server, display it, etc.
//     };
//     reader.readAsArrayBuffer(file);
// };

// const handleDecrypt = () => {
//     const fileInput = document.getElementById('fileInput');
//     const file = fileInput.files[0];
//     const reader = new FileReader();
//     reader.onload = () => {
//         const decryptedData = decryptFile(reader.result);
//         // Use decryptedData as needed, e.g., display it, save it locally, etc.
//     };
//     reader.readAsArrayBuffer(file);
// };

// Example usage in JSX:
// <input type="file" id="fileInput" />
// <button onClick={handleEncrypt}>Encrypt</button>
// <button onClick={handleDecrypt}>Decrypt</button>
