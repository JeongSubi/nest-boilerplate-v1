import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoomRepository } from '@repositories/room-repository';
import { UserRepository } from '@repositories/user-repository';
import { LikeRoomRepository } from '@repositories/like-room-repository';
import { RoomsService } from '@modules/rooms/services/rooms.service';

const mockRepository = () => ({});

type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;

describe('RoomsService', (): void => {
  let service: RoomsService;
  let roomRepository: MockRepository<RoomRepository>;
  let userRepository: MockRepository<UserRepository>;
  let likeRoomRepository: MockRepository<LikeRoomRepository>;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getRepositoryToken(RoomRepository),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(LikeRoomRepository),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<RoomsService>(RoomsService);
    roomRepository = module.get(getRepositoryToken(RoomRepository));
    userRepository = module.get(getRepositoryToken(UserRepository));
    likeRoomRepository = module.get(getRepositoryToken(LikeRoomRepository));
  });

  it('service 파일 정의', (): void => {
    expect(service).toBeDefined();
  });
});
