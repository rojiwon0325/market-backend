import { S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteFileDTO, UploadFileDTO } from './upload.dto';

@Injectable()
export class UploadService {
  private readonly s3: S3;
  private readonly region: string;
  private readonly bucket: string;
  constructor(private readonly configService: ConfigService<IEnv>) {
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
    const Key = `${type}/${filename}-${Date.now()}`;
    await this.s3.putObject({
      Bucket: this.bucket,
      Key,
      ACL: 'public-read',
      ContentType: file.mimetype,
      Body: file.buffer,
    });
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${Key}`;
  }

  async delete({ file_url }: DeleteFileDTO) {
    const Key = file_url.split('.amazonaws.com/')[1];
    return this.s3.deleteObject({
      Bucket: this.bucket,
      Key,
    });
  }
}
