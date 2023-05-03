import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends User {
  @ApiProperty({ example: 'test', description: 'User name' })
  @IsString()
  readonly username: string;

  @ApiProperty({ example: 'Abc@123', description: 'User password' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha fraca!',
  })
  readonly password: string;
}
