import { Like } from "typeorm";
import { buildPaginator } from "typeorm-cursor-pagination";

import { appDataSource } from "/src/db";
import { Todo } from "./Todo.entity";
import { DeleteTodoReq, DeleteTodoRes } from "./apiconf/DeleteTodo.apiconf";
import { UpdateTodoReq, UpdateTodoRes } from "./apiconf/UpdateTodo.apiconf";
import { AddTodoReq, AddTodoRes } from "./apiconf/AddTodo.apiconf";
import { QueryTodoReq, QueryTodoRes } from "./apiconf/QueryTodo.apiconf";
import {
  QueryTodoByCursorReq,
  QueryTodoByCursorRes,
} from "./apiconf/QueryTodoByCursor.apiconf";
import { RequestInfo } from "./types";

export default class TodoService {
  get todoRepo() {
    return appDataSource.getRepository(Todo);
  }

  // crud

  createTodo(payload: AddTodoReq): Promise<AddTodoRes> {
    return this.todoRepo.insert(payload);
  }

  async queryTodo(payload: QueryTodoReq): Promise<QueryTodoRes> {
    const { page, perPage, keyword } = payload;

    const skip = page && (page - 1) * (perPage || 100);
    const take = perPage;

    const [data, total] = await this.todoRepo.findAndCount({
      skip,
      take,
      order: {
        createdAt: "DESC",
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
    payload: QueryTodoByCursorReq
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
      paginationKeys: ["id"],
      alias: Todo.entityName,
      query: {
        limit: perPage,
        order: "DESC",
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

  updateTodo({ id, ...data }: UpdateTodoReq): Promise<UpdateTodoRes> {
    return this.todoRepo.update(id, data);
  }

  deleteTodo({ id, IDs }: DeleteTodoReq & RequestInfo): Promise<DeleteTodoRes> {
    return this.todoRepo.delete(id ? id : IDs);
  }
}

export const todoService = new TodoService();
