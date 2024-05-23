import React, { useState } from "react";

export default function ClientFileInput(props: { onFileRead: (byteArray: Uint8Array) => void; purpose: "encrypt" | "decrypt" }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (props.purpose === "encrypt" && file.type !== "application/pdf") {
        alert("Please select a PDF file for encryption!");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const content = reader.result;
          const byteArray = new Uint8Array(content as ArrayBuffer);
          props.onFileRead(byteArray);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" className="mt-4" onChange={handleFileUpload} />
    </div>
  );
}
