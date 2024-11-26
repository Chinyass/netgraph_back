-- AlterTable
ALTER TABLE `Zone` ADD COLUMN `localityId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Locality` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Locality_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Zone` ADD CONSTRAINT `Zone_localityId_fkey` FOREIGN KEY (`localityId`) REFERENCES `Locality`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
