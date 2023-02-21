import { DataSource } from 'typeorm';
import 'reflect-metadata';
import User from './entity/User';
import Device from './entity/Device';
import Sensor from './entity/Sensor';
import Metric from './entity/Metric';
import Reading from './entity/Reading';
//import UserRole from './entity/UserRole';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'metricsGreen_db',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  synchronize: true,
  dropSchema: true,
  logging: true,
  entities: [User, Device, Sensor, Metric, Reading],
  subscribers: [],
  migrations: ['.src/migration']
});
