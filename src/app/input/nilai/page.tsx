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

const IndexScheme = z.enum(["A", "AB", "B", "BC", "C", "D", "E"]);

const gradePoints: Record<string, number> = {
  A: 4,
  AB: 3.5,
  B: 3,
  BC: 2.5,
  C: 2,
  D: 1,
  E: 0,
};

const MatkulScheme = z.object({
  kode: z.string().min(1, { message: "Kode is required" }),
  nama: z.string().min(1, { message: "Nama is required" }),
  nilai: IndexScheme,
  sks: z.number().min(1, { message: "SKS must be at least 1" }),
});

const StudentScheme = z.object({
  nim: z.string().min(1, { message: "NIM is required" }),
  matkul: z
    .array(MatkulScheme)
    .length(10, { message: "Matkul must have exactly 10 items" }),
  ipk: z
    .number()
    .min(0, { message: "IPK must be at least 0" })
    .max(4, { message: "IPK must be at most 4" }),
});

type StudentType = z.infer<typeof StudentScheme>;

type DataDummyType = {
  [key: string]: string;
};

const dataDummy : DataDummyType = {
  "18221143": "John Doe",
  "18221145": "Jane Dee",
  "18221146": "John Die",
  "18221147": "Jane Dae",
}

export default function FormInput() {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudentType>({
    resolver: zodResolver(StudentScheme),
    defaultValues: {
      nim: "",
      matkul: Array(10).fill({ kode: "", nama: "", nilai: "A", sks: 0 }),
      ipk: 0,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "matkul",
  });

  const watchMatkul = useWatch({ control, name: "matkul" });

  const calculateIPK = (matkul: StudentType["matkul"]) => {
    let totalPoints = 0;
    let totalCredits = 0;
    matkul.forEach(({ nilai, sks }) => {
      const gradePoint = gradePoints[nilai];
      totalPoints += gradePoint * sks;
      totalCredits += sks;
    });
    return totalCredits ? totalPoints / totalCredits : 0;
  };

  useEffect(() => {
    const newIPK = calculateIPK(watchMatkul);
    setValue("ipk", parseFloat(newIPK.toFixed(2)));
  }, [watchMatkul, setValue]);


  const onSubmit: SubmitHandler<StudentType> = (data) => console.log(data);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex gap-4 w-full">
          <DSSelect
            label="Mahasiswa"
            id="nim"
            options={dataDummy}
            {...register("nim")}
            error={errors.nim}
            placeholder="Pilih Mahasiswa"
            className="w-full max-w-md"
          ></DSSelect>
        </div>
        <div className="grid grid-cols-5 grid-flow-row gap-x-4 gap-y-7">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-1 w-full bg-slate-100 p-4 rounded-md"
            >
              <DSTextField
                id={`kode-${index}`}
                type="text"
                label={`Kode Matkul ${index + 1}`}
                placeholder={`Masukkan Kode Matkul ${index + 1}`}
                {...register(`matkul.${index}.kode`)}
                error={errors.matkul?.[index]?.kode}
                className="flex-1"
              />
              <DSTextField
                id={`nama-${index}`}
                type="text"
                label={`Nama Matkul ${index + 1}`}
                placeholder={`Masukkan Nama Matkul ${index + 1}`}
                {...register(`matkul.${index}.nama`)}
                error={errors.matkul?.[index]?.nama}
                className="flex-1"
              />
              <DSTextField
                id={`nilai-${index}`}
                type="text"
                label={`Nilai Matkul ${index + 1}`}
                placeholder={`Masukkan Nilai Matkul ${index + 1}`}
                {...register(`matkul.${index}.nilai`)}
                error={errors.matkul?.[index]?.nilai}
                className="flex-1"
              />
              <DSTextField
                id={`sks-${index}`}
                type="number"
                label={`SKS Matkul ${index + 1}`}
                placeholder={`Masukkan SKS Matkul ${index + 1}`}
                {...register(`matkul.${index}.sks`, { valueAsNumber: true })}
                error={errors.matkul?.[index]?.sks}
                className="flex-1"
              />
            </div>
          ))}
        </div>
        <DSTextField
          id="ipk"
          type="text"
          label="IPK"
          placeholder="Masukkan IPK Mahasiswa"
          {...register("ipk", { valueAsNumber: true })}
          error={errors.ipk}
          readOnly
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
