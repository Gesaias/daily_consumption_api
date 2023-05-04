import { DataSource, Repository } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';
import { User } from 'src/app/users/entities/user.entity';
import { Logger } from '@nestjs/common';

export class UserSeeder implements Seeder {
  constructor(private readonly logger: Logger = new Logger(UserSeeder.name)) {}

  async run(dataSource: DataSource): Promise<void> {
    const usersRepository: Repository<User> = dataSource.getRepository(User);

    const userData = {
      username: 'admin',
      password: await bcrypt.hash('Abc@123456', 10),
    };

    const user: User = await usersRepository.findOne({
      where: { username: userData.username },
    });

    if (user) {
      this.logger.log('Seed create user not-run, user exists');
      return;
    }

    const newUser: User = usersRepository.create(userData);
    await usersRepository.save(newUser);

    this.logger.log('Seed create user run successfully');
  }
}
