import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsResolver } from '../resolvers/reservations.resolver';
import { ReservationsService } from '../services/reservations.service';
import { CreateReservationOutput } from '../dto/create-reservation.dto';
import { User } from '../../../entities/user.entity';

const reservationMockResult = {
  ok: true,
  error: null,
  results: {
    reservation: {
      id: 1,
    },
  },
};

const mockrReservationService = () => ({
  reservationRoom: jest.fn(() => reservationMockResult),
});
describe('ReservationResolver', (): void => {
  let resolver: ReservationsResolver;
  let service: ReservationsService;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsResolver,
        {
          provide: ReservationsService,
          useValue: mockrReservationService(),
        },
      ],
    }).compile();

    resolver = module.get<ReservationsResolver>(ReservationsResolver);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', (): void => {
    expect(resolver).toBeDefined();
  });

  describe('room 예약', (): void => {
    it('room 예약 성공', async (): Promise<void> => {
      const input = {
        roomId: 1,
        reservationDate: new Date(),
      };

      const result: CreateReservationOutput = await resolver.reservationRoom(User.prototype, input);

      expect(service.reservationRoom).toHaveBeenCalledTimes(1);
      expect(service.reservationRoom).toHaveBeenCalledWith(input, {});
      expect(result).toEqual(reservationMockResult);
    });
  });
});
