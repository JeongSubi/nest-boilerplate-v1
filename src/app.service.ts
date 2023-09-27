import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { DataSource, getConnectionManager } from 'typeorm';

@Injectable()
export class AppService implements OnApplicationShutdown {
  private readonly logger: Logger = new Logger(AppService.name);

  onApplicationShutdown(signal?: string): void {
    this.logger.log('onApplicationShutdown Event Start');
    this.closeDBConnection();
  }

  closeDBConnection(): void {
    const connection: DataSource = getConnectionManager().get();

    if (connection.isConnected) {
      connection
        .close()
        .then((): void => {
          this.logger.log('DB conn closed');
        })
        .catch((err: any): void => {
          this.logger.error('Error closing conn to DB, ', err);
        });
    } else {
      this.logger.warn('DB conn already closed.');
    }
  }
}
