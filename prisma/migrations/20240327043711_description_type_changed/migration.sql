-- AlterTable
ALTER TABLE `adminprofiles` MODIFY `imageUrl` VARCHAR(10000) NULL;

-- AlterTable
ALTER TABLE `appointments` MODIFY `description` VARCHAR(10000) NOT NULL;

-- AlterTable
ALTER TABLE `healthstationinfos` MODIFY `descriptionAm` VARCHAR(10000) NOT NULL,
    MODIFY `descriptionOr` VARCHAR(10000) NOT NULL;

-- AlterTable
ALTER TABLE `news` MODIFY `descriptionAm` VARCHAR(10000) NOT NULL,
    MODIFY `descriptionOr` VARCHAR(10000) NOT NULL;

-- AlterTable
ALTER TABLE `newsimage` MODIFY `imageUrl` VARCHAR(10000) NOT NULL;

-- AlterTable
ALTER TABLE `userprofiles` MODIFY `imageUrl` VARCHAR(10000) NULL;

-- AlterTable
ALTER TABLE `vaccines` MODIFY `description` VARCHAR(10000) NOT NULL;
