"use client";

import { useState } from "react";
import { Button } from "flowbite-react";
import { generateKeys } from "@/ciphers/rsa";
import DSTextField from "@/components/DSTextField";

export default function GenerateKeyForm() {
    const [bits, setBits] = useState(256);
    const [publicKey, setPublicKey] = useState({ e: BigInt(0), n: BigInt(0) });
    const [privateKey, setPrivateKey] = useState<number>(0);

    // Define the handler for form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        const keys = generateKeys(bits);
        setPublicKey({ e: keys.publicKey[0], n: keys.publicKey[1] });
        setPrivateKey(keys.privateKey);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
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
                    <p><b>Public key generated:</b></p>
                    <div className="mt-2">
                        <p>e:</p>
                        <p className="break-words whitespace-pre-wrap bg-gray-100 p-2 rounded border border-gray-300">
                            {publicKey.e.toString()}
                        </p>
                    </div>
                    <div className="mt-2">
                        <p>n:</p>
                        <p className="break-words whitespace-pre-wrap bg-gray-100 p-2 rounded border border-gray-300">
                            {publicKey.n.toString()}
                        </p>
                    </div>
                </div>
                <div className="mt-8">
                    <p><b>Private key generated:</b></p>
                    <div className="mt-2">
                        <p>d:</p>
                        <p className="break-words whitespace-pre-wrap bg-gray-100 p-2 rounded border border-gray-300">
                            {privateKey?.toString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
