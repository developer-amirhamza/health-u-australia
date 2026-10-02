-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "SilHouse" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "parking" INTEGER NOT NULL,
    "accessible" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL DEFAULT '',
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "legacyPath" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SilHouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SilHouseSetup" (
    "id" TEXT NOT NULL,

    CONSTRAINT "SilHouseSetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verify_email" BOOLEAN DEFAULT false,
    "verify_email_otp" TEXT,
    "verify_email_otp_expire" TIMESTAMP(6),
    "status" TEXT DEFAULT 'ACTIVE',
    "avatar" TEXT,
    "mobile" TEXT,
    "last_login_date" TIMESTAMP(6),
    "refresh_token" TEXT,
    "forgot_password_otp" TEXT,
    "forgot_password_expire" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT DEFAULT 'USER',
    "firstName" TEXT,
    "lastName" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScPlan" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "participant" TEXT NOT NULL,
    "ndisNumber" TEXT,
    "coordinator" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "travelRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "itemCode" TEXT NOT NULL,
    "travelItemCode" TEXT,
    "budget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "reportLeadDays" INTEGER NOT NULL DEFAULT 42,
    "color" TEXT NOT NULL DEFAULT '#2f6feb',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScTimeEntry" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "planId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "note" TEXT,
    "coordinator" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScTimeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceAgreement" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT,
    "participantName" TEXT NOT NULL,
    "participantNdisNumber" TEXT NOT NULL,
    "participantRepName" TEXT NOT NULL,
    "agreementStartDate" TEXT NOT NULL,
    "agreementEndDate" TEXT NOT NULL,
    "supportsProvided" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "livesAlone" TEXT NOT NULL DEFAULT '',
    "managementType" TEXT NOT NULL DEFAULT '',
    "planManagerName" TEXT NOT NULL DEFAULT '',
    "planManagerEmail" TEXT NOT NULL DEFAULT '',
    "cancellationPolicyAcknowledged" BOOLEAN NOT NULL DEFAULT false,
    "consentInfoConfidential" BOOLEAN NOT NULL DEFAULT false,
    "consentChangeAnytime" BOOLEAN NOT NULL DEFAULT false,
    "consentMedication" TEXT NOT NULL DEFAULT '',
    "consentMoneyManagement" TEXT NOT NULL DEFAULT '',
    "consentPhotosService" TEXT NOT NULL DEFAULT '',
    "consentPhotosMedia" TEXT NOT NULL DEFAULT '',
    "consentPublishFeedback" TEXT NOT NULL DEFAULT '',
    "contactAddress" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL DEFAULT '',
    "hasAlternativeContact" TEXT NOT NULL DEFAULT '',
    "altRelationship" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "altContactName" TEXT NOT NULL DEFAULT '',
    "altContactNumber" TEXT NOT NULL DEFAULT '',
    "altContactEmail" TEXT NOT NULL DEFAULT '',
    "orgContactName" TEXT NOT NULL DEFAULT 'Health U Australia',
    "orgPhone" TEXT NOT NULL DEFAULT '',
    "orgEmail" TEXT NOT NULL DEFAULT '',
    "orgPostalAddress" TEXT NOT NULL DEFAULT '',
    "quoteNumber" TEXT NOT NULL DEFAULT '',
    "quoteDate" TEXT NOT NULL DEFAULT '',
    "planStartDate" TEXT NOT NULL DEFAULT '',
    "planEndDate" TEXT NOT NULL DEFAULT '',
    "preparedBy" TEXT NOT NULL DEFAULT '',
    "contactPerson" TEXT NOT NULL DEFAULT '',
    "applyGst" BOOLEAN NOT NULL DEFAULT false,
    "items" JSONB NOT NULL DEFAULT '[]',
    "agreementExplained" BOOLEAN NOT NULL DEFAULT false,
    "participantSignature" TEXT NOT NULL DEFAULT '',
    "participantSignatureName" TEXT NOT NULL DEFAULT '',
    "participantSignedDate" TEXT NOT NULL DEFAULT '',
    "providerSignature" TEXT NOT NULL DEFAULT '',
    "providerSignatureName" TEXT NOT NULL DEFAULT '',
    "providerSignedDate" TEXT NOT NULL DEFAULT '',
    "signingToken" TEXT,
    "signingTokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "createdById" TEXT,
    "contractType" TEXT NOT NULL DEFAULT '',
    "employeeName" TEXT NOT NULL DEFAULT '',
    "employeeEmail" TEXT NOT NULL DEFAULT '',
    "position" TEXT NOT NULL DEFAULT '',
    "startDate" TEXT NOT NULL DEFAULT '',
    "data" JSONB NOT NULL DEFAULT '{}',
    "documentHtml" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SilHouse_legacyPath_key" ON "SilHouse"("legacyPath");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ScTimeEntry_planId_idx" ON "ScTimeEntry"("planId");

-- CreateIndex
CREATE INDEX "ScTimeEntry_date_idx" ON "ScTimeEntry"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceAgreement_signingToken_key" ON "ServiceAgreement"("signingToken");

-- CreateIndex
CREATE INDEX "ServiceAgreement_participantName_idx" ON "ServiceAgreement"("participantName");

-- CreateIndex
CREATE INDEX "ServiceAgreement_status_idx" ON "ServiceAgreement"("status");

-- CreateIndex
CREATE INDEX "Contract_employeeName_idx" ON "Contract"("employeeName");

-- CreateIndex
CREATE INDEX "Contract_status_idx" ON "Contract"("status");

-- AddForeignKey
ALTER TABLE "ScTimeEntry" ADD CONSTRAINT "ScTimeEntry_planId_fkey" FOREIGN KEY ("planId") REFERENCES "ScPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAgreement" ADD CONSTRAINT "ServiceAgreement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
