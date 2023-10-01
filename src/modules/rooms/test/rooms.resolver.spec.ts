import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from '../services/rooms.service';
import { RoomsResolver } from '../resolvers/rooms.resolver';
import { RoomsOutput } from '../dto/rooms.dto';
import { RoomOutput } from '../dto/room.dto';
import { LikeRoomOutput } from '../dto/like-room.dto';
import { User } from '../../../entities/user.entity';

const roomMockResult = {
  ok: true,
  error: null,
  results: {
    id: 1,
  },
};

const roomsMockResult = {
  ok: true,
  error: null,
  results: {
    rooms: [
      {
        id: 1,
      },
    ],
    hasNext: true,
    totalCount: 15,
  },
};

const likeRoomResult = {
  ok: true,
  error: null,
  results: {
    isLike: true,
  },
};

const mockRoomsService = () => ({
  getRoomList: jest.fn(() => roomsMockResult),
  getRoomById: jest.fn(() => roomMockResult),
  likeRoom: jest.fn(() => likeRoomResult),
});

describe('RoomResolver', (): void => {
  let resolver: RoomsResolver;
  let service: RoomsService;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsResolver,
        {
          provide: RoomsService,
          useValue: mockRoomsService(),
        },
      ],
    }).compile();

    resolver = module.get<RoomsResolver>(RoomsResolver);
    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', (): void => {
    expect(resolver).toBeDefined();
  });

  describe('room 목록 조회', (): void => {
    it('room 목록 조회 성공', async (): Promise<void> => {
      const input = {
        page: 1,
        size: 15,
        roomName: 'name',
      };

      const result: RoomsOutput = await resolver.rooms(input);

      expect(service.getRoomList).toHaveBeenCalledTimes(1);
      expect(service.getRoomList).toHaveBeenCalledWith(input);
      expect(result).toEqual(roomsMockResult);
    });
  });

  describe('room 상세페이지 조회', (): void => {
    it('room 목록 상세페이지 조회 성공', async (): Promise<void> => {
      const input: { roomId: number } = {
        roomId: 1,
      };

      const result: RoomOutput = await resolver.room(input);

      expect(service.getRoomById).toHaveBeenCalledTimes(1);
      expect(service.getRoomById).toHaveBeenCalledWith(input);
      expect(result).toEqual(roomMockResult);
    });
  });

  describe('room 좋아요 기능', (): void => {
    it('room 좋아요 기능 성공', async (): Promise<void> => {
      const input: { roomId: number } = {
        roomId: 1,
      };

      const result: LikeRoomOutput = await resolver.likeRoom(User.prototype, input);

      expect(service.likeRoom).toHaveBeenCalledTimes(1);
      expect(service.likeRoom).toHaveBeenCalledWith(input, {});
      expect(result).toEqual(likeRoomResult);
    });
  });
});
