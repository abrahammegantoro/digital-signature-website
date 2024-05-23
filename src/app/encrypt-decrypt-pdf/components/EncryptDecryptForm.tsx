"use client";

import { Button } from "flowbite-react";
import React, { useState } from "react";
import ClientFileInput from './ClientFileInput';
import { encryptData, decryptData } from '@/ciphers/aes';

export default function EncryptDecryptForm() {
  const [encryptedData, setEncryptedData] = useState<{ iv: Uint8Array; encryptedData: ArrayBuffer } | null>(null);

  const handleEncryption = () => {
    // Handle encryption here
  }

  const handleDecryption = () => {
    // Handle decryption here
  }

  return (
    <div>
      <form>
      <h3>Encryption</h3>
      <ClientFileInput onFileRead={handleEncryption} purpose="encrypt" />
      <Button type="button" className="mt-4" disabled={!encryptedData}>Encrypt PDF</Button> {/* Uncomment if you want automatic download */}
      <h3>Decryption</h3>
      <Button type="button" className="mt-4" disabled={!encryptedData} onClick={handleDecryption}>Decrypt PDF</Button>
      </form>
    </div>
  );
}
