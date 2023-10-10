import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from '@auth/resolver/auth.resolver';
import { AuthService } from '@auth/service/auth.service';
import { LoginOutput } from '@auth/dto/login.dto';
import { User } from '@entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from '@repositories/user-repository';

const loginMockResult = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
};

const mockAuthService = () => ({
  login: jest.fn(() => loginMockResult),
});
const mockRepository = () => ({});
type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;

describe('AuthResolver', (): void => {
  let resolver: AuthResolver;
  let service: AuthService;
  let userRepository: MockRepository<UserRepository>;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService(),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(UserRepository));
  });

  it('should be defined', (): void => {
    expect(resolver).toBeDefined();
  });

  describe('로그인', (): void => {
    it('로그인 성공', async (): Promise<void> => {
      const input = {
        email: 'example@email.com',
        password: 'test1234',
      };

      const result: LoginOutput = await resolver.login(input, User.prototype);

      expect(service.login).toHaveBeenCalledTimes(1);
      expect(service.login).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(loginMockResult);
    });
  });

  describe('내 id 조회 조회', (): void => {
    it('내 id 조회 조회 성공', async (): Promise<void> => {
      const result: User = await resolver.me(User.prototype);

      expect(result).toEqual(User.prototype);
    });
  });
});
