import { Get, Post, Patch, Delete, Put } from '@nestjs/common';

export const methodMaps = {
  get: Get,
  post: Post,
  patch: Patch,
  delete: Delete,
  put: Put,
};

export const getMethodDecorator = (method: keyof typeof methodMaps) => {
  return methodMaps[method];
};
