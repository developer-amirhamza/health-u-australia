-- Contracts: let the employee sign via an emailed link (see /contract/sign).
ALTER TABLE "Contract" ADD COLUMN "employeeSignature" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Contract" ADD COLUMN "employeeSignatureName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Contract" ADD COLUMN "employeeSignedDate" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Contract" ADD COLUMN "signingToken" TEXT;
ALTER TABLE "Contract" ADD COLUMN "signingTokenExpiresAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "Contract_signingToken_key" ON "Contract"("signingToken");
