import { IsUrl } from 'class-validator';
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
  @IsUrl({ message: ExceptionMessage.VALIDATION })
  file_url: string;
}
