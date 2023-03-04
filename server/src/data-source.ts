import { DataSource } from 'typeorm';
import 'reflect-metadata';
import User from './entity/User';
import Device from './entity/Device';
import Sensor from './entity/Sensor';
import Reading from './entity/Reading';
//import UserRole from './entity/UserRole';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ? process.env.DB_HOST : 'metricsGreen_db',
  port: process.env.DB_PORT ? (process.env.DB_PORT as unknown as number) : 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  synchronize: true,
  dropSchema: true,
  logging: false,
  entities: [User, Device, Sensor, Reading],
  subscribers: [],
  migrations: ['.src/migration']
});
