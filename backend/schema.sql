-- AssetFlow Database Schema
-- Run this SQL in your Neon Console (https://console.neon.tech)
-- Project: AssetFlow | Database: neondb

-- Department
CREATE TABLE IF NOT EXISTS "Department" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "headId" TEXT,
  "parentDeptId" TEXT,
  "status" TEXT NOT NULL DEFAULT 'Active',
  CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- Category
CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "customFields" JSONB,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- Employee
CREATE TABLE IF NOT EXISTS "Employee" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "departmentId" TEXT,
  "role" TEXT NOT NULL DEFAULT 'Employee',
  "status" TEXT NOT NULL DEFAULT 'Active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Employee_email_key" ON "Employee"("email");

-- Asset
CREATE TABLE IF NOT EXISTS "Asset" (
  "id" TEXT NOT NULL,
  "tag" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "serialNumber" TEXT,
  "acquisitionDate" TIMESTAMP(3),
  "acquisitionCost" DOUBLE PRECISION,
  "condition" TEXT,
  "location" TEXT,
  "photoUrl" TEXT,
  "isBookable" BOOLEAN NOT NULL DEFAULT false,
  "status" TEXT NOT NULL DEFAULT 'Available',
  "departmentId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Asset_tag_key" ON "Asset"("tag");

-- Allocation
CREATE TABLE IF NOT EXISTS "Allocation" (
  "id" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "departmentId" TEXT,
  "allocatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expectedReturnDate" TIMESTAMP(3),
  "returnedDate" TIMESTAMP(3),
  "conditionOnReturn" TEXT,
  "status" TEXT NOT NULL DEFAULT 'Active',
  CONSTRAINT "Allocation_pkey" PRIMARY KEY ("id")
);

-- TransferRequest
CREATE TABLE IF NOT EXISTS "TransferRequest" (
  "id" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "fromEmployeeId" TEXT NOT NULL,
  "toEmployeeId" TEXT NOT NULL,
  "reason" TEXT,
  "status" TEXT NOT NULL DEFAULT 'Requested',
  "requestedBy" TEXT NOT NULL,
  "approvedBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TransferRequest_pkey" PRIMARY KEY ("id")
);

-- ActivityLog
CREATE TABLE IF NOT EXISTS "ActivityLog" (
  "id" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "actionType" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "description" TEXT,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- Foreign Keys (add after all tables exist)
ALTER TABLE "Department" ADD CONSTRAINT IF NOT EXISTS "Department_headId_fkey"
  FOREIGN KEY ("headId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Department" ADD CONSTRAINT IF NOT EXISTS "Department_parentDeptId_fkey"
  FOREIGN KEY ("parentDeptId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Employee" ADD CONSTRAINT IF NOT EXISTS "Employee_departmentId_fkey"
  FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Asset" ADD CONSTRAINT IF NOT EXISTS "Asset_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Asset" ADD CONSTRAINT IF NOT EXISTS "Asset_departmentId_fkey"
  FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Allocation" ADD CONSTRAINT IF NOT EXISTS "Allocation_assetId_fkey"
  FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Allocation" ADD CONSTRAINT IF NOT EXISTS "Allocation_employeeId_fkey"
  FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "TransferRequest" ADD CONSTRAINT IF NOT EXISTS "TransferRequest_assetId_fkey"
  FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
