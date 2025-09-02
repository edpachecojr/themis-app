// ============================================================================
// EXAMPLES FOR DEMAND/PROTOCOL + QUEUE + SLA + WORKFLOW DOMAIN
// ============================================================================
// This file contains seed examples and Prisma Client usage patterns

import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// ============================================================================
// SEED SCRIPT - Assumes existing organization and contact IDs
// ============================================================================

// Constants for existing entities (these should already exist in your database)
const EXISTING_ORGANIZATION_ID = "550e8400-e29b-41d4-a716-446655440000"; // Replace with actual UUID
const EXISTING_CONTACT_ID = "550e8400-e29b-41d4-a716-446655440001"; // Replace with actual UUID

async function seed() {
  try {
    console.log("Starting seed...");

    // Create Users
    const user1 = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: "John Doe",
        email: "john.doe@example.com",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const user2 = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: "Jane Smith",
        email: "jane.smith@example.com",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("Users created:", { user1: user1.id, user2: user2.id });

    // Create SLA Plan
    const slaPlan = await prisma.sLAPlan.create({
      data: {
        id: randomUUID(),
        name: "Standard SLA",
        responseTimeMinutes: 60,
        resolutionTimeMinutes: 1440, // 24 hours
        businessHours: {
          monday: { start: "09:00", end: "18:00" },
          tuesday: { start: "09:00", end: "18:00" },
          wednesday: { start: "09:00", end: "18:00" },
          thursday: { start: "09:00", end: "18:00" },
          friday: { start: "09:00", end: "18:00" },
        },
        organizationId: EXISTING_ORGANIZATION_ID,
      },
    });

    console.log("SLA Plan created:", slaPlan.id);

    // Create Queue
    const queue = await prisma.queue.create({
      data: {
        id: randomUUID(),
        name: "General Support",
        description: "General customer support requests",
        defaultSlaId: slaPlan.id,
        organizationId: EXISTING_ORGANIZATION_ID,
      },
    });

    console.log("Queue created:", queue.id);

    // Create Demands with different statuses and SLA deadlines
    const now = new Date();

    // Demand 1: New (SLA on track)
    const demand1 = await prisma.demand.create({
      data: {
        id: randomUUID(),
        protocolNumber: "001", // This should be generated sequentially in real app
        title: "Password Reset Request",
        description: "User cannot access their account",
        contactId: EXISTING_CONTACT_ID,
        organizationId: EXISTING_ORGANIZATION_ID,
        queueId: queue.id,
        status: "NEW",
        priority: "MEDIUM",
        slaStartAt: now,
        slaDueAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours from now
        createdById: user1.id,
        updatedById: user1.id,
      },
    });

    // Demand 2: Assigned (SLA at risk)
    const demand2 = await prisma.demand.create({
      data: {
        id: randomUUID(),
        protocolNumber: "002",
        title: "Software Installation Issue",
        description: "Application fails to install on Windows 11",
        contactId: EXISTING_CONTACT_ID,
        organizationId: EXISTING_ORGANIZATION_ID,
        queueId: queue.id,
        status: "ASSIGNED",
        priority: "HIGH",
        assignedToId: user2.id,
        slaStartAt: new Date(now.getTime() - 12 * 60 * 60 * 1000), // Started 12 hours ago
        slaDueAt: new Date(now.getTime() + 2 * 60 * 60 * 1000), // Due in 2 hours
        slaState: "AT_RISK",
        createdById: user1.id,
        updatedById: user2.id,
      },
    });

    // Demand 3: In Progress (SLA breached)
    const demand3 = await prisma.demand.create({
      data: {
        id: randomUUID(),
        protocolNumber: "003",
        title: "Critical System Outage",
        description: "Production system is down",
        contactId: EXISTING_CONTACT_ID,
        organizationId: EXISTING_ORGANIZATION_ID,
        queueId: queue.id,
        status: "IN_PROGRESS",
        priority: "URGENT",
        assignedToId: user1.id,
        slaStartAt: new Date(now.getTime() - 48 * 60 * 60 * 1000), // Started 48 hours ago
        slaDueAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Was due 24 hours ago
        slaState: "BREACHED",
        slaBreachedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        createdById: user2.id,
        updatedById: user1.id,
      },
    });

    console.log("Demands created:", {
      demand1: demand1.id,
      demand2: demand2.id,
      demand3: demand3.id,
    });

    // Create Assignment for demand2
    await prisma.assignment.create({
      data: {
        id: randomUUID(),
        demandId: demand2.id,
        assignedToId: user2.id,
        assignedById: user1.id,
        assignedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      },
    });

    // Create Assignment for demand3
    await prisma.assignment.create({
      data: {
        id: randomUUID(),
        demandId: demand3.id,
        assignedToId: user1.id,
        assignedById: user2.id,
        assignedAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      },
    });

    console.log("Assignments created");

    // Create some tags
    const tag1 = await prisma.tag.create({
      data: {
        id: randomUUID(),
        name: "Technical Issue",
        color: "#FF6B6B",
        organizationId: EXISTING_ORGANIZATION_ID,
      },
    });

    const tag2 = await prisma.tag.create({
      data: {
        id: randomUUID(),
        name: "High Priority",
        color: "#FFE66D",
        organizationId: EXISTING_ORGANIZATION_ID,
      },
    });

    console.log("Tags created:", { tag1: tag1.id, tag2: tag2.id });

    // Create DemandTag relationships
    await prisma.demandTag.create({
      data: {
        id: randomUUID(),
        demandId: demand1.id,
        tagId: tag1.id,
      },
    });

    await prisma.demandTag.create({
      data: {
        id: randomUUID(),
        demandId: demand2.id,
        tagId: tag1.id,
      },
    });

    await prisma.demandTag.create({
      data: {
        id: randomUUID(),
        demandId: demand2.id,
        tagId: tag2.id,
      },
    });

    await prisma.demandTag.create({
      data: {
        id: randomUUID(),
        demandId: demand3.id,
        tagId: tag2.id,
      },
    });

    console.log("DemandTags created");

    console.log("✅ Seed completed successfully!");
    console.log("Created:", {
      users: 2,
      slaPlan: 1,
      queue: 1,
      demands: 3,
      assignments: 2,
      tags: 2,
      demandTags: 4,
    });
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// ============================================================================
// PRISMA CLIENT USAGE PATTERNS
// ============================================================================

// A) Create a Demand with sequential protocol number
async function createDemand(data: {
  title: string;
  description?: string;
  contactId: string;
  organizationId: string;
  queueId: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  slaStartAt: Date;
  slaDueAt: Date;
  createdById: string;
}) {
  return await prisma.$transaction(async (tx) => {
    // RECOMMENDED: Create a ProtocolCounter table for this
    // This is a simplified example - in production, you should have a dedicated table
    const lastDemand = await tx.demand.findFirst({
      where: { organizationId: data.organizationId },
      orderBy: { protocolNumber: "desc" },
      select: { protocolNumber: true },
    });

    const lastNumber = lastDemand ? parseInt(lastDemand.protocolNumber) : 0;
    const protocolNumber = (lastNumber + 1).toString().padStart(6, "0");

    // Create the demand
    return await tx.demand.create({
      data: {
        id: randomUUID(), // Application generates UUIDv4
        protocolNumber,
        ...data,
      },
    });
  });
}

// B) Assign a Demand to a User
async function assignDemand(
  demandId: string,
  assignedToId: string,
  assignedById: string,
  reason?: string
) {
  return await prisma.$transaction(async (tx) => {
    // Create assignment record
    const assignment = await tx.assignment.create({
      data: {
        id: randomUUID(),
        demandId,
        assignedToId,
        assignedById,
        reason,
      },
    });

    // Update demand
    const updatedDemand = await tx.demand.update({
      where: { id: demandId },
      data: {
        assignedToId,
        status: "ASSIGNED",
        updatedById: assignedById,
      },
    });

    return { assignment, demand: updatedDemand };
  });
}

// C) Change status and record StatusHistory
async function changeDemandStatus(
  demandId: string,
  newStatus: string,
  changedById: string,
  note?: string
) {
  return await prisma.$transaction(async (tx) => {
    // Get current status
    const currentDemand = await tx.demand.findUnique({
      where: { id: demandId },
      select: { status: true },
    });

    if (!currentDemand) throw new Error("Demand not found");

    // Create status history record
    const statusHistory = await tx.statusHistory.create({
      data: {
        id: randomUUID(),
        demandId,
        fromStatus: currentDemand.status,
        toStatus: newStatus as any,
        changedById,
        note,
      },
    });

    // Update demand status
    const updatedDemand = await tx.demand.update({
      where: { id: demandId },
      data: {
        status: newStatus as any,
        updatedById: changedById,
      },
    });

    return { statusHistory, demand: updatedDemand };
  });
}

// D) Query Demands in Queue ordered by SLA due date
async function getDemandsByQueueAndStatus(
  queueId: string,
  organizationId: string,
  statuses: string[]
) {
  return await prisma.demand.findMany({
    where: {
      queueId,
      organizationId,
      status: { in: statuses as any[] },
    },
    orderBy: { slaDueAt: "asc" },
    include: {
      queue: true,
      assignments: {
        orderBy: { assignedAt: "desc" },
        take: 1,
      },
    },
  });
}

// E) Find and update breached SLA demands
async function processBreachedSLAs(organizationId: string) {
  const now = new Date();

  // Find demands with breached SLA
  const breachedDemands = await prisma.demand.findMany({
    where: {
      organizationId,
      slaDueAt: { lt: now },
      slaBreachedAt: null,
      status: { notIn: ["RESOLVED", "CLOSED", "CANCELED"] },
    },
  });

  // Update them in batch
  if (breachedDemands.length > 0) {
    await prisma.demand.updateMany({
      where: {
        id: { in: breachedDemands.map((d) => d.id) },
      },
      data: {
        slaBreachedAt: now,
        slaState: "BREACHED",
      },
    });
  }

  return breachedDemands;
}

// F) Add comment to demand
async function addComment(
  demandId: string,
  authorId: string,
  body: string,
  isInternal: boolean = false
) {
  return await prisma.comment.create({
    data: {
      id: randomUUID(),
      demandId,
      authorId,
      body,
      isInternal,
    },
  });
}

// G) Add attachment to demand
async function addAttachment(
  demandId: string,
  uploadedById: string,
  filename: string,
  url: string,
  size: number
) {
  return await prisma.attachment.create({
    data: {
      id: randomUUID(),
      demandId,
      uploadedById,
      filename,
      url,
      size,
    },
  });
}

// H) Get demand with all related data
async function getDemandWithDetails(demandId: string) {
  return await prisma.demand.findUnique({
    where: { id: demandId },
    include: {
      queue: true,
      assignments: {
        orderBy: { assignedAt: "desc" },
      },
      statusHistory: {
        orderBy: { changedAt: "desc" },
      },
      comments: {
        where: { deletedAt: null },
        orderBy: { createdAt: "asc" },
      },
      attachments: {
        where: { deletedAt: null },
      },
      demandTags: {
        include: {
          tag: true,
        },
      },
    },
  });
}

// ============================================================================
// APPLICATION LOGIC REQUIREMENTS & RECOMMENDATIONS
// ============================================================================

/*
1. UUID Generation: 
   - Use crypto.randomUUID() or similar for all id fields
   - Never use @default(uuid()) in schema
   - Always generate UUIDs in application code before database operations

2. Protocol Sequence: 
   - Implement ProtocolCounter table with row-level locking
   - Use SELECT ... FOR UPDATE in transactions
   - Increment counter atomically per organization
   - Handle concurrent requests properly

3. SLA Processing: 
   - Implement background worker/job
   - Check for breached SLAs every few minutes
   - Update slaState and slaBreachedAt fields
   - Trigger escalation rules when thresholds are met

4. Escalation Worker: 
   - Background process for SLA breaches
   - Query EscalationRule table
   - Reassign demands to target users/queues
   - Update demand status and create assignment records
   - Send notifications to stakeholders

5. Soft Delete Implementation:
   - Always check deletedAt IS NULL in queries
   - Implement soft delete functions that set deletedAt
   - Consider implementing hard delete for cleanup jobs

6. Multi-tenancy:
   - Always filter by organizationId in queries
   - Use middleware to inject organizationId from user context
   - Implement row-level security if needed
*/

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

async function exampleUsage() {
  try {
    // Example 1: Create a new demand
    const newDemand = await createDemand({
      title: "New Feature Request",
      description: "User wants dark mode for the mobile app",
      contactId: EXISTING_CONTACT_ID,
      organizationId: EXISTING_ORGANIZATION_ID,
      queueId: "queue-id-here",
      priority: "MEDIUM",
      slaStartAt: new Date(),
      slaDueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdById: "user-id-here",
    });

    console.log("Created demand:", newDemand.protocolNumber);

    // Example 2: Assign demand to user
    const assignment = await assignDemand(
      newDemand.id,
      "assigned-user-id",
      "assigning-user-id",
      "Assigned for development"
    );

    console.log("Demand assigned:", assignment.demand.status);

    // Example 3: Change status
    const statusChange = await changeDemandStatus(
      newDemand.id,
      "IN_PROGRESS",
      "user-id-here",
      "Development started"
    );

    console.log("Status changed:", statusChange.demand.status);

    // Example 4: Get demands by queue
    const demands = await getDemandsByQueueAndStatus(
      "queue-id-here",
      EXISTING_ORGANIZATION_ID,
      ["NEW", "ASSIGNED"]
    );

    console.log("Found demands:", demands.length);

    // Example 5: Process breached SLAs
    const breached = await processBreachedSLAs(EXISTING_ORGANIZATION_ID);
    console.log("Breached SLAs:", breached.length);
  } catch (error) {
    console.error("Example usage failed:", error);
  }
}

// Export functions for use in other modules
export {
  seed,
  createDemand,
  assignDemand,
  changeDemandStatus,
  getDemandsByQueueAndStatus,
  processBreachedSLAs,
  addComment,
  addAttachment,
  getDemandWithDetails,
  exampleUsage,
};

// Uncomment to run seed
// seed().catch(console.error)

// Uncomment to run examples
// exampleUsage().catch(console.error)
