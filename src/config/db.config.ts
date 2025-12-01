import { PrismaClient } from '@prisma/client';

import { NODE_ENV } from './dotenv.config';

class Prisma {
  private prisma: PrismaClient;
  private static instance: Prisma;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): Prisma {
    if (NODE_ENV === 'production') {
      return new Prisma();
    }
    if (!this.instance) {
      this.instance = new Prisma();
    }
    return this.instance;
  }

  getClient(): PrismaClient {
    return this.prisma;
  }
}

const db = Prisma.getInstance();

export const prisma = db.getClient();
