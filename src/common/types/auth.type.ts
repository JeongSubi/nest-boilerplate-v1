export interface TokenInfo {
  name: string;
  value: string;
  maxAge: number;
}

export interface JwtPayload {
  userId: number;
  issuer: string;
}

export interface JwtDecodeWithExpired {
  userId?: number;
  issuer?: string;
  iat?: number;
  exp?: number;
  isTokenExpired: boolean;
}
