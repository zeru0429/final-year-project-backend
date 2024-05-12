/*
  Warnings:

  - A unique constraint covering the columns `[locationId]` on the table `healthStations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `healthStations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `healthstations` ADD COLUMN `locationId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `latitude` DECIMAL(65, 30) NOT NULL,
    `longitude` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `healthStations_locationId_key` ON `healthStations`(`locationId`);

-- AddForeignKey
ALTER TABLE `healthStations` ADD CONSTRAINT `healthStations_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
