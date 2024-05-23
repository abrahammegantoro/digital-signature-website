// MODIFIED RC4
// Message is encrypted using Extended Vigenere first and then RC4, and decrypted vice-versa

// EXTENDED VIGENERE
function extendedVigenereEncrypt(plain, key) {
    const result = [];
    for (let i = 0; i < plain.length; i++) {
        result.push(String.fromCharCode((plain.charCodeAt(i) + key.charCodeAt(i % key.length)) % 256));
    }
    return result.join('');
}

function extendedVigenereDecrypt(cipher, key) {
    const result = [];
    for (let i = 0; i < cipher.length; i++) {
        result.push(String.fromCharCode((cipher.charCodeAt(i) - key.charCodeAt(i % key.length) + 256) % 256));
    }
    return result.join('');
}

// RC4
function ksa(key) {
    const s = Array.from({ length: 256 }, (_, index) => index);
    let j = 0;

    for (let i = 0; i < 256; i++) {
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
        [s[i], s[j]] = [s[j], s[i]];
    }

    return s;
}

function prga(s, data) {
    const result = [];
    let i = 0;
    let j = 0;

    for (let k = 0; k < data.length; k++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        [s[i], s[j]] = [s[j], s[i]]; // Swap s[i] and s[j]
        const t = s[(s[i] + s[j]) % 256];
        const cipherChar = String.fromCharCode(data.charCodeAt(k) ^ t);
        result.push(cipherChar);
    }

    return result.join('');
}

function rc4Encrypt(plainText, key) {
    const s = ksa(key);
    return prga(s, plainText);
}

function rc4Decrypt(cipherText, key) {
    const s = ksa(key);
    return prga(s, cipherText);
}

export function modifiedRC4Encrypt(plainText, vigenereKey, rc4Key) {
    const vigenereEncrypted = extendedVigenereEncrypt(plainText, vigenereKey);
    const rc4Encrypted = rc4Encrypt(vigenereEncrypted, rc4Key);
    return rc4Encrypted;
}

export function modifiedRC4Decrypt(cipherText, vigenereKey, rc4Key) {
    const rc4Decrypted = rc4Decrypt(cipherText, rc4Key);
    const vigenereDecrypted = extendedVigenereDecrypt(rc4Decrypted, vigenereKey);
    return vigenereDecrypted;
}

// EXAMPLE USAGE
// const vigenereKey = "SECRET";
// const rc4Key = "12345";
// const plainText = "Hello, this is a test message!";

// const encrypted = combinedEncrypt(plainText, vigenereKey, rc4Key);
// console.log("Encrypted:", encrypted);

// const decrypted = combinedDecrypt(encrypted, vigenereKey, rc4Key);
// console.log("Decrypted:", decrypted);
