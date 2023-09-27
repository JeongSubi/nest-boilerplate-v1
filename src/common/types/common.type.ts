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
