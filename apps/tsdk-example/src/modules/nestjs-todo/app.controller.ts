import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { getMethodDecorator } from './get-method-decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @getMethodDecorator('get')()
  getHello(): string {
    return this.appService.getHello();
  }
}
