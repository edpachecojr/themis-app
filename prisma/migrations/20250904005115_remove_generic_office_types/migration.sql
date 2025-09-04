/*
  Warnings:

  - The values [BRANCH,DEPARTMENT,DIVISION,UNIT,OTHER] on the enum `OfficeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."OfficeType_new" AS ENUM ('MAIN_OFFICE', 'REGIONAL_OFFICE', 'SERVICE_CENTER', 'SPECIALIZED_UNIT', 'CONSULTATION_ROOM', 'EMERGENCY_ROOM', 'WARD', 'SURGERY_ROOM', 'LABORATORY', 'IMAGING_CENTER');
ALTER TABLE "public"."office" ALTER COLUMN "type" TYPE "public"."OfficeType_new" USING ("type"::text::"public"."OfficeType_new");
ALTER TYPE "public"."OfficeType" RENAME TO "OfficeType_old";
ALTER TYPE "public"."OfficeType_new" RENAME TO "OfficeType";
DROP TYPE "public"."OfficeType_old";
COMMIT;
