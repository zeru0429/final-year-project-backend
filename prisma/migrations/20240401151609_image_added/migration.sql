-- CreateTable
CREATE TABLE `healthstationsImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `healthStationInfoId` INTEGER NOT NULL,
    `imageUrl` Text NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `healthstationsImage` ADD CONSTRAINT `healthstationsImage_healthStationInfoId_fkey` FOREIGN KEY (`healthStationInfoId`) REFERENCES `healthStationInfos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
