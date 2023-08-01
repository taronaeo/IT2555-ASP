const USER = null;
const VENDOR = 'vendors-kjv3b';
const SUPPORT = 'NOT_IMPLEMENTED';

export type AuthTenant = typeof USER | typeof VENDOR | typeof SUPPORT;
export type AuthTenantMap = {
  USER: typeof USER;
  VENDOR: typeof VENDOR;
  SUPPORT: typeof SUPPORT;
};

export const AuthTenant: AuthTenantMap = {
  USER,
  VENDOR,
  SUPPORT,
};

const UNKNOWN = 'Something went wrong, please try again in a while';
const RATE_LIMIT = "You're too fast, slow down and try again in a while";
const EMAIL_EXISTS = 'Email already exists, please login instead';
const INVALID_ACCOUNT = 'Invalid email or password, please try again';

export const AuthErrorMessage = {
  UNKNOWN,
  RATE_LIMIT,
  EMAIL_EXISTS,
  INVALID_ACCOUNT,
};
