/*
  Warnings:

  - Added the required column `imageUrl` to the `healthStations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `healthstations` ADD COLUMN `imageUrl` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `healthstationsimage` MODIFY `imageUrl` VARCHAR(191) NOT NULL;
