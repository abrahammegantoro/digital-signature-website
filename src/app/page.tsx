import DSTextField from "@/components/DSTextField";
import { Button } from "flowbite-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 space-x-3">
        <DSTextField label="Name" name="name" />
        <DSTextField label="Name" name="name" />
      </div>
      <Button>Click me</Button>
    </div>
  );
}
