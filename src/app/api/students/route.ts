import { NextRequest, NextResponse } from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { nim, nama } = await req.json();

    const student = await prisma.mahasiswa.create({
      data: {
        nim,
        nama,
      },
    });

    return NextResponse.json({ message: 'Student data submitted successfully', student }, { status: 200 });
  } catch (error) {
    console.error('Error submitting data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
