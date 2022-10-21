import { EntitySchema } from 'typeorm';

const entites: EntitySchema[] = [];

export function getEntites() {
  return entites;
}

export function registerEntites(items: any[]): void {
  items.forEach((i) => {
    entites.push(i);
  });
}
