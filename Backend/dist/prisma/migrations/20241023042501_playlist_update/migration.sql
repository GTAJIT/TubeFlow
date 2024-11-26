-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_userId_fkey";

-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_videoId_fkey";

-- AlterTable
ALTER TABLE "Playlist" ALTER COLUMN "videoId" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
