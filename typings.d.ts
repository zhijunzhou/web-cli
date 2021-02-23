import { ENV } from './src/types';

declare module '*projects.json' {
  export const name: string
  export const env: ENV
  export const local: string | RegExp
  export const exclude: Array<string | RegExp>
}