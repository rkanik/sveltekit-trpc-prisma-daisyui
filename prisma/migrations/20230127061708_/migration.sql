/*
  Warnings:

  - You are about to drop the column `userId` on the `project_tags` table. All the data in the column will be lost.
  - Added the required column `tagId` to the `project_tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `project_tags` DROP FOREIGN KEY `project_tags_userId_fkey`;

-- AlterTable
ALTER TABLE `project_tags` DROP COLUMN `userId`,
    ADD COLUMN `tagId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `project_tags` ADD CONSTRAINT `project_tags_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tags`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
