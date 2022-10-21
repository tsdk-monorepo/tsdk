import { Injectable } from '@nestjs/common';
import TodoService from '../todo/Todo.service';

@Injectable()
export class AppService extends TodoService {
  getHello(): string {
    return 'Hello World!';
  }
}
