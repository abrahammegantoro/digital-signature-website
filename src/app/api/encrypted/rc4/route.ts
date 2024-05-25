import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cryptDataMahasiswa, cryptDigitalSignature } from "@/utils/cipher";

type UpdateMahasiswa = {
  nim: string;
  nama: string;
  ipk: string;
  tanda_tangan: string[];
  encrypted_nim: string;
};

type UpdateMatkul = {
  kode_mata_kuliah: string;
  nama_mata_kuliah: string;
  sks: string;
  encrypted_kode: string;
}

type UpdateNilai = {
  id: number;
  nilai: string;
}

export async function PATCH(req: NextRequest) {
  try {
    const { vigenereKey, rc4Key } = await req.json();

    const oldKey = await prisma.ketuaProgramStudi.findFirst({
      where: { id: 0 },
    });

    if (!oldKey) {
      return NextResponse.json(
        { error: "Ketua Program Studi not found" },
        { status: 404 }
      );
    }

    const allMahasiswa = await prisma.mahasiswa.findMany({
      select: {
        nim: true,
        nama: true,
        ipk: true,
        tanda_tangan: true,
      },
    });

    const decryptedMahasiswa: UpdateMahasiswa[] = allMahasiswa.map(
      (mahasiswa) => {
        const { tanda_tangan, ...rest } = mahasiswa;
        const decryptedData = cryptDataMahasiswa(
          rest,
          oldKey.public_key,
          oldKey.private_key,
          false
        );

        const decryptTandaTangan = cryptDigitalSignature(
          tanda_tangan,
          oldKey.public_key,
          oldKey.private_key,
          false
        );

        return {
          ...decryptedData,
          tanda_tangan: decryptTandaTangan,
          encrypted_nim: mahasiswa.nim,
        } as UpdateMahasiswa;
      }
    );

    const encryptedMahasiswa = decryptedMahasiswa.map((mahasiswa) => {
      const { tanda_tangan, encrypted_nim, ...rest } = mahasiswa;
      const encryptedData = cryptDataMahasiswa(rest, rc4Key, vigenereKey, true);

      const encryptTandaTangan = cryptDigitalSignature(
        tanda_tangan,
        rc4Key,
        vigenereKey,
        true
      );

      return {
        ...encryptedData,
        tanda_tangan: encryptTandaTangan,
        encrypted_nim: encrypted_nim,
      } as UpdateMahasiswa;
    });

    const updateMahasiswa = await Promise.all(
      encryptedMahasiswa.map((mahasiswa) =>
        prisma.mahasiswa.update({
          where: { nim: mahasiswa.encrypted_nim },
          data: {
            nim: mahasiswa.nim,
            nama: mahasiswa.nama,
            ipk: mahasiswa.ipk ?? "",
            tanda_tangan: mahasiswa.tanda_tangan,
          },
        })
      )
    );

    const allMataKuliah = await prisma.mataKuliah.findMany({
      select: {
        kode_mata_kuliah: true,
        nama_mata_kuliah: true,
        sks: true,
      },
    });

    const decryptedMatkul = allMataKuliah.map((matkul) => {
      const decryptedData = cryptDataMahasiswa(
        matkul,
        oldKey.public_key,
        oldKey.private_key,
        false
      );

      return {
        encrypted_kode: matkul.kode_mata_kuliah,
        ...decryptedData,
      } as UpdateMatkul;
    });

    const encryptedMatkul = decryptedMatkul.map((matkul) => {
      const { encrypted_kode, ...rest } = matkul;
      const encryptedData = cryptDataMahasiswa(rest, rc4Key, vigenereKey, true);

      return {
        encrypted_kode: encrypted_kode,
        ...encryptedData,
      } as UpdateMatkul;
    });

    const updateMatkul = await Promise.all(
      encryptedMatkul.map((matkul) =>
        prisma.mataKuliah.update({
          where: { kode_mata_kuliah: matkul.encrypted_kode },
          data: {
            kode_mata_kuliah: matkul.kode_mata_kuliah,
            nama_mata_kuliah: matkul.nama_mata_kuliah,
            sks: matkul.sks,
          },
        })
      )
    );



    const allNilai = await prisma.nilai.findMany({
      select: {
        id: true,
        nilai: true,
      },
    });

    const decryptedNilai = allNilai.map((nilai) => {
      const { id, ...rest} = nilai;
      const decryptedData = cryptDataMahasiswa(
        rest,
        oldKey.public_key,
        oldKey.private_key,
        false
      );

      return {
        id: id,
        ...decryptedData,
      } as UpdateNilai;
    });

    const encryptedNilai = decryptedNilai.map((nilai) => {
      const { id, ...rest } = nilai;
      const encryptedData = cryptDataMahasiswa(rest, rc4Key, vigenereKey, true);

      return {
        id: id,
        ...encryptedData,
      } as UpdateNilai;
    });

    const updateNilai = await Promise.all(
      encryptedNilai.map((nilai) =>
        prisma.nilai.update({
          where: { id: nilai.id },
          data: {
            nilai: nilai.nilai,
          },
        })
      )
    );

    const updateKey = await prisma.ketuaProgramStudi.update({
      where: { id: 0 },
      data: {
        public_key: rc4Key,
        private_key: vigenereKey,
      },
    });

    return NextResponse.json(
      { message: "Key data submitted successfully", updateKey },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
