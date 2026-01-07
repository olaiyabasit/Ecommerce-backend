import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('securepassword', 10);

    const roles = ['ADMIN', 'CUSTOMER']
    for(const role of roles){
        await prisma.role.upsert({
            where: {name: role},
            update: {},
            create: {name: role}
        })
    }
    console.log('Roles successfully seeded')
    
    const categories = ['Electronics', 'Clothing','Books', 'Toys and Games']
    for(const cat of categories){
        await prisma.category.upsert({
            where: {name: cat},
            update: {},create:{name: cat}
        })
    }
    console.log('Categories Seedded Successfully')

  const users = [
    { email: 'john@admin.com', name: 'John Admin', password: 'password123' },
    { email: 'jane@customer.com', name: 'Jane Customer', password: 'password123' },
    { email: 'bob@customer.com', name: 'Bob Customer', password: 'password123' },
  ];

  for (const u of users) {
    const roleName = u.email.endsWith('@admin.com') ? 'ADMIN' : 'CUSTOMER';

    const role = await prisma.role.findUnique({ where: { name: roleName } });

    if (!role) throw new Error(`Role ${roleName} not found, seed Roles first.`);

    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        password: hashedPassword, 
        role: { connect: { id: role.id } },
      },
    });
  }
  console.log('✅ Users seeded');
   
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });