import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptCourseData } from "@/utils/cipher";

export async function POST(req: NextRequest) {
  try {
    const { kode, nama, sks } = await req.json();

    const key = await prisma.ketuaProgramStudi.findUnique({
      where: {
        id: 0,
      },
      select: {
        public_key: true,
        private_key: true
      },
    });

    if (!key) {
      return NextResponse.json(
        { error: "Key not found" },
        { status: 404 }
      );
    }

    const { encryptedKode, encryptedNama, encryptedSks } = encryptCourseData(kode, nama, sks, key.private_key, key.public_key);

    const student = await prisma.mataKuliah.create({
      data: {
        kode_mata_kuliah: encryptedKode,
        nama_mata_kuliah: encryptedNama,
        sks: encryptedSks,
      },
    });

    return NextResponse.json(
      { message: "Course data submitted successfully", student },
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
