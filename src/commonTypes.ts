type PathKey = string | symbol | number;

export type Subject = object;
export type AnyPath = PathKey | PathKey[];
export type Value = any;
export type Result = boolean;
export type Flag = boolean;

export interface PorterAPIMethods {
  get(subject: any, path: any): Value;
  set(subject: any, path: any, value: any, force?: any): Result;
  check(subject: any, path: any): Result;
  remove(subject: any, path: any, pop?: any): Result | Value;
  replace(subject: any, path: any, value: any, force?: any): Value;
}
export interface PorterAPI extends PorterAPIMethods {
  (subject: any): PorterWrapper;
}
export interface PorterWrapper {
  get(path: any): Value;
  set(path: any, value: any, force?: any): Result;
  check(path: any): Result;
  remove(path: any, pop?: any): Result | Value;
  replace(path: any, value: any, force?: any): Value;
}
