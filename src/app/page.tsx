import { NilaiMahasiswa } from "@/interface/interface";
import DataMahasiswa from "./components/DataMahasiswa";
import { prisma } from "@/lib/prisma";
import { decryptDataMahasiswa } from "@/utils/cipher";

const getNilaiMahasiswa = async () => {
  try {
    const result = await prisma.mahasiswa.findMany({
      include: {
        Nilai: {
          include: {
            MataKuliah: true,
          },
        },
      },
    });

    const transformResult = result.map((mahasiswa) => {
      const nilaiFields = mahasiswa.Nilai.map((nilai, index) => ({
        [`kode_mk_${index + 1}`]: nilai.kode_mata_kuliah,
        [`nama_matkul_${index + 1}`]: nilai.MataKuliah.nama_mata_kuliah,
        [`nilai_${index + 1}`]: nilai.nilai,
        [`sks_${index + 1}`]: nilai.MataKuliah.sks,
      }));

      const flattenedNilaiFields = nilaiFields.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
      for (let i = nilaiFields.length; i < 10; i++) {
        flattenedNilaiFields[`kode_mk_${i + 1}`] = "-";
        flattenedNilaiFields[`nama_matkul_${i + 1}`] = "-";
        flattenedNilaiFields[`nilai_${i + 1}`] = "-";
        flattenedNilaiFields[`sks_${i + 1}`] = "-";
      }

      return {
        nim: mahasiswa.nim,
        nama: mahasiswa.nama,
        ...flattenedNilaiFields,
        ipk: mahasiswa.ipk,
        tanda_tangan: mahasiswa.tanda_tangan,
      };
    });

    return transformResult as NilaiMahasiswa[];
  } catch (error) {
    console.error("Error getting data:", error);
  }
};

const getKaprodi = async () => {
  try {
    const result = await prisma.ketuaProgramStudi.findFirst();

    return result;
  } catch (error) {
    console.error("Error getting data:", error);
  }
}

export default async function Home() {
  const dataMahasiswa = await getNilaiMahasiswa();
  const dataKaprodi = await getKaprodi();

  if (!dataMahasiswa || !dataKaprodi) {
    return <div>Failed to fetch data</div>;
  }

  const dataDecrypted = decryptDataMahasiswa(dataMahasiswa);

  return (
    <div className="w-full">
      <DataMahasiswa
        nilaiMahasiswaEncrypt={dataMahasiswa}
        nilaiMahasiswaDecrypt={dataDecrypted}
        kaprodi={dataKaprodi}
      />
    </div>
  );
}
