import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  getRandomString(): string {
    return Math.random().toString(36).substr(2, 11);
  }

  setReservationTime(date: Date): Date {
    return new Date(date.setHours(0, 0, 0));
  }
}
