-- CreateEnum
CREATE TYPE "public"."DemandStatus" AS ENUM ('NEW', 'ASSIGNED', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED', 'CANCELED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."SLAState" AS ENUM ('ON_TRACK', 'AT_RISK', 'BREACHED');

-- CreateTable
CREATE TABLE "public"."demand" (
    "id" UUID NOT NULL,
    "protocolNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contactId" UUID,
    "organizationId" UUID NOT NULL,
    "queueId" UUID NOT NULL,
    "status" "public"."DemandStatus" NOT NULL DEFAULT 'NEW',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "assignedToId" UUID,
    "slaStartAt" TIMESTAMP(3) NOT NULL,
    "slaDueAt" TIMESTAMP(3) NOT NULL,
    "slaBreachedAt" TIMESTAMP(3),
    "slaState" "public"."SLAState" NOT NULL DEFAULT 'ON_TRACK',
    "resolutionNotes" TEXT,
    "closedAt" TIMESTAMP(3),
    "createdById" UUID NOT NULL,
    "updatedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "demand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."queue" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defaultSlaId" UUID,
    "organizationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sla_plan" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "responseTimeMinutes" INTEGER NOT NULL,
    "resolutionTimeMinutes" INTEGER NOT NULL,
    "businessHours" JSONB,
    "organizationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sla_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."assignment" (
    "id" UUID NOT NULL,
    "demandId" UUID NOT NULL,
    "assignedToId" UUID NOT NULL,
    "assignedById" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassignedAt" TIMESTAMP(3),
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."status_history" (
    "id" UUID NOT NULL,
    "demandId" UUID NOT NULL,
    "fromStatus" "public"."DemandStatus" NOT NULL,
    "toStatus" "public"."DemandStatus" NOT NULL,
    "changedById" UUID NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comment" (
    "id" UUID NOT NULL,
    "demandId" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."attachment" (
    "id" UUID NOT NULL,
    "demandId" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedById" UUID NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "size" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tag" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "organizationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."demand_tag" (
    "id" UUID NOT NULL,
    "demandId" UUID NOT NULL,
    "tagId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "demand_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."escalation_rule" (
    "id" UUID NOT NULL,
    "queueId" UUID NOT NULL,
    "thresholdMinutes" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "targetUserId" UUID,
    "targetQueueId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escalation_rule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "demand_organizationId_status_idx" ON "public"."demand"("organizationId", "status");

-- CreateIndex
CREATE INDEX "demand_organizationId_assignedToId_idx" ON "public"."demand"("organizationId", "assignedToId");

-- CreateIndex
CREATE INDEX "demand_organizationId_slaDueAt_idx" ON "public"."demand"("organizationId", "slaDueAt");

-- CreateIndex
CREATE INDEX "demand_organizationId_createdAt_idx" ON "public"."demand"("organizationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "demand_organizationId_protocolNumber_key" ON "public"."demand"("organizationId", "protocolNumber");

-- CreateIndex
CREATE UNIQUE INDEX "tag_organizationId_name_key" ON "public"."tag"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "demand_tag_demandId_tagId_key" ON "public"."demand_tag"("demandId", "tagId");

-- AddForeignKey
ALTER TABLE "public"."demand" ADD CONSTRAINT "demand_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "public"."queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."queue" ADD CONSTRAINT "queue_defaultSlaId_fkey" FOREIGN KEY ("defaultSlaId") REFERENCES "public"."sla_plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assignment" ADD CONSTRAINT "assignment_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "public"."demand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."status_history" ADD CONSTRAINT "status_history_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "public"."demand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "public"."demand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attachment" ADD CONSTRAINT "attachment_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "public"."demand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."demand_tag" ADD CONSTRAINT "demand_tag_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "public"."demand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."demand_tag" ADD CONSTRAINT "demand_tag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."escalation_rule" ADD CONSTRAINT "escalation_rule_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "public"."queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."escalation_rule" ADD CONSTRAINT "escalation_rule_targetQueueId_fkey" FOREIGN KEY ("targetQueueId") REFERENCES "public"."queue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
