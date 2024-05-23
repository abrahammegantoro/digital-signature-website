import React from 'react';

export default function ClientFileInput({ onFileChange }: { onFileChange: (file: File) => void }) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <input type="file" onChange={handleFileChange} />
  );
}
