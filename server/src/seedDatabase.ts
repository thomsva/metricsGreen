import { AppDataSource } from './data-source';
import Device from './entity/Device';
import User from './entity/User';
import { faker } from '@faker-js/faker';
import Sensor from './entity/Sensor';
import Reading from './entity/Reading';

export const seedDatabase = async () => {
  await AppDataSource.destroy();
  await AppDataSource.initialize();
  console.log('seeding DB with test data');

  const adminUser = User.create({
    id: '05355f26-78ab-45b7-bd3f-138734fec52e',
    username: 'admin',
    email: 'admin@metrics.green',
    password: 'pwd',
    role: 'ADMIN'
  });
  const user1 = User.create({
    id: 'd53d90b7-dfd0-4f58-b6b5-5262f11c0878',
    username: 'don',
    email: 'don@scdp.com',
    password: 'pwd',
    role: 'USER'
  });
  const user2 = User.create({
    id: '7b84e059-87a9-496b-a441-edade172f432',
    username: 'peggy',
    email: 'peggy@scdp.com',
    password: 'pwd',
    role: 'USER'
  });

  await adminUser.save();
  await user1.save();
  await user2.save();

  const device: Device = Device.create({
    id: 'e7f27f18-e7c5-43b3-9fc5-3933e7aad707',
    name: 'Fake device',
    description: 'My NodeMCU 82660 based device',
    location: 'Helsinki',
    user: user1
  });
  await device.save();

  const sensor: Sensor = Sensor.create({
    id: '73086b39-d26f-490a-885b-ea64695a0c08',
    name: 'Speed sensor',
    unit: 'km/h',
    device: device
  });
  await sensor.save();

  let previousContent = 50;
  for (let i = 0; i <= 24; i++) {
    const content = previousContent + Math.random() * 10 - 5;
    const reading: Reading = Reading.create({
      sensor: sensor,
      content: content,
      createdAt: `2023-03-08 ${i < 10 ? '0' : ''}${i}:00:00.000000`
    });
    await reading.save();
    previousContent = content;
  }

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
