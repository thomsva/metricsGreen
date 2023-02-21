import Device from './entity/Device';
import User from './entity/User';

export const seedDatabase = async () => {
  const sensor: Device = Device.create({
    name: 'Sensor 39',
    type: 'NodeMCU 82660',
    description: 'Some text here',
    location: 'Helsinki'
  });
  await sensor.save();

  const user: User = User.create({
    nickname: 'testuser',
    email: 'lol@metricsgreen',
    password: 'pwd',
    role: 'ADMIN'
  });
  await user.save();

  return user;
};
