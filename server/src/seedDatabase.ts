import { AppDataSource } from './data-source';
import Device from './entity/Device';
import User from './entity/User';

export const seedDatabase = async () => {
  await AppDataSource.destroy();
  await AppDataSource.initialize();
  console.log('seeding DB with test data');

  const user: User = User.create({
    username: 'testuser',
    email: 'lol@metricsgreen',
    password: 'pwd',
    role: 'ADMIN'
  });
  await user.save();

  const device: Device = Device.create({
    name: 'Sensor 39',
    description: 'My NodeMCU 82660 based device',
    location: 'Helsinki',
    user: user
  });
  await device.save();

  return user;
};
