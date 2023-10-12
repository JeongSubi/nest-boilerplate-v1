import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@repositories/user-repository';
import { UsersService } from '@modules/users/users.service';
import { CreateUserInput } from '@modules/users/dto/create-user.dto';
import { ConflictError } from '@error/ConflictError';
import { ErrorCode } from '@enums/ErrorCodeEnum';
import { DeleteUserOutput } from '@modules/users/dto/delete-user.dto';

const mockRepository = () => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  softRemove: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository<UserRepository>;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(UserRepository));
  });

  it('service 파일 정의', (): void => {
    expect(service).toBeDefined();
  });

  describe('회원가입', (): void => {
    const input: CreateUserInput = CreateUserInput.toDto({
      email: 'example@email.com',
      password: 'test1234!!',
      name: 'name',
      nickName: 'nickName',
      phoneNumber: '01011112222',
    });

    const mockResults = {
      ok: true,
      results: {
        user: {
          id: 1,
          ...input,
        },
      },
    };

    it('회원가입 성공', async (): Promise<void> => {
      userRepository.findOneBy.mockResolvedValue(undefined);
      userRepository.save.mockResolvedValue({ id: 1, ...input });

      const result = await service.createUser(input);

      expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'example@email.com' });
      expect(userRepository.save).toHaveBeenCalledWith(input);
      expect(result).toMatchObject(mockResults);
    });

    it('회원가입 실패 - 이미 존재하는 유저', async (): Promise<void> => {
      userRepository.findOneBy.mockResolvedValue({ id: 1 });

      await expect(service.createUser(input)).rejects.toThrow(
        new ConflictError('There is a user with that email already', ErrorCode.DUPLICATED_EMAIL),
      );

      expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(0);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'example@email.com' });
    });
  });

  describe('회원탈퇴', (): void => {
    const deleteUserArgs = {
      password: 'test1234!!',
    };

    const mockResults = {
      ok: true,
      results: 'user deleted',
    };

    it('회원탈퇴 성공', async (): Promise<void> => {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'example@email.com',
        password: 'test1234!!',
        checkPassword: (): boolean => {
          return true;
        },
      });

      userRepository.softRemove.mockResolvedValue(undefined);

      const result: DeleteUserOutput = await service.deleteUser({ id: 1 }, deleteUserArgs);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.softRemove).toHaveBeenCalledTimes(1);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, email: true, password: true },
      });
      expect(userRepository.softRemove).toHaveBeenCalledWith(expect.any(Object));

      expect(result).toMatchObject(mockResults);
    });

    it('회원탈퇴 실패 - 비밀번호 불일치', async (): Promise<void> => {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'example@email.com',
        password: 'test1234!!',
        checkPassword: (): boolean => {
          return false;
        },
      });

      await expect(service.deleteUser({ id: 1 }, deleteUserArgs)).rejects.toThrow(
        new UnauthorizedException('wrong password', ErrorCode.INVALID_PASSWORD),
      );

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.softRemove).toHaveBeenCalledTimes(0);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, email: true, password: true },
      });
    });
  });
});
