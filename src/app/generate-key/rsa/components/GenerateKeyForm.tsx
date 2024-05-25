"use client";

import { useState } from "react";
import { Button } from "flowbite-react";
import DSTextField from "@/components/DSTextField";
import toast from "react-hot-toast";

type ResponseType = {
  [key: string]: string;
};

export default function GenerateKeyForm() {
  const [rc4Key, setRc4Key] = useState<String>("");
  const [vigenereKey, setVigenereKey] = useState<String>("");

  const handleSaveKey = async () => {
    const loadingToast = toast.loading("Submitting data...");
    try {
      const response = await fetch(`/api/encrypted/${0}`, {
        method: "PATCH",
        body: JSON.stringify({
          publicKeyString: rc4Key,
          privateKeyString: vigenereKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      toast.success(result.message, { id: loadingToast });

      setRc4Key("");
      setVigenereKey("");
    } catch (error) {
      toast.error("Failed to submit data", { id: loadingToast });
      console.error("Error saving key:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSaveKey}>
        <DSTextField
          id="RC4Key"
          label="RC4 Key"
          value={rc4Key as string}
          onChange={(e) => setRc4Key(e.target.value)}
          placeholder="Enter RC4 Key"
          required
        />
        <DSTextField
          id="vigenereKey"
          label="Vigenere Key"
          value={vigenereKey as string}
          onChange={(e) => setVigenereKey(e.target.value)}
          placeholder="Enter Vigenere Key"
          required
        />
        <Button type="submit">Generate Key</Button>
      </form>
    </div>
  );
}
