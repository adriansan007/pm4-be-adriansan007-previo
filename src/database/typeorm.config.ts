import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

if (!process.env.DB_HOST) throw new Error('Falta DB_HOST en el .env');
if (!process.env.DB_PORT) throw new Error('Falta DB_PORT en el .env');
if (!process.env.DB_USERNAME) throw new Error('Falta DB_USERNAME en el .env');
if (!process.env.DB_PASSWORD) throw new Error('Falta DB_PASSWORD en el .env');
if (!process.env.DB_NAME) throw new Error('Falta DB_NAME en el .env');

// Detecta si estamos corriendo desde dist (JS) o src (TS)
const isCompiled = __dirname.includes('dist');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: isCompiled ? ['dist/**/*.entity.js'] : ['src/**/*.entity.ts'],
  migrations: isCompiled
    ? ['dist/database/migrations/*.js']
    : ['src/database/migrations/*.ts'],

  migrationsRun: false,

  synchronize: true,
});
