import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from '@repositories/user-repository';
import { AuthService } from '@auth/service/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';

const mockRepository = () => ({});
const mockConfigService = () => ({});
const mockJwtService = () => ({});
const mockDataSource = () => ({});

type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;

describe('AuthService', (): void => {
  let service: AuthService;
  let userRepository: MockRepository<UserRepository>;
  let configService: ConfigService;
  let jwtService: JwtService;
  let dataSource: DataSource;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockRepository(),
        },
        {
          provide: ConfigService,
          useValue: mockConfigService(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: DataSource,
          useValue: mockDataSource(),
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(UserRepository));
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('service 파일 정의', (): void => {
    expect(service).toBeDefined();
  });
});
