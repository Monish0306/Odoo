require('dotenv').config();
const { PrismaNeonHttp } = require('@prisma/adapter-neon');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaNeonHttp(connectionString, {});
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
