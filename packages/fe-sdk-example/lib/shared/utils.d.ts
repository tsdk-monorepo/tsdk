import { z } from 'zod';
/**
 * Math sum
 * @param a number
 * @param b number
 * @returns number
 */
export declare const sum: (a: number, b: number) => number;
/**
 * promisify `setTimeout`
 * @param ms number
 * @returns Promise<any>
 */
export declare const sleep: (ms: number) => Promise<unknown>;
export declare const PositiveNumberSchema: z.ZodEffects<z.ZodNumber, number, unknown>;
export declare const IDSchema: z.ZodEffects<z.ZodNumber, number, unknown>;
