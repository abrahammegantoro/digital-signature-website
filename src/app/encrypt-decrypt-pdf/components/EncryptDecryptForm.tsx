"use client";

import { Button } from "flowbite-react";
import React, { useState } from "react";
import ClientFileInput from './ClientFileInput';
import { encryptData, decryptData, generateAESKeyFromPassphrase } from '@/ciphers/aes';

export default function EncryptDecryptForm() {
  const [fileToEncrypt, setFileToEncrypt] = useState<File | null>(null);
  const [fileToDecrypt, setFileToDecrypt] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string | null>(null); // New state for storing file type
  const [aesKey, setAesKey] = useState<CryptoKey | null>(null);
  const passphrase = "your-secret-passphrase"; // Use a static passphrase or get it from user input

  const handleFileRead = async (file, purpose) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;

      const { aesKey, salt } = await generateAESKeyFromPassphrase(passphrase);
      setAesKey(aesKey);

      if (purpose === "encrypt") {
        // Encrypt data
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const { encryptedData } = await encryptData(aesKey, arrayBuffer, iv);
        
        // Create a Blob from the encrypted data and trigger a download
        const blob = new Blob([iv, new Uint8Array(encryptedData)], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "encrypted_file.bin";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else if (purpose === "decrypt") {
        const iv = new Uint8Array(arrayBuffer.slice(0, 12));
        const encryptedContent = arrayBuffer.slice(12);
        // Decrypt data
        const decryptedDataBuffer = await decryptData(aesKey, encryptedContent, iv);
        
        // Create a Blob from the decrypted data and trigger a download
        const blob = new Blob([decryptedDataBuffer], { type: fileType || "application/octet-stream" }); // Use the original file type
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `decrypted_file.${fileType ? fileType.split('/')[1] : 'bin'}`; // Use appropriate file extension
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleEncryption = () => {
    if (fileToEncrypt) {
      handleFileRead(fileToEncrypt, "encrypt");
    } else {
      alert('Please select a file to encrypt.');
    }
  };

  const handleDecryption = () => {
    if (fileToDecrypt) {
      handleFileRead(fileToDecrypt, "decrypt");
    } else {
      alert('Please select a file to decrypt.');
    }
  };

  const handleFileToEncryptChange = (file) => {
    setFileToEncrypt(file);
    setFileType(file.type); // Store the original file type
  };

  const handleFileToDecryptChange = (file) => {
    setFileToDecrypt(file);
    setFileType(file.type); // Store the original file type (assuming it's the same type as the original file)
  };

  return (
    <div>
      <form>
        <h3>Encryption</h3>
        <ClientFileInput onFileChange={handleFileToEncryptChange} />
        <Button type="button" className="mt-4" onClick={handleEncryption}>Encrypt PDF</Button>
        
        <h3>Decryption</h3>
        <ClientFileInput onFileChange={handleFileToDecryptChange} />
        <Button type="button" className="mt-4" onClick={handleDecryption}>Decrypt PDF</Button>
      </form>
    </div>
  );
}
