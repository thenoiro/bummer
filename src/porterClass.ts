import PorterResult from './porterResultClass';
import reducePath from './pathReducer';
import { inform } from './logger';
import { isObject } from './commonMethods';
import {
  Subject,
  AnyPath,
  Value,
  Flag,
  PorterClassInterface,
  PorterResultInterface,
} from './commonTypes';


// Validators
const validatePath = (path: any): path is AnyPath => {
  if (typeof path === 'string' && path.length > 0) {
    return true;
  }
  if (typeof path === 'symbol') {
    return true;
  }
  if (typeof path === 'number') {
    return true;
  }
  if (Array.isArray(path) && path.length > 0) {
    return path.every(validatePath);
  }
  return false;
};
const validateSubject = (subject: any): subject is Subject => isObject(subject);

// Errors
const ERRORS = {
  PATH: 'Wrong path.',
  SUBJECT: 'Wrong subject.',
};


class Porter implements PorterClassInterface {
  private subject: Subject;

  private result: PorterResultInterface = new PorterResult();

  constructor(subject: Subject) {
    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.check = this.check.bind(this);
    this.remove = this.remove.bind(this);
    this.replace = this.replace.bind(this);

    this.subject = subject;
    const isValidSubject = validateSubject(subject);

    if (!isValidSubject) {
      this.result.errors.push(ERRORS.SUBJECT);
      this.subject = {};
    }
  }

  get(this: Porter, path: AnyPath) {
    const isValidPath = this.validatePath(path);

    if (isValidPath) {
      const pathDetails = reducePath(path);
      inform.log(path, this.subject, pathDetails);
    }
    return this.result;
  }

  set(this: Porter, path: AnyPath, value: Value, force: Flag = true) {
    const isValidPath = this.validatePath(path);

    if (isValidPath) {
      inform.log(this.subject, path, value, force);
    }
    return this.result;
  }

  check(this: Porter, path: AnyPath) {
    const isValidPath = this.validatePath(path);

    if (isValidPath) {
      inform.log(this.subject, path);
    }
    return this.result;
  }

  remove(this: Porter, path: AnyPath, pop: Flag = false) {
    const isValidPath = this.validatePath(path);

    if (isValidPath) {
      inform.log(this.subject, path, pop);
    }
    return this.result;
  }

  replace(this: Porter, path: AnyPath, value: Value, force = true) {
    const isValidPath = this.validatePath(path);

    if (isValidPath) {
      inform.log(this.subject, path, value, force);
    }
    return this.result;
  }

  private validatePath(path: any): path is AnyPath {
    const isValidPath = validatePath(path);

    if (!isValidPath) {
      this.result.errors.push(ERRORS.PATH);
    }
    return isValidPath;
  }
}


export default Porter;
