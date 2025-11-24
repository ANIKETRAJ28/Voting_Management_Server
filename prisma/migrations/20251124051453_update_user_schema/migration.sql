/*
  Warnings:

  - You are about to drop the column `noance` on the `User` table. All the data in the column will be lost.
  - Added the required column `nonce` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('Created', 'RegisterCandidates', 'RegisterVoters', 'Voting', 'Finalized');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "noance",
ADD COLUMN     "nonce" TEXT NOT NULL,
ALTER COLUMN "last_login" DROP NOT NULL;
