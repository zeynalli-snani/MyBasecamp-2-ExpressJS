const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {
      name: "Admin User",
      role: "admin",
      password: hashedPassword,
    },
    create: {
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin user seeded: admin@test.com / admin123");
}

main()
  .catch((error) => {
    console.error("Failed to seed admin user:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
