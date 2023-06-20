import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

/**
 * https://betterprogramming.pub/nest-js-and-the-custom-validation-pipe-231130fda040
 */
@Injectable()
export class CustomTransformPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (this.isEmpty(value)) {
      throw new HttpException(
        'Validation failed: No payload provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new HttpException(
        `Validation failed: ${this.formatErrors(errors)}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return object;
  }

  private isEmpty(value: any) {
    if (Object.keys(value).length < 1) {
      return true;
    }
    return false;
  }

  private formatErrors(errors: ValidationError[]) {
    return errors
      .map((error) => {
        for (const key in error.constraints) {
          return error.constraints[key];
        }
      })
      .join(', ');
  }
}