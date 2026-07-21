import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("=== USERS IN DB ===");
    const users = await prisma.user.findMany();
    for (const u of users) {
      console.log(`- ID: ${u.id}, ClerkID: ${u.clerkId}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
    }

    console.log("\n=== STARTUPS IN DB ===");
    const startups = await prisma.startup.findMany({
      include: { founder: true }
    });
    for (const s of startups) {
      console.log(`- ID: ${s.id}, Name: ${s.name}, FounderName: ${s.founder.name}, FounderID: ${s.founder.id}, FounderRole: ${s.founder.role}`);
    }

    console.log("\n=== REQUESTS IN DB ===");
    const requests = await prisma.request.findMany({
      include: {
        sender: true,
        receiverFounder: true,
        startup: true
      }
    });
    for (const r of requests) {
      console.log(`- ID: ${r.id}`);
      console.log(`  Sender: ${r.sender.name} (${r.sender.role}, ID: ${r.senderId})`);
      console.log(`  Receiver Founder: ${r.receiverFounder.name} (${r.receiverFounder.role}, ID: ${r.receiverFounderId})`);
      console.log(`  Startup: ${r.startup.name} (ID: ${r.startupId})`);
      console.log(`  Type: ${r.requestType}, Status: ${r.status}, Message: ${r.message}`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
