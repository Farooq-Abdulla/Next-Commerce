import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import { env } from 'process';


const prismaClientSingleton = () => {
  const neon= new Pool({connectionString: env.POSTGRES_PRISMA_URL})
  const adapter= new PrismaNeon(neon)
  return new PrismaClient({adapter});
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma