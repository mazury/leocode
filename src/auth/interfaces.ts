export interface JwtPayload {
  email: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}
