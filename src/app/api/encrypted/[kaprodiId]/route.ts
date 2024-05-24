import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { kaprodiId: string } }
) {
  try {
    const { kaprodiId } = params;
    const { primeNumber, publicKeyString, privateKeyString } = await req.json();

    const kaprodi = await prisma.ketuaProgramStudi.findUnique({
      where: { id: parseInt(kaprodiId) },
    });

    if (!kaprodi) {
      return NextResponse.json(
        { error: "Ketua Program Studi not found" },
        { status: 404 }
      );
    }

    const updateKaprodi = await prisma.ketuaProgramStudi.update({
      where: { id: parseInt(kaprodiId) },
      data: {
        prime_number: primeNumber,
        public_key: publicKeyString,
        private_key: privateKeyString,
      },
    });

    return NextResponse.json(
      { message: "Kaprodi Key data submitted successfully", updateKaprodi },
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
