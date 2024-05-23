"use client";

import React, { useState } from "react";
import ClientFileInput from './ClientFileInput';
import { Button } from "flowbite-react";
import { encryptFile, decryptFile } from '@/ciphers/aes';

export default function EncryptDecryptForm() {
  const [fileToEncrypt, setFileToEncrypt] = useState(null);
  const [fileToDecrypt, setFileToDecrypt] = useState(null);

  const handleFileToEncryptChange = (file) => {
    setFileToEncrypt(file);
  };

  const handleFileToDecryptChange = (file) => {
    setFileToDecrypt(file);
  };

  const handleEncryption = async () => {
    if (!fileToEncrypt) return;
    try {
      const encryptedFilePath = './src/ciphers/encrypted_file.pdf';
      await encryptFile(fileToEncrypt, encryptedFilePath);
      console.log('File encrypted successfully');

      // Trigger download of encrypted file
      downloadFile(encryptedFilePath);
    } catch (error) {
      console.error('Encryption error:', error);
    }
  };

  const handleDecryption = async () => {
    if (!fileToDecrypt) return;
    try {
      const decryptedFilePath = './src/ciphers/decrypted_file.pdf';
      await decryptFile(fileToDecrypt, decryptedFilePath);
      console.log('File decrypted successfully');

      // Trigger download of decrypted file
      downloadFile(decryptedFilePath);
    } catch (error) {
      console.error('Decryption error:', error);
    }
  };

  const downloadFile = (filePath) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
