/*
  Warnings:

  - Changed the type of `nilai` on the `Nilai` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterSequence
ALTER SEQUENCE "KetuaProgramStudi_id_seq" MAXVALUE 9223372036854775807;

-- AlterTable
ALTER TABLE "Nilai" DROP COLUMN "nilai";
ALTER TABLE "Nilai" ADD COLUMN     "nilai" STRING NOT NULL;

-- DropEnum
DROP TYPE "INDEKS";
