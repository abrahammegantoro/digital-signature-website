import NilaiForm from "./components/NilaiForm";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getMahasiswa = async () => {
  try {
    const result = await prisma.mahasiswa.findMany({
      select: {
        nim: true,
        nama: true,
      }
    });
    const mahasiswaDict = result.reduce((acc, curr) => {
      acc[curr.nim] = curr.nama;
      return acc;
    }, {} as { [key: string]: string });

    return mahasiswaDict;
  } catch (error) {
    console.error("Error getting data:", error);
  }
}

export default async function FormInput() {
  const data = await getMahasiswa();
  if (!data) {
    return <div>Failed to fetch data</div>;
  }
  
  return (
    <div>
      <NilaiForm mahasiswa={data}/>
    </div>
  );
}
