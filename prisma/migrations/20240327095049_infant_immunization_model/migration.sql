-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `role` ENUM('SUPER', 'ADMIN') NOT NULL DEFAULT 'ADMIN',
    `password` VARCHAR(255) NOT NULL,
    `activeStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `otp` VARCHAR(255) NULL,
    `otpCreatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `otpExpiry` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admins_email_key`(`email`),
    UNIQUE INDEX `admins_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adminProfiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `middleName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `imageUrl` TEXT NULL,

    UNIQUE INDEX `adminProfiles_adminId_key`(`adminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `healthStations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registeredBy` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `subcity` VARCHAR(255) NOT NULL,
    `kebele` VARCHAR(255) NOT NULL,
    `houseNumber` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `healthStations_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `healthStationInfos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `healthStationId` INTEGER NOT NULL,
    `serviceAm` VARCHAR(255) NOT NULL,
    `serviceOr` VARCHAR(255) NOT NULL,
    `descriptionAm` TEXT NOT NULL,
    `descriptionOr` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `writerId` INTEGER NULL,
    `titleAm` VARCHAR(255) NOT NULL,
    `titleOr` VARCHAR(255) NOT NULL,
    `descriptionAm` TEXT NOT NULL,
    `descriptionOr` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `newsId` INTEGER NOT NULL,
    `imageUrl` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vaccines` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registeredBy` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(255) NOT NULL,
    `dose` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `description` TEXT NOT NULL,
    `ageRange` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `healthStationId` INTEGER NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `role` ENUM('MOTHER', 'MANAGER', 'RECEPTION', 'HEALTH_PROFETIONAL') NOT NULL DEFAULT 'MOTHER',
    `password` VARCHAR(255) NOT NULL,
    `activeStatus` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `otp` VARCHAR(255) NULL,
    `otpCreatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `otpExpiry` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userProfiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `middleName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `sex` ENUM('MALE', 'FEMALE') NOT NULL,
    `imageUrl` TEXT NULL,

    UNIQUE INDEX `userProfiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professionalProfiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `healthStationId` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `position` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `professionalProfiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mothersProfiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `birthdate` DATETIME(3) NOT NULL,
    `bloodType` VARCHAR(255) NOT NULL,
    `RH` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `mothersProfiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `childrens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `motherId` INTEGER NULL,
    `registeredBy` INTEGER NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `middleName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `birthdate` DATETIME(3) NOT NULL,
    `bloodType` VARCHAR(255) NOT NULL,
    `isVaccineCompleted` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `motherVaccines` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `motherId` INTEGER NOT NULL,
    `vaccineId` INTEGER NULL,
    `healthStationId` INTEGER NULL,
    `registerdBy` INTEGER NULL,
    `createdDateTime` DATETIME(3) NOT NULL,
    `isGiven` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `childrenVaccines` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `childId` INTEGER NOT NULL,
    `vaccineId` INTEGER NULL,
    `healthStationId` INTEGER NULL,
    `registerdBy` INTEGER NULL,
    `createdDateTime` DATETIME(3) NOT NULL,
    `isGiven` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `childId` INTEGER NOT NULL,
    `registerdBy` INTEGER NULL,
    `healthStationId` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `issuedDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `certification_childId_key`(`childId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `motherId` INTEGER NOT NULL,
    `childId` INTEGER NOT NULL,
    `healthStationId` INTEGER NULL,
    `registerdBy` INTEGER NULL,
    `vaccineId` INTEGER NULL,
    `createdDateTime` DATETIME(3) NOT NULL,
    `appointmentDate` DATETIME(3) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `adminProfiles` ADD CONSTRAINT `adminProfiles_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `healthStations` ADD CONSTRAINT `healthStations_registeredBy_fkey` FOREIGN KEY (`registeredBy`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `healthStationInfos` ADD CONSTRAINT `healthStationInfos_healthStationId_fkey` FOREIGN KEY (`healthStationId`) REFERENCES `healthStations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news` ADD CONSTRAINT `news_writerId_fkey` FOREIGN KEY (`writerId`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsImage` ADD CONSTRAINT `NewsImage_newsId_fkey` FOREIGN KEY (`newsId`) REFERENCES `news`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vaccines` ADD CONSTRAINT `vaccines_registeredBy_fkey` FOREIGN KEY (`registeredBy`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_healthStationId_fkey` FOREIGN KEY (`healthStationId`) REFERENCES `healthStations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userProfiles` ADD CONSTRAINT `userProfiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professionalProfiles` ADD CONSTRAINT `professionalProfiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mothersProfiles` ADD CONSTRAINT `mothersProfiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `childrens` ADD CONSTRAINT `childrens_motherId_fkey` FOREIGN KEY (`motherId`) REFERENCES `mothersProfiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `childrens` ADD CONSTRAINT `childrens_registeredBy_fkey` FOREIGN KEY (`registeredBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `motherVaccines` ADD CONSTRAINT `motherVaccines_motherId_fkey` FOREIGN KEY (`motherId`) REFERENCES `mothersProfiles`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `motherVaccines` ADD CONSTRAINT `motherVaccines_vaccineId_fkey` FOREIGN KEY (`vaccineId`) REFERENCES `vaccines`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `motherVaccines` ADD CONSTRAINT `motherVaccines_healthStationId_fkey` FOREIGN KEY (`healthStationId`) REFERENCES `healthStations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `motherVaccines` ADD CONSTRAINT `motherVaccines_registerdBy_fkey` FOREIGN KEY (`registerdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `childrenVaccines` ADD CONSTRAINT `childrenVaccines_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `childrens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `childrenVaccines` ADD CONSTRAINT `childrenVaccines_vaccineId_fkey` FOREIGN KEY (`vaccineId`) REFERENCES `vaccines`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `childrenVaccines` ADD CONSTRAINT `childrenVaccines_healthStationId_fkey` FOREIGN KEY (`healthStationId`) REFERENCES `healthStations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `childrenVaccines` ADD CONSTRAINT `childrenVaccines_registerdBy_fkey` FOREIGN KEY (`registerdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certification` ADD CONSTRAINT `certification_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `childrens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certification` ADD CONSTRAINT `certification_registerdBy_fkey` FOREIGN KEY (`registerdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certification` ADD CONSTRAINT `certification_healthStationId_fkey` FOREIGN KEY (`healthStationId`) REFERENCES `healthStations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_registerdBy_fkey` FOREIGN KEY (`registerdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_vaccineId_fkey` FOREIGN KEY (`vaccineId`) REFERENCES `vaccines`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_healthStationId_fkey` FOREIGN KEY (`healthStationId`) REFERENCES `healthStations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_motherId_fkey` FOREIGN KEY (`motherId`) REFERENCES `mothersProfiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `childrens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
