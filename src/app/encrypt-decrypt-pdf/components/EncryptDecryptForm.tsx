"use client"
import React, { useState } from "react";
import { Button, Label } from "flowbite-react";
import { FileInput } from "flowbite-react";
import { decrypt, encrypt } from "@/ciphers/aes";

export default function EncryptDecryptForm() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleEncryption = async () => {
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const encryptedBuffer = encrypt(buffer);
      downloadFile(encryptedBuffer, `encrypted_${file.name}.pdf`);
      console.log('File encrypted successfully');
    } catch (error) {
      console.error('Encryption error:', error);
    }
  };

  const handleDecryption = async () => {
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const decryptedBuffer = decrypt(buffer);
      downloadFile(decryptedBuffer, `decrypted_${file.name}.pdf`);
      console.log('File decrypted successfully');
    } catch (error) {
      console.error('Decryption error:', error);
    }
  };

  const downloadFile = (buffer: Buffer, fileName: string) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setFile(null);
  };

  return (
    <>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="file-upload" value="Upload file" className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl pr-3" />
        </div>
        <FileInput id="file-upload" accept="application/pdf" onChange={handleFileChange} />
      </div>
      <div className="grid grid-cols-2 space-x-3 mt-4">
        <Button onClick={handleEncryption}>Encrypt</Button>
        <Button color="failure" onClick={handleDecryption}>Decrypt</Button>
      </div>
    </>
  );
}