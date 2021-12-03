import { Injectable } from '@nestjs/common';

interface KeyPair {
  privKey: string;
  pubKey: string;
}

@Injectable()
export class AppService {
  generateKeyPair(): KeyPair {
    const keyPair = {
      privKey: 'test',
      pubKey: 'test',
    };

    return keyPair;
  }
}
