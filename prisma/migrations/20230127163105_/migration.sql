-- DropForeignKey
ALTER TABLE `project_tags` DROP FOREIGN KEY `project_tags_projectId_fkey`;

-- AddForeignKey
ALTER TABLE `project_tags` ADD CONSTRAINT `project_tags_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
