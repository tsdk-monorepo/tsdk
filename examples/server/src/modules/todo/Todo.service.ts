import { Like } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { appDataSource } from '/src/db';

import { Todo } from './Todo.entity';
import { AddTodoReq, AddTodoRes } from './apiconf/AddTodo.apiconf';
import { DeleteTodoReq, DeleteTodoRes } from './apiconf/DeleteTodo.apiconf';
import { QueryTodoReq, QueryTodoRes } from './apiconf/QueryTodo.apiconf';
import { QueryTodoByCursorReq, QueryTodoByCursorRes } from './apiconf/QueryTodoByCursor.apiconf';
import { UpdateTodoReq, UpdateTodoRes } from './apiconf/UpdateTodo.apiconf';
import { ReadonlyRequestInfo } from './types';

export default class TodoService {
  private static instance: TodoService;

  static getInstance() {
    if (!TodoService.instance) {
      TodoService.instance = new TodoService();
    }
    return TodoService.instance;
  }

  get todoRepo() {
    return appDataSource.getRepository(Todo);
  }

  // crud

  createTodo(payload: AddTodoReq, reqInfo: ReadonlyRequestInfo): Promise<AddTodoRes> {
    return this.todoRepo.insert(payload);
  }

  async queryTodo(payload: QueryTodoReq, reqInfo: ReadonlyRequestInfo): Promise<QueryTodoRes> {
    const { page, perPage, keyword } = payload;

    const skip = page && (page - 1) * (perPage || 100);
    const take = perPage;

    const [data, total] = await this.todoRepo.findAndCount({
      skip,
      take,
      order: {
        createdAt: 'DESC',
      },
      where: keyword && [
        {
          title: Like(`%${keyword}%`),
        },
        {
          remark: Like(`%${keyword}%`),
        },
      ],
    });

    return {
      data,
      page,
      perPage,
      total,
    };
  }

  async queryTodoByCursor(
    payload: QueryTodoByCursorReq,
    reqInfo: ReadonlyRequestInfo
  ): Promise<QueryTodoByCursorRes> {
    const { perPage, keyword, beforeCursor, afterCursor } = payload;

    let queryBuilder = this.todoRepo.createQueryBuilder(Todo.entityName);
    if (keyword) {
      queryBuilder = queryBuilder
        .where(`${Todo.entityName}.title LIKE :keyword`, {
          keyword: `%${keyword}%`,
        })
        .orWhere(`${Todo.entityName}.remark LIKE :keyword`, {
          keyword: `%${keyword}%`,
        });
    }

    const paginator = buildPaginator({
      entity: Todo,
      // @todo: error cursor search maybe only because of sqlite? or `createdAt` same
      // paginationKeys: ['createdAt', 'id'],
      paginationKeys: ['id'],
      alias: Todo.entityName,
      query: {
        limit: perPage,
        order: 'DESC',
        beforeCursor,
        afterCursor,
      },
    });

    // Pass queryBuilder as parameter to get paginate result.
    const { data, cursor } = await paginator.paginate(queryBuilder);

    return {
      ...cursor,
      data,
      perPage,
    };
  }

  updateTodo({ id, ...data }: UpdateTodoReq, reqInfo: ReadonlyRequestInfo): Promise<UpdateTodoRes> {
    return this.todoRepo.update(id, data);
  }

  deleteTodo({ id, IDs }: DeleteTodoReq, reqInfo: ReadonlyRequestInfo): Promise<DeleteTodoRes> {
    return this.todoRepo.delete(id ? id : IDs);
  }
}

export const todoService = TodoService.getInstance();
