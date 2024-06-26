import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { modifiedRC4Encrypt } from "@/ciphers/modified_rc4";
import { encryptMahasiswaData } from "@/utils/cipher";

export async function POST(req: NextRequest) {
  try {
    const { nim, nama } = await req.json();

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

    const { encryptedNim, encryptedNama } = encryptMahasiswaData(nim, nama, key.private_key, key.public_key);

    const student = await prisma.mahasiswa.create({
      data: {
        nim: encryptedNim,
        nama: encryptedNama,
      },
    });

    return NextResponse.json(
      { message: "Student data submitted successfully", student },
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
