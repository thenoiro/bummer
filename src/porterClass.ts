import { inform } from './logger';
import {
  Subject,
  AnyPath,
  Result,
  Value,
  Flag,
} from './commonTypes';

interface PorterClass {
  get(path: AnyPath): Value;
  set(path: AnyPath, value: Value, force: Flag): Result;
  check(path: AnyPath): Result;
  remove(path: AnyPath, pop: Flag): Result | Value;
  replace(path: AnyPath, value: Value, force: Flag): Value;
}


class Porter implements PorterClass {
  private subject: Subject;

  constructor(subject: Subject) {
    this.subject = subject;
  }

  get(path: AnyPath) {
    inform.log(path, this.subject);
    return undefined;
  }

  set(path: AnyPath, value: Value, force: Flag = true) {
    inform.log(this.subject, path, value, force);
    return false;
  }

  check(path: AnyPath) {
    inform.log(this.subject, path);
    return false;
  }

  remove(path: AnyPath, pop: Flag = false) {
    inform.log(this.subject, path, pop);
    return pop ? undefined : false;
  }

  replace(path: AnyPath, value: Value, force = true) {
    inform.log(this.subject, path, value, force);
    return undefined;
  }
}


export default Porter;
