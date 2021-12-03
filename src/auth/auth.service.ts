import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Credentials, JwtPayload, KeyPair } from './interfaces';
import { constants, generateKeyPairSync, publicEncrypt } from 'crypto';
import { UsersService } from '../users/users.service';
import { UserDto } from './dto/user.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private httpService: HttpService,
  ) {}

  signIn(credentials: Credentials): string {
    const user = this.usersService.findOne(credentials.email);

    if (!user) throw new UnauthorizedException('EMAIL_NOT_FOUND');

    if (user.password === credentials.password) {
      return this.generateToken({ email: credentials.email });
    }

    throw new UnauthorizedException('INVALID_PASSWORD');
  }

  async encryptResource(user: UserDto): Promise<string> {
    const url = 'http://www.africau.edu/images/default/sample.pdf';
    const data$ = this.httpService.get(url);
    const { data } = await firstValueFrom(data$);
    return this.encrypt(user.publicKey, data);
  }

  async generateKeyPair(user: UserDto): Promise<KeyPair> {
    const pair = await generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: 'secret',
      },
    });
    this.usersService.setPublicKey(user, pair.publicKey);
    return pair;
  }

  private encrypt(key: string, data: string): string {
    const encryptedBuff = data.match(/.{1,200}/g).map((part) => {
      return publicEncrypt(
        {
          key,
          padding: constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(part),
      );
    });

    const size = encryptedBuff.reduce((prev, curr) => {
      return prev + curr.length;
    }, 0);

    return Buffer.concat([...encryptedBuff], size).toString('base64');
  }

  private generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
