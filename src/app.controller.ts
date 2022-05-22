import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/Public.decorator';

@Public()
@Controller()
export class AppController {
  @Get()
  default() {
    return 'Welcome To E-Market';
  }
  @Get('health-check')
  check() {
    return 'Health Check is Successed';
  }
}
