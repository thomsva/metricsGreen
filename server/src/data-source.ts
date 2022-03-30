import { DataSource } from 'typeorm';
import 'reflect-metadata';
import Book from './entity/Sensor';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  synchronize: true,
  dropSchema: true,
  logging: true,
  entities: [Book],
  subscribers: [],
  migrations: ['.src/migration']
});
