/*
  Warnings:

  - You are about to drop the column `ttd_kaprodi` on the `Nilai` table. All the data in the column will be lost.
  - The `nilai` column on the `Nilai` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterSequence
ALTER SEQUENCE "KetuaProgramStudi_id_seq" MAXVALUE 9223372036854775807;

-- CreateEnum
CREATE TYPE "INDEKS" AS ENUM ('A', 'AB', 'B', 'BC', 'C', 'D', 'E');

-- AlterTable
ALTER TABLE "Mahasiswa" ADD COLUMN     "tanda_tangan" STRING NOT NULL DEFAULT '';
ALTER TABLE "Mahasiswa" ALTER COLUMN "jumlah_sks" DROP NOT NULL;
ALTER TABLE "Mahasiswa" ALTER COLUMN "jumlah_sks" SET DEFAULT 0;
ALTER TABLE "Mahasiswa" ALTER COLUMN "ipk" DROP NOT NULL;
ALTER TABLE "Mahasiswa" ALTER COLUMN "ipk" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Nilai" DROP COLUMN "ttd_kaprodi";
ALTER TABLE "Nilai" DROP COLUMN "nilai";
ALTER TABLE "Nilai" ADD COLUMN     "nilai" "INDEKS" NOT NULL DEFAULT 'A';
