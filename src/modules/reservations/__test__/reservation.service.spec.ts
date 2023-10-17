import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservationRepository } from '@repositories/reservation-repository';
import { RoomRepository } from '@repositories/room-repository';
import { UtilService } from '@util/util.service';
import { ReservationsService } from '@modules/reservations/reservations.service';

const mockUtilService = () => ({});
const mockRepository = () => ({});

type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;

describe('UsersService', (): void => {
  let service: ReservationsService;
  let utilService: UtilService;
  let reservationRepository: MockRepository<ReservationRepository>;
  let roomRepository: MockRepository<RoomRepository>;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: UtilService,
          useValue: mockUtilService(),
        },
        {
          provide: getRepositoryToken(ReservationRepository),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(RoomRepository),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<ReservationsService>(ReservationsService);
    utilService = module.get<UtilService>(UtilService);
    reservationRepository = module.get(getRepositoryToken(ReservationRepository));
    roomRepository = module.get(getRepositoryToken(RoomRepository));
  });

  it('service 파일 정의', (): void => {
    expect(service).toBeDefined();
  });
});
