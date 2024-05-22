import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptIpkData, encryptMahasiswaData, encryptScoreData } from "@/utils/cipher";

export async function POST(req: NextRequest) {
  try {
    const { nim, matkul, ipk } = await req.json();

    const encryptedNim = encryptMahasiswaData(nim, "dummy").encryptedNim;

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
      const { encryptedKode, encryptedNilai } = encryptScoreData(mk.kode, mk.nilai);
      return {
        nim: encryptedNim,
        kode_mata_kuliah: encryptedKode,
        nilai: encryptedNilai,
      };
    });

    const newNilai = await prisma.nilai.createMany({
      data: nilaiRecords,
    });

    const encryptedIpk = encryptIpkData(ipk);
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
