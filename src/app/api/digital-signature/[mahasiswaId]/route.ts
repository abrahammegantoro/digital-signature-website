import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { modifiedRC4Encrypt } from "@/ciphers/modified_rc4";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { mahasiswaId: string } }
) {
  try {
    const { mahasiswaId } = params;
    const { tanda_tangan } = await req.json();

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { nim: mahasiswaId },
    });

    if (!mahasiswa) {
      return NextResponse.json(
        { error: "Ketua Program Studi not found" },
        { status: 404 }
      );
    }

    const updateMahasiswa = await prisma.mahasiswa.update({
      where: { nim: mahasiswaId },
      data: {
        tanda_tangan: tanda_tangan
      },
    });

    return NextResponse.json(
      { message: "Mahasiswa Key data submitted successfully", updateMahasiswa },
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
