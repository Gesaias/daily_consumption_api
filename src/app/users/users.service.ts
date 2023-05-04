import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { USERS_REPOSITORY } from 'src/utils/constants/providers';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const data: User = await this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    const createdUser: User = await this.usersRepository.save(data);

    return { ...createdUser, password: undefined };
  }

  async findByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { username } });
  }
}
