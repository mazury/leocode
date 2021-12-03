import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserDto } from '../auth/dto/user.dto';

@Injectable()
export class UsersService {
  private users = [
    {
      id: '1',
      email: 'test@leocode.com',
      password: 'qwerty',
      publicKey: null,
    },
    {
      id: '2',
      email: 'user2@mail.com',
      password: 'asd',
      publicKey: null,
    },
  ];

  findOne(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  setPublicKey(user: UserDto, key: string): void {
    const { email } = user;
    const newUser = this.users.find((user) => user.email === email);
    newUser.publicKey = key;
    this.users = this.users.map((user) => {
      return user.email === email ? newUser : user;
    });
  }
}
