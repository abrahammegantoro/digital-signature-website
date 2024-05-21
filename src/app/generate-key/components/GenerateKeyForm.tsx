"use client";
import { Button, Checkbox, Label, Select, TextInput } from "flowbite-react";
import { generateKeys } from "@/ciphers/rsa";
import { useState } from "react";

export default function GenerateKeyForm() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const keys = generateKeys(256); 
        console.log(keys);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Button type="submit">Generate Key</Button>
            </form>
        </div>
    );
}