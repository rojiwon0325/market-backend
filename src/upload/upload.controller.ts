import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadType, DeleteFileDTO } from './upload.dto';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly service: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor(UploadType.Image))
  upload(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      return this.service.upload({
        type: UploadType.Image,
        filename: 'test',
        file,
      });
    } else {
      return 'file not found';
    }
  }

  @Post('delete')
  delete(@Body() body: DeleteFileDTO) {
    return this.service.delete(body);
  }
}
