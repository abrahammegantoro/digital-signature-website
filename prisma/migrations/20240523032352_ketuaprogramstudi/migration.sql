/*
  Warnings:

  - Added the required column `prime_number` to the `KetuaProgramStudi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KetuaProgramStudi" ADD COLUMN     "prime_number" INT4 NOT NULL;
