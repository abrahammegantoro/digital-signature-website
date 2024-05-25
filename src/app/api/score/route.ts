import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  encryptIpkData,
  encryptMahasiswaData,
  encryptScoreData,
} from "@/utils/cipher";

export async function POST(req: NextRequest) {
  try {
    const { nim, matkul, ipk } = await req.json();

    const key = await prisma.ketuaProgramStudi.findUnique({
      where: {
        id: 0,
      },
      select: {
        public_key: true,
        private_key: true,
      },
    });

    if (!key) {
      return NextResponse.json({ error: "Key not found" }, { status: 404 });
    }

    const encryptedNim = encryptMahasiswaData(
      nim,
      "dummy",
      key.private_key,
      key.public_key
    ).encryptedNim;

    const mahasiswaExist = await prisma.mahasiswa.findUnique({
      where: {
        nim: encryptedNim,
      },
    });

    if (!mahasiswaExist) {
      return NextResponse.json(
        { error: "Mahasiswa not found" },
        { status: 404 }
      );
    }

    const deleteNilai = await prisma.nilai.deleteMany({
      where: {
        nim: encryptedNim,
      },
    });

    const nilaiRecords = matkul.map((mk: { kode: string; nilai: string }) => {
      const { encryptedKode, encryptedNilai } = encryptScoreData(
        mk.kode,
        mk.nilai,
        key.private_key,
        key.public_key
      );
      return {
        nim: encryptedNim,
        kode_mata_kuliah: encryptedKode,
        nilai: encryptedNilai,
      };
    });

    const newNilai = await prisma.nilai.createMany({
      data: nilaiRecords,
    });

    const encryptedIpk = encryptIpkData(ipk, key.private_key, key.public_key);
    const newIpk = await prisma.mahasiswa.update({
      where: {
        nim: encryptedNim,
      },
      data: {
        ipk: encryptedIpk,
      },
    });

    return NextResponse.json(
      { message: "Score data submitted successfully", newNilai, newIpk },
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
