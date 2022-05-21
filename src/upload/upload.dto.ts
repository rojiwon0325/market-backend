export enum UploadType {
  Image = 'image',
}
// folder명으로 사용

export class UploadFileDTO {
  type: UploadType;
  filename: string;
  file: Express.Multer.File;
}
