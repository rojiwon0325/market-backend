import { Expose, Type } from 'class-transformer';
import { IsString, IsEnum } from 'class-validator';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

export enum UploadType {
  Image = 'image',
}
// folder명으로 사용

export class UploadFileDTO {
  type: UploadType;
  filename: string;
  file: Express.Multer.File;
}

export class DeleteFileDTO {
  @IsEnum(UploadType, { message: ExceptionMessage.VALIDATION })
  @Expose()
  type: UploadType;

  @IsString({ message: ExceptionMessage.VALIDATION })
  @Type(() => String)
  @Expose()
  filename: string;
}
