import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { nim, matkul, ipk } = await req.json();

    const mahasiswaExist = await prisma.mahasiswa.findUnique({
      where: {
        nim,
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
        nim,
      },
    });

    const nilaiRecords = matkul.map((mk: { kode: string; nilai: number }) => ({
      nim: nim,
      kode_mata_kuliah: mk.kode,
      nilai: mk.nilai,
    }));

    const newNilai = await prisma.nilai.createMany({
      data: nilaiRecords,
    });

    const newIpk = await prisma.mahasiswa.update({
      where: {
        nim,
      },
      data: {
        ipk,
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
