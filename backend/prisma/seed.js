require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../services/prisma');

const passwordHash = bcrypt.hashSync('Test@123', 10);

const roles = ['Admin', 'AssetManager', 'DeptHead'];
const employeeSeeds = [
  { name: 'Alice Admin', email: 'alice.admin@example.com', role: 'Admin' },
  { name: 'Bob Manager', email: 'bob.manager@example.com', role: 'AssetManager' },
  { name: 'Carol Head', email: 'carol.head@example.com', role: 'DeptHead' },
  { name: 'Derek Employee', email: 'derek.employee@example.com', role: 'Employee' },
  { name: 'Eve Employee', email: 'eve.employee@example.com', role: 'Employee' },
  { name: 'Frank Employee', email: 'frank.employee@example.com', role: 'Employee' },
];

async function seed() {
  const existingEmployees = await prisma.employee.findMany({ select: { email: true } });
  const existingEmails = new Set(existingEmployees.map((employee) => employee.email));

  for (const employee of employeeSeeds) {
    if (!existingEmails.has(employee.email)) {
      await prisma.employee.create({
        data: {
          name: employee.name,
          email: employee.email,
          passwordHash,
          role: employee.role,
          status: 'Active',
        },
      });
      existingEmails.add(employee.email);
    }
  }

  const departments = [
    { name: 'Engineering', status: 'Active' },
    { name: 'Operations', status: 'Active' },
    { name: 'Finance', status: 'Active' },
  ];

  const createdDepartments = [];
  for (const department of departments) {
    const existing = await prisma.department.findFirst({ where: { name: department.name } });
    if (!existing) {
      createdDepartments.push(await prisma.department.create({ data: department }));
    } else {
      createdDepartments.push(existing);
    }
  }

  const categories = [
    { name: 'Laptop' },
    { name: 'Monitor' },
    { name: 'Printer' },
    { name: 'Mobile Device' },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const existing = await prisma.category.findFirst({ where: { name: category.name } });
    if (!existing) {
      createdCategories.push(await prisma.category.create({ data: category }));
    } else {
      createdCategories.push(existing);
    }
  }

  const assets = [
    { name: 'MacBook Pro 14', categoryName: 'Laptop', tag: 'AF-0001', status: 'Available' },
    { name: 'Dell Monitor 27', categoryName: 'Monitor', tag: 'AF-0002', status: 'Available' },
    { name: 'HP LaserJet', categoryName: 'Printer', tag: 'AF-0003', status: 'Allocated' },
    { name: 'iPhone 15', categoryName: 'Mobile Device', tag: 'AF-0004', status: 'Allocated' },
    { name: 'ThinkPad X1', categoryName: 'Laptop', tag: 'AF-0005', status: 'Under Maintenance' },
    { name: 'Surface Pro', categoryName: 'Laptop', tag: 'AF-0006', status: 'Available' },
  ];

  const categoryMap = Object.fromEntries(createdCategories.map((category) => [category.name, category]));
  const departmentMap = Object.fromEntries(createdDepartments.map((department) => [department.name, department]));

  for (const asset of assets) {
    const existing = await prisma.asset.findFirst({ where: { tag: asset.tag } });
    if (!existing) {
      await prisma.asset.create({
        data: {
          name: asset.name,
          tag: asset.tag,
          categoryId: categoryMap[asset.categoryName].id,
          departmentId: departmentMap.Engineering.id,
          status: asset.status,
          serialNumber: `${asset.tag}-SN`,
          condition: 'Good',
        },
      });
    }
  }

  const employees = await prisma.employee.findMany({ where: { email: { in: employeeSeeds.map((employee) => employee.email) } } });
  const employeeMap = Object.fromEntries(employees.map((employee) => [employee.email, employee]));
  const assetRecords = await prisma.asset.findMany({ where: { tag: { in: assets.map((asset) => asset.tag) } } });
  const allocatedAssets = assetRecords.filter((asset) => asset.status === 'Allocated');

  for (const [index, allocatedAsset] of allocatedAssets.entries()) {
    const employeeEmail = index === 0 ? 'derek.employee@example.com' : 'eve.employee@example.com';
    const employee = employeeMap[employeeEmail];
    const existingAllocation = await prisma.allocation.findFirst({ where: { assetId: allocatedAsset.id, status: 'Active' } });
    if (!existingAllocation && employee) {
      await prisma.allocation.create({
        data: {
          assetId: allocatedAsset.id,
          employeeId: employee.id,
          status: 'Active',
          expectedReturnDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        },
      });
    }
  }

  console.log('Seed completed successfully');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
