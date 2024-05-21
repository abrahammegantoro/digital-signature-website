"use client";

import { Button, Checkbox, Label, Select, TextInput } from "flowbite-react";
import DSTextField from "@/components/DSTextField";
import { z } from "zod";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import DSSelect from "@/components/DSSelect";

const MatkulScheme = z.object({
  kode: z.string().min(1, { message: "Kode is required" }),
  nama: z.string().min(1, { message: "Nama is required" }),
  sks: z.number().min(1, { message: "SKS must be at least 1" }),
});

type MatkulType = z.infer<typeof MatkulScheme>;

export default function FormInput() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MatkulType>({
    resolver: zodResolver(MatkulScheme),
    defaultValues: {
      kode: "",
      nama: "",
      sks: 0,
    },
  });

  const onSubmit: SubmitHandler<MatkulType> = (data) => console.log(data);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-3 grid-flow-row gap-x-4 gap-y-7">
          <DSTextField
            id="kode"
            type="text"
            label="Kode Mata Kuliah"
            placeholder="Masukkan Kode Mata Kuliah"
            {...register("kode")}
            error={errors.kode}
          />
          <DSTextField
            id="nama"
            type="text"
            label="Nama Mata Kuliah"
            placeholder="Masukkan Nama Mata Kuliah"
            {...register("nama")}
            error={errors.nama}
          />
          <DSTextField
            id="sks"
            type="text"
            label="SKS Mata Kuliah"
            placeholder="Masukkan jumlah SKS Mata Kuliah"
            {...register("sks", { valueAsNumber: true })}
            error={errors.sks}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
