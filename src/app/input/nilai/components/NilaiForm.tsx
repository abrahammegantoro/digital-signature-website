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
import toast from "react-hot-toast";

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
  nilai: IndexScheme,
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

type ResponseType = {
  [key: string]: string;
};

export default function NilaiForm({
  mahasiswa,
  mataKuliah,
  sks,
}: {
  mahasiswa: ResponseType;
  mataKuliah: ResponseType;
  sks: {
    [key: string]: number;
  };
}) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<StudentType>({
    resolver: zodResolver(StudentScheme),
    defaultValues: {
      nim: "",
      matkul: Array(10).fill({ kode: "", nama: "", nilai: "", sks: 0 }),
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
    matkul.forEach(({ nilai, kode }) => {
      const gradePoint = gradePoints[nilai] ?? 0;
      const banyakSks = sks[kode] ?? 0;
      totalPoints += gradePoint * banyakSks;
      totalCredits += banyakSks;
    });
    return totalCredits ? totalPoints / totalCredits : 0;
  };

  useEffect(() => {
    const newIPK = calculateIPK(watchMatkul);
    console.log(newIPK);
    setValue("ipk", parseFloat(newIPK.toFixed(2)));
  }, [watchMatkul, setValue]);

  const onSubmit: SubmitHandler<StudentType> = async (data) => {
    const loadingToast = toast.loading("Submitting data...");
    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      toast.success(result.message, { id: loadingToast });
      reset();
    } catch (error) {
      toast.error("Failed to submit data", { id: loadingToast });
      console.error(error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex gap-4 w-full">
          <DSSelect
            label="Mahasiswa"
            id="nim"
            options={mahasiswa}
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
              <DSSelect
                label={`Mata Kuliah ${index + 1}`}
                id={`kode-${index}`}
                options={mataKuliah}
                placeholder={`Masukkan Kode Matkul ${index + 1}`}
                {...register(`matkul.${index}.kode`)}
                error={errors.matkul?.[index]?.kode}
                className="flex-1"
              />
              <DSTextField
                id={`sks-${index}`}
                type="number"
                label={`SKS Matkul ${index + 1}`}
                value={sks[watchMatkul[index]?.kode] || ""}
                className="flex-1"
                readOnly
              />
              <DSSelect
                label={`Nilai Matkul ${index + 1}`}
                id={`nilai-${index}`}
                options={["A", "AB", "B", "BC", "C", "D", "E"]}
                placeholder={`Masukkan Nilai Matkul ${index + 1}`}
                {...register(`matkul.${index}.nilai`)}
                error={errors.matkul?.[index]?.nilai}
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
