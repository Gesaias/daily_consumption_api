import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';
import { User } from 'src/app/users/entities/user.entity';

export class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const usersRepository = dataSource.getRepository(User);

    const userData = {
      username: 'admin',
      password: await bcrypt.hash('Abc@123456', 10),
    };

    const newUser = usersRepository.create(userData);
    await usersRepository.save(newUser);
  }
}
