import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { kode, nama, sks } = await req.json();

    const student = await prisma.mataKuliah.create({
      data: {
        kode_mata_kuliah: kode,
        nama_mata_kuliah: nama,
        sks
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
