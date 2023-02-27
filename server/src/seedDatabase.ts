import { AppDataSource } from './data-source';
import Device from './entity/Device';
import User from './entity/User';
import { faker } from '@faker-js/faker';

export const seedDatabase = async () => {
  await AppDataSource.destroy();
  await AppDataSource.initialize();
  console.log('seeding DB with test data');

  const adminUser = User.create({
    username: 'admin',
    email: 'admin@metrics.green',
    password: 'pwd',
    role: 'ADMIN'
  });
  const user1 = User.create({
    username: 'don',
    email: 'don@scdp.com',
    password: 'pwd',
    role: 'USER'
  });
  const user2 = User.create({
    username: 'peggy',
    email: 'peggy@scdp.com',
    password: 'pwd',
    role: 'USER'
  });

  await adminUser.save();
  await user1.save();
  await user2.save();

  const device: Device = Device.create({
    name: 'Fake device',
    description: 'My NodeMCU 82660 based device',
    location: 'Helsinki',
    user: user1
  });
  await device.save();

  const devices: Device[] = [];
  Array.from({ length: 10 }).forEach(() => {
    const device: Device = Device.create({
      name: faker.commerce.productName(),
      description: faker.hacker.phrase(),
      location: faker.address.cityName(),
      user: user2
    });
    devices.push(device);
  });
  await Device.save(devices);
};
