/*
  Warnings:

  - Added the required column `attachmentId` to the `user_avatars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_avatars` ADD COLUMN `attachmentId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `user_avatars` ADD CONSTRAINT `user_avatars_attachmentId_fkey` FOREIGN KEY (`attachmentId`) REFERENCES `attachments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
