"use client";

import { Button } from "flowbite-react";
import React, { useState } from "react";
import ClientFileInput from './ClientFileInput';
import { encryptFile, decryptFile } from '@/ciphers/aes';

export default function EncryptDecryptForm() {

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
