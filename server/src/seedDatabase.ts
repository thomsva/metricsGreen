import Device from './entity/Device';
import User from './entity/User';

export const seedDatabase = async () => {
  const user: User = User.create({
    nickname: 'testuser',
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
