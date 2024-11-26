-- AlterTable
CREATE SEQUENCE playlistvideo_id_seq;
ALTER TABLE "PlaylistVideo" ALTER COLUMN "id" SET DEFAULT nextval('playlistvideo_id_seq');
ALTER SEQUENCE playlistvideo_id_seq OWNED BY "PlaylistVideo"."id";
