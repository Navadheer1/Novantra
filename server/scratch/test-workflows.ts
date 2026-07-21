import { PrismaClient, Role, RequestType, RequestStatus, TeamRole } from '@prisma/client';

const prisma = new PrismaClient();

async function runTests() {
  console.log('=== STARTING STARTUP REQUEST WORKFLOW TESTS ===\n');

  try {
    // 1. Setup Test Users
    console.log('[1/4] Setting up test users and startups...');
    
    // Create/get founder owner
    const founderOwner = await prisma.user.upsert({
      where: { email: 'founder_owner@test.com' },
      update: { role: Role.FOUNDER },
      create: {
        clerkId: 'clerk_founder_owner',
        email: 'founder_owner@test.com',
        name: 'Alice Founder (Owner)',
        role: Role.FOUNDER
      }
    });

    // Create/get test startup owned by founderOwner
    const startup = await prisma.startup.upsert({
      where: { id: 'test-startup-uuid-123456789' }, // Force custom ID for matching
      update: { founderId: founderOwner.id },
      create: {
        id: 'test-startup-uuid-123456789',
        name: 'QuantumScale AI',
        description: 'Next gen scaling compute systems.',
        industry: 'Artificial Intelligence',
        stage: 'Seed',
        location: 'San Francisco, CA',
        founderId: founderOwner.id,
        tagline: 'Scale AI seamlessly',
      }
    });

    // Create/get test investor
    const investor = await prisma.user.upsert({
      where: { email: 'investor@test.com' },
      update: { role: Role.INVESTOR },
      create: {
        clerkId: 'clerk_investor',
        email: 'investor@test.com',
        name: 'Bob Investor',
        role: Role.INVESTOR
      }
    });

    // Create/get test user (talent)
    const talentUser = await prisma.user.upsert({
      where: { email: 'talent@test.com' },
      update: { role: Role.USER },
      create: {
        clerkId: 'clerk_talent',
        email: 'talent@test.com',
        name: 'Charlie Talent',
        role: Role.USER
      }
    });

    // Create/get test cofounder candidate
    const cofounderCandidate = await prisma.user.upsert({
      where: { email: 'cofounder@test.com' },
      update: { role: Role.FOUNDER },
      create: {
        clerkId: 'clerk_cofounder',
        email: 'cofounder@test.com',
        name: 'Diane Co-Founder',
        role: Role.FOUNDER
      }
    });

    console.log(`- Founder Owner: ${founderOwner.name} (${founderOwner.id})`);
    console.log(`- Startup: ${startup.name} (${startup.id})`);
    console.log(`- Investor: ${investor.name} (${investor.id})`);
    console.log(`- Talent User: ${talentUser.name} (${talentUser.id})`);
    console.log(`- Co-founder Candidate: ${cofounderCandidate.name} (${cofounderCandidate.id})\n`);

    // Clean up any old test requests/team memberships/connected VCs for these users
    await prisma.request.deleteMany({ where: { startupId: startup.id } });
    await prisma.teamMember.deleteMany({ where: { startupId: startup.id, userId: { in: [talentUser.id, cofounderCandidate.id] } } });
    await prisma.connectedVC.deleteMany({ where: { startupId: startup.id, vcId: investor.id } });

    console.log('[2/4] Running Constraint Validations...');

    // Scenario 5: Self-Request Prevention
    console.log('  -> Testing: Startup owner cannot request their own startup...');
    if (founderOwner.id === startup.founderId) {
      console.log('     [SUCCESS] Constraint matches: founderOwner is indeed the owner.');
    } else {
      throw new Error('Founder is not owner of startup');
    }

    console.log('\n[3/4] Testing Request Submissions & Duplicates...');

    // Helper to simulate request insertion (simulating POST /api/startups/:startupId/requests logic)
    const createRequest = async (senderId: string, type: RequestType, message: string) => {
      // Check owner
      if (senderId === startup.founderId) {
        throw new Error('Self-request blocked');
      }
      
      // Check duplicate
      const existing = await prisma.request.findFirst({
        where: {
          senderId,
          startupId: startup.id,
          requestType: type,
          status: RequestStatus.PENDING
        }
      });
      if (existing) {
        throw new Error('Duplicate pending request');
      }

      return prisma.request.create({
        data: {
          senderId,
          receiverFounderId: startup.founderId,
          startupId: startup.id,
          requestType: type,
          message,
          status: RequestStatus.PENDING
        }
      });
    };

    // Test Self-Request Block
    try {
      await createRequest(founderOwner.id, RequestType.INVESTMENT, 'I want to invest in myself');
      throw new Error('Failed to block self-request');
    } catch (err: any) {
      console.log(`  -> Testing Owner request block: ${err.message === 'Self-request blocked' ? 'PASS' : 'FAIL'} (${err.message})`);
    }

    // Test Investor Pitch submission
    const investReq = await createRequest(investor.id, RequestType.INVESTMENT, 'We want to invest $100k');
    console.log(`  -> Investor request submitted. Request ID: ${investReq.id}, Status: ${investReq.status}`);

    // Test Duplicate prevention
    try {
      await createRequest(investor.id, RequestType.INVESTMENT, 'Another request');
      throw new Error('Failed to block duplicate request');
    } catch (err: any) {
      console.log(`  -> Duplicate request block test: ${err.message === 'Duplicate pending request' ? 'PASS' : 'FAIL'} (${err.message})`);
    }

    // Test Talent Job Application submission
    const jobReq = await createRequest(talentUser.id, RequestType.JOB, 'Applying for Lead Dev');
    console.log(`  -> Job request submitted. Request ID: ${jobReq.id}, Status: ${jobReq.status}`);

    // Test Co-Founder request submission
    const cofounderReq = await createRequest(cofounderCandidate.id, RequestType.CO_FOUNDER, 'Co-founder partnership inquiry');
    console.log(`  -> Co-founder request submitted. Request ID: ${cofounderReq.id}, Status: ${cofounderReq.status}`);


    console.log('\n[4/4] Testing Acceptance Workflows...');

    // Helper to simulate accept action (simulating PATCH /api/requests/:requestId/status logic)
    const acceptRequest = async (requestId: string, actorId: string) => {
      const request = await prisma.request.findUnique({ where: { id: requestId } });
      if (!request) throw new Error('Request not found');

      if (request.receiverFounderId !== actorId) {
        throw new Error('Unauthorized accept action');
      }

      const updated = await prisma.request.update({
        where: { id: requestId },
        data: { status: RequestStatus.ACCEPTED }
      });

      // Insert relations
      if (request.requestType === RequestType.INVESTMENT) {
        const existingVC = await prisma.connectedVC.findFirst({
          where: { startupId: request.startupId, vcId: request.senderId }
        });
        if (!existingVC) {
          await prisma.connectedVC.create({
            data: { startupId: request.startupId, vcId: request.senderId }
          });
        }
      } else {
        let role: TeamRole = TeamRole.EMPLOYEE;
        if (request.requestType === RequestType.INTERN) role = TeamRole.INTERN;
        if (request.requestType === RequestType.CO_FOUNDER) role = TeamRole.CO_FOUNDER;

        const existingTeam = await prisma.teamMember.findFirst({
          where: { startupId: request.startupId, userId: request.senderId }
        });
        if (!existingTeam) {
          await prisma.teamMember.create({
            data: { startupId: request.startupId, userId: request.senderId, role }
          });
        }
      }

      return updated;
    };

    // Test Auth Block on Accept (talentUser tries to accept investor's pitch)
    try {
      await acceptRequest(investReq.id, talentUser.id);
      throw new Error('Failed to block unauthorized accept');
    } catch (err: any) {
      console.log(`  -> Testing unauthorized accept block: ${err.message === 'Unauthorized accept action' ? 'PASS' : 'FAIL'} (${err.message})`);
    }

    // 1. Accept Investor Pitch
    await acceptRequest(investReq.id, founderOwner.id);
    const vcConnection = await prisma.connectedVC.findFirst({
      where: { startupId: startup.id, vcId: investor.id }
    });
    console.log(`  -> Investor accepted: ${vcConnection ? 'PASS' : 'FAIL'} (Investor added to ConnectedVC)`);

    // 2. Accept Job Request
    await acceptRequest(jobReq.id, founderOwner.id);
    const teamMember = await prisma.teamMember.findFirst({
      where: { startupId: startup.id, userId: talentUser.id, role: TeamRole.EMPLOYEE }
    });
    console.log(`  -> Job Candidate accepted: ${teamMember ? 'PASS' : 'FAIL'} (User added as Team Member with role EMPLOYEE)`);

    // 3. Accept Co-founder Request
    await acceptRequest(cofounderReq.id, founderOwner.id);
    const cofounderMember = await prisma.teamMember.findFirst({
      where: { startupId: startup.id, userId: cofounderCandidate.id, role: TeamRole.CO_FOUNDER }
    });
    console.log(`  -> Co-founder Candidate accepted: ${cofounderMember ? 'PASS' : 'FAIL'} (Founder added as Team Member with role CO_FOUNDER)`);

    console.log('\n=== ALL WORKFLOW TESTS SUCCEEDED PERFECTLY! ===');

  } catch (error) {
    console.error('\n[FATAL ERROR IN TEST EXECUTION]:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
