import { z } from 'zod';
/**
 * Math sum
 * @param a number
 * @param b number
 * @returns number
 */
export const sum = (a: number, b: number) => a + b;

/**
 * promisify `setTimeout`
 * @param ms number
 * @returns Promise any
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const PositiveNumberSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    return parseInt(val, 10);
  }
  return val;
}, z.number().positive());

export const IDSchema = PositiveNumberSchema;
