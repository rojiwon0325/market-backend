import { S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { IEnv } from 'src/interfaces/env';
import { DeleteFileDTO, UploadFileDTO } from './upload.dto';

@Injectable()
export class UploadService {
  private readonly s3: S3;
  private readonly region: string;
  private readonly bucket: string;
  constructor(
    private readonly configService: ConfigService<IEnv>,
    private readonly exceptionService: HttpExceptionService,
  ) {
    this.region = this.configService.get('AWS_REGION');
    this.bucket = this.configService.get('AWS_S3_BUCKET');
    this.s3 = new S3({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_CLIENT_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET'),
      },
    });
  }

  async upload({ type, filename, file }: UploadFileDTO): Promise<string> {
    try {
      const Key = `${type}/${filename}-${Date.now()}`;
      await this.s3.putObject({
        Bucket: this.bucket,
        Key,
        ACL: 'public-read',
        ContentType: file.mimetype,
        Body: file.buffer,
      });
      return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${Key}`;
    } catch (error) {
      console.log(`${error.name}: ${error.message} in upload handler`);
      throw this.exceptionService.getBadRequestException(
        ExceptionMessage.FAIL_UPLOAD,
      );
    }
  }

  async delete({ file_url }: DeleteFileDTO) {
    const Key = file_url.split('.amazonaws.com/')[1];
    return this.s3.deleteObject({
      Bucket: this.bucket,
      Key,
    });
  }
}
