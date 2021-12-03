import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials-dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(200)
  signIn(@Body() credentials: CredentialsDto) {
    return this.authService.signIn(credentials);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Post('generate-key-pair')
  generateKeyPair(@Req() { user }: { user: UserDto }) {
    return this.authService.generateKeyPair(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Post('encrypt')
  encrypt(@Req() { user }: { user: UserDto }) {
    return this.authService.encryptResource(user);
  }
}
