"use client";

import DSTextField from "@/components/DSTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "flowbite-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const StudentScheme = z.object({
  nim: z.string().length(8, { message: "NIM must be 8 characters" }),
  nama: z.string().min(1, { message: "Nama is required" }),
});

type StudentType = z.infer<typeof StudentScheme>;

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentType>({
    resolver: zodResolver(StudentScheme),
    defaultValues: {
      nim: "",
      nama: "",
    },
  });

  const onSubmit = (data: StudentType) => {
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 flex-col">
        <div className="flex gap-4">
          <DSTextField
            id="nim"
            type="text"
            placeholder="Masukkan NIM Mahasiswa"
            label="NIM"
            error={errors.nim?.message}
            {...register("nim")}
            className="flex-1"
          />
          <DSTextField
            id="nama"
            type="text"
            placeholder="Masukkan Nama Mahasiswa"
            label="Nama"
            error={errors.nama?.message}
            {...register("nama")}
            className="flex-1"
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
