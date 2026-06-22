import { prisma } from "@/lib/prisma";

async function main() {
  const checkIn = await prisma.checkIn.create({
    data: {
      user_id: "cc952189-2b87-4b78-9e07-d066216ce14e",
      gym_id: "cbce275c-ad01-41c5-8ae4-b79e827bf078"
    }
  });

  console.log(checkIn);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });