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

const getMataKuliah = async () => {
  try {
    const result = await prisma.mataKuliah.findMany({
      select: {
        kode_mata_kuliah: true,
        nama_mata_kuliah: true,
      }
    });
    
    const mataKuliahDict = result.reduce((acc, curr) => {
      acc[curr.kode_mata_kuliah] = curr.nama_mata_kuliah;
      return acc;
    }, {} as { [key: string]: string });

    return mataKuliahDict;
  } catch (error) {
    console.error("Error getting data:", error);
  }
}

export default async function FormInput() {
  const dataMahasiswa = await getMahasiswa();
  const dataMataKuliah = await getMataKuliah();
  if (!dataMahasiswa || !dataMataKuliah) {
    return <div>Failed to fetch data</div>;
  }
  
  return (
    <div>
      <NilaiForm mahasiswa={dataMahasiswa} mataKuliah={dataMataKuliah}/>
    </div>
  );
}
