
"use client";

import { useState } from "react";
import { Button } from "flowbite-react";
import { crypt, generateKeys } from "@/ciphers/rsa";
import DSTextField from "@/components/DSTextField";
import { KetuaProgramStudi } from "@prisma/client";
import DSSelect from "@/components/DSSelect";
import toast from "react-hot-toast";

type ResponseType = {
  [key: string]: string;
};

export default function GenerateKeyForm({
  kaprodi,
}: {
  kaprodi: ResponseType;
}) {
  const [bits, setBits] = useState(256);
  const [kaprodiId, setKaprodiId] = useState<number>(0);
  const [publicKey, setPublicKey] = useState({ e: BigInt(0), n: BigInt(0) });
  const [privateKey, setPrivateKey] = useState<BigInt>(BigInt(0));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const keys = generateKeys(bits);
    setPublicKey({ e: keys.publicKey[0], n: keys.publicKey[1] });
    setPrivateKey(keys.privateKey);
  };

  const handleSaveKey = async () => {
    const loadingToast = toast.loading("Submitting data...");
    try {
      const primeNumber = publicKey.n.toString();
      const publicKeyString = publicKey.e.toString();
      const privateKeyString = privateKey.toString();

      const response = await fetch(`/api/encrypted/${kaprodiId}`, {
        method: "PATCH",
        body: JSON.stringify({
          primeNumber,
          publicKeyString,
          privateKeyString,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      toast.success(result.message, { id: loadingToast });

      // empty state
      setBits(256);
      setKaprodiId(0);
      setPublicKey({ e: BigInt(0), n: BigInt(0) });
      setPrivateKey(BigInt(0));
    } catch (error) {
      toast.error("Failed to submit data", { id: loadingToast });
      console.error("Error saving key:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <DSSelect
          id="bits"
          options={kaprodi}
          onChange={(e) => setKaprodiId(parseInt(e.target.value))}
          placeholder="Pilih Ketua Program Studi"
          required
        />
        <DSTextField
          id="bits"
          type="number"
          value={bits}
          onChange={(e) => setBits(parseInt(e.target.value))}
          placeholder="Enter number of bits"
          required
          min={256}
          max={4096}
        />
        <Button type="submit">Generate Key</Button>
      </form>
      <div>
        <div className="mt-8">
          <p>
            <b>Public key generated:</b>
          </p>
          <div className="mt-2">
            <p>e :</p>
            <p className="break-words whitespace-pre-wrap bg-gray-100 p-2 rounded border border-gray-300 text-black">
              {publicKey.e.toString()}
            </p>
          </div>
          <div className="mt-2">
            <p>n :</p>
            <p className="break-words whitespace-pre-wrap bg-gray-100 p-2 rounded border border-gray-300 text-black">
              {publicKey.n.toString()}
            </p>
          </div>
        </div>
        <div className="mt-8">
          <p>
            <b>Private key generated:</b>
          </p>
          <div className="mt-2">
            <p>d :</p>
            <p className="break-words whitespace-pre-wrap bg-gray-100 p-2 rounded border border-gray-300 text-black">
              {privateKey?.toString()}
            </p>
          </div>
        </div>
        <Button type="submit" onClick={handleSaveKey} className="mt-4">
          Save Key
        </Button>
      </div>
    </div>
  );
}