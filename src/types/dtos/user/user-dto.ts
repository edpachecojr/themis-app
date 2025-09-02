export type UserDto = {
  id?: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string;
};

export type SessionDto = {
  id?: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
};

export type AccountDto = {
  id?: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  password?: string;
};

export type VerificationDto = {
  id?: string;
  identifier: string;
  value: string;
  expiresAt: Date;
};
