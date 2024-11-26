-- AlterTable
CREATE SEQUENCE views_id_seq;
ALTER TABLE "Views" ALTER COLUMN "id" SET DEFAULT nextval('views_id_seq');
ALTER SEQUENCE views_id_seq OWNED BY "Views"."id";
