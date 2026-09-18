ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "title" VARCHAR(160);
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "duration_minutes" INTEGER;