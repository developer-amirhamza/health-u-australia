CREATE TABLE "TrainingResource" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "link" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TrainingResource_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TrainingResource_category_idx" ON "TrainingResource"("category");

ALTER TABLE "TrainingResource" ADD CONSTRAINT "TrainingResource_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
