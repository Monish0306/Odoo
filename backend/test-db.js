require('dotenv').config();
const prisma = require('./services/prisma');
const bcrypt = require('bcryptjs');

async function test() {
  try {
    console.log('Testing DB connection...');
    const hash = await bcrypt.hash('pass123', 10);
    const emp = await prisma.employee.create({
      data: {
        name: 'Alice',
        email: `alice_${Date.now()}@test.com`,
        passwordHash: hash,
        role: 'Employee',
      },
    });
    console.log('SUCCESS. Created employee:', emp.id, emp.role);
    await prisma.employee.delete({ where: { id: emp.id } });
    console.log('Cleaned up.');
  } catch (err) {
    console.error('FULL ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
