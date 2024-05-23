import React from 'react';

export default function ClientFileInput({ onFileChange }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <input type="file" onChange={handleFileChange} />
  );
}
