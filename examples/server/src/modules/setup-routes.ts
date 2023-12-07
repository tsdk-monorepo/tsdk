import { setupTestRoute } from './core/Test.api';
import { setupTodoRoute } from './todo/Todo.api';

export function setupRoutes() {
  setupTodoRoute();
  setupTestRoute();
}
