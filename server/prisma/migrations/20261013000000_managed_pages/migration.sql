CREATE TABLE "ManagedPage" (
    "slug" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ManagedPage_pkey" PRIMARY KEY ("slug")
);
