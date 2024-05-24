/*
  Warnings:

  - The `tanda_tangan` column on the `Mahasiswa` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Mahasiswa" DROP COLUMN "tanda_tangan";
ALTER TABLE "Mahasiswa" ADD COLUMN     "tanda_tangan" STRING[];
