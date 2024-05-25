import { decryptCourseData, decryptMahasiswaData } from "@/utils/cipher";
import NilaiForm from "./components/NilaiForm";
import { prisma } from "@/lib/prisma";

const getKey = async () => {
  try {
    const key = await prisma.ketuaProgramStudi.findUnique({
      where: {
        id: 0,
      },
      select: {
        public_key: true,
        private_key: true,
      },
    });

    return key;
  } catch (error) {
    console.error("Error getting key:", error);
  }
}

const getMahasiswa = async (private_key: string, public_key: string) => {
  try {
    const result = await prisma.mahasiswa.findMany({
      select: {
        nim: true,
        nama: true,
      },
    });

    const decryptedResult = result.map((item) => {
      const { nim, nama } = decryptMahasiswaData(item.nim, item.nama, private_key, public_key);
      return { nim, nama };
    });

    const mahasiswaDict = decryptedResult.reduce((acc, curr) => {
      acc[curr.nim] = curr.nama;
      return acc;
    }, {} as { [key: string]: string });

    return mahasiswaDict;
  } catch (error) {
    console.error("Error getting data:", error);
  }
};

const getMataKuliah = async (private_key: string, public_key: string) => {
  try {
    const result = await prisma.mataKuliah.findMany({
      select: {
        kode_mata_kuliah: true,
        nama_mata_kuliah: true,
        sks: true,
      },
    });

    const decryptedResult = result.map((item) => {
      const { kode, nama, sks } = decryptCourseData(
        item.kode_mata_kuliah,
        item.nama_mata_kuliah,
        item.sks,
        private_key,
        public_key
      );
      return {
        kode_mata_kuliah: kode,
        nama_mata_kuliah: nama,
        sks: Number(sks),
      };
    });

    const mataKuliahDict = decryptedResult.reduce((acc, curr) => {
      acc[curr.kode_mata_kuliah] = curr.nama_mata_kuliah;
      return acc;
    }, {} as { [key: string]: string });

    const sksDict = decryptedResult.reduce((acc, curr) => {
      acc[curr.kode_mata_kuliah] = curr.sks;
      return acc;
    }, {} as { [key: string]: number });

    return { mataKuliahDict, sksDict };
  } catch (error) {
    console.error("Error getting data:", error);
  }
};

export default async function FormInput() {
  const dataKey = await getKey();

  if (!dataKey) {
    return <div>Failed to fetch key</div>;
  }

  const dataMahasiswa = await getMahasiswa(dataKey.private_key, dataKey.public_key);
  const dataMataKuliah = await getMataKuliah(dataKey.private_key, dataKey.public_key);
  if (!dataMahasiswa || !dataMataKuliah) {
    return <div>Failed to fetch data</div>;
  }

  return (
    <div>
      <NilaiForm
        mahasiswa={dataMahasiswa}
        mataKuliah={dataMataKuliah.mataKuliahDict}
        sks={dataMataKuliah.sksDict}
      />
    </div>
  );
}
