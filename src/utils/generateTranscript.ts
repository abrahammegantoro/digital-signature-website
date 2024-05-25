import { NilaiMahasiswa } from "@/interface/interface";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

async function generateTranscript(data: NilaiMahasiswa) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontSize = 12;
  const margin = 50;

  const drawText = (
    text: string,
    x: number,
    y: number,
    size: number = fontSize
  ) => {
    page.drawText(text, {
      x,
      y,
      size,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
  };

  drawText(
    "Program Studi Sistem dan Teknologi Informasi",
    margin,
    height - margin
  );
  drawText(
    "Sekolah Teknik Elektro dan Informatika",
    margin,
    height - margin - 15
  );
  drawText("Institut Teknologi Bandung", margin, height - margin - 30);
  drawText(
    "------------------------------------------",
    margin,
    height - margin - 45
  );

  drawText("Transkip Akademik", margin, height - margin - 75);

  drawText(`Nama: ${data.nama}`, margin, height - margin - 100);
  drawText(`NIM: ${data.nim}`, margin, height - margin - 115);

  drawText("No", margin, height - margin - 150);
  drawText("Kode mata kuliah", margin + 50, height - margin - 150);
  drawText("Nama mata kuliah", margin + 150, height - margin - 150);
  drawText("SKS", width - 90, height - margin - 150);
  drawText("Nilai", width - 50, height - margin - 150);

  let y = height - margin - 175;
  for (let i = 1; i <= 10; i++) {
    const kode = data[`kode_mk_${i}` as keyof NilaiMahasiswa];
    const nama = data[`nama_matkul_${i}` as keyof NilaiMahasiswa];
    const sks = data[`sks_${i}` as keyof NilaiMahasiswa];
    const nilai = data[`nilai_${i}` as keyof NilaiMahasiswa];

    if (kode && nama && sks && nilai) {
      drawText(String(i), margin, y);
      drawText(String(kode), margin + 50, y);
      drawText(String(nama), margin + 150, y);
      drawText(String(sks), width - 90, y);
      drawText(String(nilai), width - 50, y);
      y -= 20;
    }
  }

  drawText(`Total Jumlah SKS = 36`, margin, y - 20);
  drawText(`IPK = ${data.ipk}`, margin, y - 35);

  drawText("Ketua Program Studi", margin, y - 70);
  drawText("--Begin signature--", margin, y - 90);
  drawText(data.tanda_tangan.join(''), margin, y - 105);
  drawText("--End signature--", margin, y - 120);
  drawText(`(Dr. I Gusti Bagus Baskara)`, margin, y - 140);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export { generateTranscript };
