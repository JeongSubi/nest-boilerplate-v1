import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { UtilService } from '@src/util/util.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly configService: ConfigService,
    private readonly utilService: UtilService,
  ) {}

  private createS3Object(): AWS.S3 {
    return new AWS.S3({
      accessKeyId: this.configService.get('AWS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadSingleFileToS3(file, path: string, folderName: string): Promise<string> {
    const s3: AWS.S3 = this.createS3Object();

    const { createReadStream, filename, mimetype, encoding } = await file;

    const readStream = createReadStream();
    const randomString: string = this.utilService.getRandomString();
    const date: number = Date.now();

    const response: string = await this.uploadToS3(
      s3,
      readStream,
      `${folderName}/` + path,
      `${randomString}${date}`,
    );

    return response.split(
      `https://${this.configService.get('AWS_BUCKET_NAME')}.s3.${this.configService.get(
        'AWS_REGION',
      )}.amazonaws.com`,
    )[1];
  }

  private async uploadToS3(
    s3: S3,
    stream: S3.Types.Body,
    s3FilePath: string,
    filename: string,
  ): Promise<string> {
    const param: S3.PutObjectRequest = {
      Body: stream,
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: `${s3FilePath}${filename}`,
    };

    if (process.env.NODE_ENV !== 'prod') {
      param['CacheControl'] = 'no-cache';
    }

    const response: S3.ManagedUpload.SendData = await s3.upload(param).promise();

    return response.Location;
  }
}
