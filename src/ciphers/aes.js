async function getKeyMaterial(passphrase) {
    const encoder = new TextEncoder();
    return crypto.subtle.importKey(
        "raw",
        encoder.encode(passphrase),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
  }

async function deriveKey(keyMaterial, salt) {
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
}
  
export async function generateAESKeyFromPassphrase(passphrase) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await getKeyMaterial(passphrase);
    const aesKey = await deriveKey(keyMaterial, salt);
    return { aesKey, salt };
}

export async function encryptData(aesKey, data) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "AES-GCM"
        },
        aesKey,
        data
    );
    return { iv, encryptedData };
}

export async function decryptData(aesKey, encryptedData) {
    return crypto.subtle.decrypt(
        {
            name: "AES-GCM"
        },
        aesKey,
        encryptedData
    );
}

// Example usage
async function main() {
    const passphrase = "your-secret-passphrase";
    const dataToEncrypt = "Hello, world!"; // Example data to encrypt
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataToEncrypt);

    // Generate AES key from passphrase
    const { aesKey, salt } = await generateAESKeyFromPassphrase(passphrase);

    // Encrypt data
    const { iv, encryptedData } = await encryptData(aesKey, dataBuffer);
    console.log('Encrypted Data:', new Uint8Array(encryptedData));

    // Decrypt data
    const decryptedDataBuffer = await decryptData(aesKey, encryptedData, iv);
    const decoder = new TextDecoder();
    const decryptedData = decoder.decode(decryptedDataBuffer);
    console.log('Decrypted Data:', decryptedData);
}

// main();
  