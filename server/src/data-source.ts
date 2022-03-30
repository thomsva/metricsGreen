import { DataSource } from 'typeorm';
import 'reflect-metadata';
import User from './entity/User';
import Sensor from './entity/Sensor';
//import UserRole from './entity/UserRole';

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
  entities: [User, Sensor],
  subscribers: [],
  migrations: ['.src/migration']
});
