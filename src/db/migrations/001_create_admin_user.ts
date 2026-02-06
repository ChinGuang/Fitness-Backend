import 'dotenv/config';
import { User } from "../../entity/User";
import { AppDataSource } from "../data-source";
import { PasswordUtils } from '../../modules/auth';

const args = process.argv.slice(2);
const name = args[0];
const password = args[1];

async function createAdminUser(payload: { name: string; password: string }) {
  await AppDataSource.initialize();
  const user = new User();
  user.name = payload.name;
  user.password = await PasswordUtils.hashPassword(payload.password);
  await AppDataSource.manager.save(User, user);
  await AppDataSource.destroy();
}

if (name && password) {
  createAdminUser({ name, password }).then(() => {
    console.log('Admin user created successfully');
  });
} else {
  console.log('Please provide a name and password');
}
