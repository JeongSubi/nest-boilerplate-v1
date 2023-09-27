import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { DataSource, getConnectionManager } from 'typeorm';

@Injectable()
export class AppService implements OnApplicationShutdown {
  private readonly logger = new Logger(AppService.name);

  onApplicationShutdown(signal?: string) {
    this.logger.log('onApplicationShutdown Event Start');
    this.closeDBConnection();
  }

  closeDBConnection(): void {
    const conn: DataSource = getConnectionManager().get();

    if (conn.isConnected) {
      conn
        .close()
        .then((): void => {
          this.logger.log('DB conn closed');
        })
        .catch((err: any) => {
          this.logger.error('Error closing conn to DB, ', err);
        });
    } else {
      this.logger.warn('DB conn already closed.');
    }
  }
}
