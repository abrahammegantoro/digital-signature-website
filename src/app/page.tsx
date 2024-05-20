"use client"
import DSDataTable from "@/components/DSDataTable";
import DSTextField from "@/components/DSTextField";
import { students } from "@/mock/students";
import { Button, Checkbox } from "flowbite-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full">
      <DSDataTable
        title="Data Mahasiswa"
        items={students}
        totalItemsCount={100}
        disableMultiActions
        disableCheckboxes
      />
    </div>
  );
}
