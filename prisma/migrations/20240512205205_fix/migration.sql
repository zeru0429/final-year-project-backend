-- DropForeignKey
ALTER TABLE `motherVaccines` DROP FOREIGN KEY `motherVaccines_motherId_fkey`;

-- AddForeignKey
ALTER TABLE `motherVaccines` ADD CONSTRAINT `motherVaccines_motherId_fkey` FOREIGN KEY (`motherId`) REFERENCES `mothersProfiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
