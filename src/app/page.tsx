import DSTextField from "@/components/DSTextField";
import { Button } from "flowbite-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white h-screen">
      <div className="grid grid-cols-2">
        <DSTextField label="Name" name="name" />
        <DSTextField label="Name" name="name" />
      </div>
      <Button>Click me</Button>
    </div>
  );
}
