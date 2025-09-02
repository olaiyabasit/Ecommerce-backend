import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: { name: 'ADMIN' },
    });

    const customerRole = await prisma.role.upsert({
        where: { name: 'CUSTOMER' },
        update: {},
        create: { name: 'CUSTOMER' },
    });

    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
          email: 'admin@example.com',
          name: 'Admin User',
          password: "securepassword", // Hash passwords before seeding
          roleId: adminRole.id,
        },
    });

    await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
          email: 'customer@example.com',
          name: 'Customer User',
          password: "securepassword", // Hash passwords before seeding
          roleId: customerRole.id,
        },
    });

    const electronics = await prisma.category.upsert({
        where: { name: 'Electronics' },
        update: {},
        create: { name: 'Electronics' },
    });

    const fashion = await prisma.category.upsert({
        where: { name: 'Fashion' },
        update: {},
        create: { name: 'Fashion' },
    });

   //Product seeding
    await prisma.product.upsert({
    where: { name: 'Macbook' },
    update: {},
    create: {
        name: 'Macbook',
        description: 'A fast apple macbook',
        price: 1200000,
        categoryId: electronics.id,
        },
    });

    await prisma.product.upsert({
    where: { name: 'Crop-Top' },
    update: {},
    create: {
        name: 'Crop-Top',
        description: 'Comfotable cotton crop-top',
        price: 25000,
        categoryId: fashion.id,
        },
    });

    console.log('Seeding successful');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });