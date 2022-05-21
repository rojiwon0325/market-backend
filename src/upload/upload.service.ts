import { S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { HttpExceptionService } from 'src/httpException/http-exception.service';
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

  // AOP패턴이 적용되지 않았다. 예외 로그, 예외처리, 파일 업로드 작업을 모두 진행하고 있다.
  async upload({ type, filename, file }: UploadFileDTO): Promise<string> {
    try {
      const Key = `${type}/${filename}`;
      await this.s3.putObject({
        Bucket: this.bucket,
        Key,
        ACL: 'public-read',
        ContentType: file.mimetype,
        Body: file.buffer,
      });
      return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${Key}`;
    } catch (error) {
      console.log(error.message);
      throw this.exceptionService.getBadRequestException(
        ExceptionMessage.FAIL_UPLOAD,
      );
    }
  }

  async delete({ type, filename }: DeleteFileDTO) {
    return this.s3.deleteObject({
      Bucket: this.bucket,
      Key: `${type}/${filename}`,
    });
  }
}
