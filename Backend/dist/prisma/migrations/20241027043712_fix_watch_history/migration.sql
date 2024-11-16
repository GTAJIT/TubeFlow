-- AlterTable
CREATE SEQUENCE watchhistory_id_seq;
ALTER TABLE "WatchHistory" ALTER COLUMN "id" SET DEFAULT nextval('watchhistory_id_seq');
ALTER SEQUENCE watchhistory_id_seq OWNED BY "WatchHistory"."id";
