import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from '@modules/users/resolvers/users.resolver';
import { UsersService } from '@modules/users/services/users.service';
import { CreateUserInput, CreateUserOutput } from '@modules/users/dto/create-user.dto';
import { User } from '@entities/user.entity';
import { DeleteUserOutput } from '@modules/users/dto/delete-user.dto';

const signUpMockResult = {
  ok: true,
  error: null,
  results: {
    id: 1,
    email: 'example.email.com',
    password: 'test1234!!',
    name: 'name',
    nickName: 'nickName',
    phoneNumber: '01011112222',
  },
};

const signOutMockResult = {
  ok: true,
  error: null,
  results: 'user deleted',
};

const mockUsersService = () => ({
  createUser: jest.fn(() => signUpMockResult),
  deleteUser: jest.fn(() => signOutMockResult),
});

describe('UserResolver', (): void => {
  let resolver: UsersResolver;
  let service: UsersService;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: mockUsersService(),
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', (): void => {
    expect(resolver).toBeDefined();
  });

  describe('회원가입', (): void => {
    it('회원가입 성공', async (): Promise<void> => {
      const input = CreateUserInput.toDto({
        email: 'example@email.com',
        password: 'test1234!!',
        name: 'name',
        nickName: 'nickName',
        phoneNumber: '01011112222',
      });

      const result: CreateUserOutput = await resolver.signUp(input);

      expect(service.createUser).toHaveBeenCalledTimes(1);
      expect(service.createUser).toHaveBeenCalledWith(input);
      expect(result).toEqual(signUpMockResult);
    });
  });

  describe('회원탈퇴', (): void => {
    it('회원탈퇴 성공', async (): Promise<void> => {
      const input = {
        password: 'test1234!!',
      };

      const result: DeleteUserOutput = await resolver.signOut(User.prototype, input);

      expect(service.deleteUser).toHaveBeenCalledTimes(1);
      expect(service.deleteUser).toHaveBeenCalledWith({}, input);
      expect(result).toEqual(signOutMockResult);
    });
  });
});
