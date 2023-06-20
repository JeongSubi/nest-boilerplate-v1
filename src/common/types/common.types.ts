type JwtPayload = {
  userId: number;
  issuer: string;
};

type JwtDecodeWithExpired = {
  userId?: number;
  issuer?: string;
  iat?: number;
  exp?: number;
  isTokenExpired: boolean;
};
