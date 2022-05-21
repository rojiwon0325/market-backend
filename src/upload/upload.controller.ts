import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadType } from './upload.dto';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly service: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor(UploadType.Image))
  upload(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      return this.service.uploadFile({
        type: UploadType.Image,
        filename: 'test',
        file,
      });
    } else {
      return 'file not found';
    }
  }
}
