import { expect, it, describe } from 'vitest';
import { transformTypeormEntity } from '../src/transform-typeorm-entity';

describe('transform-typeorm-entity tests', () => {
  it('should work with single line', () => {
    const input = `
import typeorm from 'typeorm'; //
`;
    const result = transformTypeormEntity(input, 'typeorm');
    expect(result.trim()).to.equal('');
  });

  it('should work with single inline comment', () => {
    const input = `
//import typeorm from 'typeorm';
`;
    const result = transformTypeormEntity(input, 'typeorm');
    expect(result.trim()).to.equal(input.trim());
  });

  it('should work single line with multi-line comment', () => {
    const input = `
/* import typeorm from 'typeorm'; */
`;
    const result = transformTypeormEntity(input, 'typeorm');
    expect(result.trim()).to.equal(input.trim());
  });

  it('should work multiple lines with multi-line comment', () => {
    const input = `
    /*
import {
Unique,
Entity,
} from 'typeorm';
 */
`;
    const result = transformTypeormEntity(input, 'typeorm');
    expect(result.trim()).to.equal(input.trim());
  });

  it('should work with multiple lines', () => {
    const input = `
import {
Unique,
Entity,
} from 'typeorm'; 
`;
    const result = transformTypeormEntity(input, 'typeorm');
    expect(result.trim()).to.equal('');
  });

  it('should work with multiple line with comment', () => {
    const input = `
import {
Unique, /* */
Entity,
} from 'typeorm'; //
`;
    const result = transformTypeormEntity(input, 'typeorm');
    expect(result.trim()).to.equal('');
  });

  it('should work with entity', () => {
    const input = `
import { Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number
}
`;
    const output = `
export class User {
    id: number
}
`;
    const result = transformTypeormEntity(input, 'typeorm');
    expect(result.trim()).to.equal(output.trim());
  });

  it('should work with multiple columns entity', () => {
    const input = `
import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity()
export class Thing {
    @PrimaryColumn()
    id: number

    @Column("point")
    point: string

    @Column("geometry", {
        spatialFeatureType: "MultiPoint",
        srid: 4326,
    })
    linestring: string
}
`;
    const output = `
export class Thing {
    id: number

    point: string

    linestring: string
}
`;
    const result = transformTypeormEntity(input, 'typeorm');
    expect(result.trim()).to.equal(output.trim());
  });

  it('should work with multiple columns entity and @ManyToMany', () => {
    const input = `
import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity()
export class Thing {
    @PrimaryColumn()
    id: number

    @Column("point")
    point: string

    @Column("geometry", {
        spatialFeatureType: "MultiPoint",
        srid: 4326,
    })
    linestring: string

    @ManyToMany((type) => Question, (question) => question.categories)
    questions: Question[]

    @ManyToOne(() => User, (user) => user.photos)
    user: User

    @OneToMany(() => Photo, (photo) => photo.user)
    photos: Photo[]
}
`;
    const output = `
export class Thing {
    id: number

    point: string

    linestring: string

    questions: Question[]

    user: User

    photos: Photo[]
}
`;
    const result = transformTypeormEntity(input, 'typeorm');
    expect(result.trim()).to.equal(output.trim());
  });
});
