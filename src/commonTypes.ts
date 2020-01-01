export type PathKey = string | symbol | number;

export type Subject = object;
export type AnyPath = PathKey | PathKey[];
export type Value = any;
export type Result = boolean;
export type Flag = boolean;

export interface PorterResultInterface {
  done: Result;
  value: Value;
  track: PathKey[];
  errors: string[];
}

export interface PorterAPIMethods {
  get(subject: Subject, path: AnyPath): PorterResultInterface;
  set(subject: Subject, path: AnyPath, value: Value, force?: Flag): PorterResultInterface;
  check(subject: Subject, path: AnyPath): PorterResultInterface;
  remove(subject: Subject, path: AnyPath, pop?: Flag): PorterResultInterface;
  replace(subject: Subject, path: AnyPath, value: Value, force?: Flag): PorterResultInterface;
}
export interface PorterAPI extends PorterAPIMethods {
  (subject: Subject): PorterWrapper;
}
export interface PorterWrapper extends PorterClassInterface {}

export interface PorterClassInterface {
  get(path: AnyPath): PorterResultInterface;
  set(path: AnyPath, value: Value, force?: Flag): PorterResultInterface;
  check(path: AnyPath): PorterResultInterface;
  remove(path: AnyPath, pop?: Flag): PorterResultInterface;
  replace(path: AnyPath, value: Value, force?: Flag): PorterResultInterface;
}
