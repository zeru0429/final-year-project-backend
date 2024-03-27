/*
  Warnings:

  - You are about to alter the column `titleOr` on the `news` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `adminprofiles` MODIFY `imageUrl` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `appointments` MODIFY `description` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `healthstationinfos` MODIFY `descriptionAm` VARCHAR(1000) NOT NULL,
    MODIFY `descriptionOr` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `news` MODIFY `titleOr` VARCHAR(191) NOT NULL,
    MODIFY `descriptionAm` VARCHAR(1000) NOT NULL,
    MODIFY `descriptionOr` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `newsimage` MODIFY `imageUrl` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `userprofiles` MODIFY `imageUrl` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `vaccines` MODIFY `description` VARCHAR(1000) NOT NULL;
