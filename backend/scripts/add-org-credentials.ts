import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get first organization
  const org = await prisma.organization.findFirst({
    include: {
      region: true,
    },
  });

  if (!org) {
    console.log('No organizations found in database');
    return;
  }

  console.log('Found organization:', {
    id: org.id,
    name: org.name,
    type: org.type,
    region: org.region.name,
  });

  // Update with credentials
  const login = 'school_admin';
  const password = 'password123';

  const updated = await prisma.organization.update({
    where: { id: org.id },
    data: {
      login,
      password,
    },
  });

  console.log('\n✅ Credentials added successfully!');
  console.log('Login:', login);
  console.log('Password:', password);
  console.log('\nYou can now log in at: /admin/login');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
