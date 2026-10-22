-- Contracts: the employee is emailed a PDF of their signed contract, once.
ALTER TABLE "Contract" ADD COLUMN "employeeCopySentAt" TIMESTAMP(3);
