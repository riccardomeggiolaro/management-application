/*
  Warnings:

  - You are about to drop the `cards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `installations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `materials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `cards`;

-- DropTable
DROP TABLE `events`;

-- DropTable
DROP TABLE `installations`;

-- DropTable
DROP TABLE `materials`;

-- DropTable
DROP TABLE `subjects`;

-- CreateTable
CREATE TABLE `event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `installationId` INTEGER NULL,
    `dt_insert` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `dt_create` DATETIME(0) NULL,
    `progressive` BIGINT NULL,
    `note1` VARCHAR(50) NULL,
    `note2` VARCHAR(50) NULL,
    `weight1` BIGINT NULL,
    `pid1` VARCHAR(12) NULL,
    `weight2` BIGINT NULL,
    `pid2` VARCHAR(12) NULL,
    `netWeight` BIGINT NULL,
    `vehicle` VARCHAR(20) NULL,
    `plate` VARCHAR(10) NULL,
    `material` CHAR(25) NOT NULL,
    `rawid` BIGINT NOT NULL,
    `materialId` INTEGER NULL,
    `subjectId` INTEGER NULL,
    `cardCode` VARCHAR(30) NULL,
    `note` VARCHAR(50) NULL,

    INDEX `IDX_ac57c28f2ef1acc83fe2292f28`(`dt_create`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `installation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(50) NOT NULL,
    `imei` CHAR(15) NOT NULL,
    `code` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
