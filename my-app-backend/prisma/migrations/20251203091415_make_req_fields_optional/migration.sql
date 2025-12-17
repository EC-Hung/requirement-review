-- AlterTable
ALTER TABLE "Requirement" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "acceptanceCriteria" SET DEFAULT ARRAY[]::TEXT[];
