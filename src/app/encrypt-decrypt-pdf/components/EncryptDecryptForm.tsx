'use client';

import React, { useState } from 'react';
import { encryptFile, decryptFile } from '@/ciphers/aes_file';
import { Button } from 'flowbite-react';

const FileEncryptDecrypt = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [encryptedData, setEncryptedData] = useState(null);

  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleEncryptDecrypt = async () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target.result;
        if (encryptedData) {
          const decryptedData = decryptFile(encryptedData);
          setEncryptedData(null); // Clear encrypted data for decryption
          prepareDownload(decryptedData, selectedFile.name);
        } else {
          const encryptedFile = encryptFile(fileData);
          setEncryptedData(encryptedFile);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
      console.log('Selected file:', selectedFile);
    } else {
      alert('Please select a file');
    }
  };

  const prepareDownload = (data, fileName) => {
    const blob = new Blob([data], { type: selectedFile.type });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName + (encryptedData ? '.encrypted' : '');
    downloadLink.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <h1>File Encryption/Decryption</h1>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleEncryptDecrypt}>
        {encryptedData ? 'Decrypt' : 'Encrypt'}
      </button>
      {encryptedData && <button onClick={() => prepareDownload(encryptedData, selectedFile.name)}>Download</button>}
    </div>
  );
}

export default FileEncryptDecrypt;
