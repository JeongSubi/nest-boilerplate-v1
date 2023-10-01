// import { Test, TestingModule } from '@nestjs/testing';
// import { RoomRepository } from '../../../repositories/room-repository';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { RoomsService } from '../services/rooms.service';
// import { UserRepository } from '../../../repositories/user-repository';
// import { LikeRoomRepository } from '../../../repositories/like-room-repository';
// import { LikeRoomOutput } from '../dto/like-room.dto';
// import { User } from '../../../entities/user.entity';
// import { RoomsOutput } from '../dto/rooms.dto';
//
// const mockRepository = () => ({
//   getRoomBuilder: jest.fn(),
// });
//
// const mockCommonService = () => ({});
//
// type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;
//
// const roomMockResult = {
//   ok: true,
//   error: null,
//   results: {
//     id: 1,
//   },
// };
//
// const likeRoomResult = {
//   ok: true,
//   error: null,
//   results: {
//     isLike: true,
//   },
// };
// describe('RoomService', (): void => {
//   let service: RoomsService;
//   let roomRepository: MockRepository<RoomRepository>;
//   let userRepository: MockRepository<UserRepository>;
//   let likeRoomRepository: MockRepository<LikeRoomRepository>;
//
//   beforeEach(async (): Promise<void> => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         RoomsService,
//         {
//           provide: getRepositoryToken(RoomRepository),
//           useValue: mockRepository(),
//         },
//         {
//           provide: getRepositoryToken(UserRepository),
//           useValue: mockRepository(),
//         },
//         {
//           provide: getRepositoryToken(LikeRoomRepository),
//           useValue: mockRepository(),
//         },
//       ],
//     }).compile();
//
//     service = module.get<RoomsService>(RoomsService);
//     roomRepository = module.get(getRepositoryToken(RoomRepository));
//     userRepository = module.get(getRepositoryToken(UserRepository));
//     likeRoomRepository = module.get(getRepositoryToken(LikeRoomRepository));
//   });
//
//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
//
//   describe('room 목록조회 기능', (): void => {
//     const roomsMockResult = {
//       ok: true,
//       error: null,
//       results: {
//         rooms: [
//           {
//             id: 1,
//           },
//         ],
//         hasNext: true,
//         totalCount: 15,
//       },
//     };
//
//     const input = {
//       page: 1,
//       size: 15,
//       roomName: 'name',
//     };
//
//     it('room 목록 조회 성공', async () => {
//       roomRepository.getRoomBuilder.mockResolvedValue(shop);
//       roomRepository.mappingBuilderByInput.mockResolvedValue(shopsAndCount);
//       roomRepository.mappingBuilderBySkipAndTake.mockResolvedValue(shopsAndCount);
//
//       const result: RoomsOutput = await service.getRoomList(input);
//
//       expect(roomRepository.getRoomBuilder).toHaveBeenCalledTimes(1);
//       expect(roomRepository.mappingBuilderByInput).toHaveBeenCalledTimes(1);
//       expect(roomRepository.mappingBuilderBySkipAndTake).toHaveBeenCalledTimes(1);
//
//       expect(roomRepository.getShopsByShopManager).toHaveBeenCalledWith(undefined);
//       expect(roomRepository.getShopsQueryBuilder).toHaveBeenCalledWith(
//         findShopsArgs,
//         expect.any(Boolean),
//       );
//       expect(result).toMatchObject(mockResults);
//     });
//   });
// });
