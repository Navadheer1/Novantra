import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const oldFounderId = 'd3198611-5bd8-4f92-8593-ac0682acf454'; // Nayudu Navadheer (clerk user_3EqM3ErSuuwVAKxWQqZjUDVMiny)
    const newFounderId = 'd3820aeb-4867-48a5-9efb-8e08e410700f'; // Navadheer Nayudu (clerk user_3ErbxPahcsVtgTEy2m8661B8w6x)

    console.log(`Reassigning startups from ${oldFounderId} to ${newFounderId}...`);

    // Update startup founderId
    const updatedStartups = await prisma.startup.updateMany({
      where: { founderId: oldFounderId },
      data: { founderId: newFounderId }
    });

    console.log(`Updated ${updatedStartups.count} startups.`);

    // Update requests receiverFounderId
    const updatedRequests = await prisma.request.updateMany({
      where: { receiverFounderId: oldFounderId },
      data: { receiverFounderId: newFounderId }
    });

    console.log(`Updated ${updatedRequests.count} requests.`);

    console.log("Migration complete!");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
