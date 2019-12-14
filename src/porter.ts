type Subject = object;
type Path = string;
type PathKey = string | symbol | number;
type AnyPath = Path | PathKey[];
type Value = any;
type Result = boolean;
type Flag = boolean;

interface PorterAPIMethods {
  get(subject: Subject, path: AnyPath): Value;
  set(subject: Subject, path: AnyPath, value: Value, force?: Flag): Result;
  check(subject: Subject, path: AnyPath): Result;
  remove(subject: Subject, path: AnyPath, pop?: Flag): Result | Value;
  replace(subject: Subject, path: AnyPath, value: Value, force: Flag): Value;
}
interface PorterAPI extends PorterAPIMethods {
  (subject: Subject): PorterWrapper;
}
interface PorterWrapper {
  get(path: AnyPath): Value;
  set(path: AnyPath, value: Value, force?: Flag): Result;
  check(path: AnyPath): Result;
  remove(path: AnyPath, pop?: Flag): Result | Value;
  replace(path: AnyPath, value: Value, force: Flag): Value;
}

const inform = console;
const log = (...args: any) => {
  inform.log(...args);
};


class Porter implements PorterWrapper {
  private subject: Subject;

  constructor(subject: Subject) {
    this.subject = subject;
  }

  get(path: AnyPath) {
    log(path, this.subject);
    return undefined;
  }

  set(path: AnyPath, value: Value, force: Flag = true) {
    log(this.subject, path, value, force);
    return false;
  }

  check(path: AnyPath) {
    log(this.subject, path);
    return false;
  }

  remove(path: AnyPath, pop: Flag = false) {
    log(this.subject, path, pop);
    return pop ? undefined : false;
  }

  replace(path: AnyPath, value: Value, force = true) {
    log(this.subject, path, value, force);
    return undefined;
  }
}

const porter: PorterAPI = (subject) => {
  const wrapper = new Porter(subject);

  return {
    get: wrapper.get,
    set: wrapper.set,
    check: wrapper.check,
    remove: wrapper.remove,
    replace: wrapper.replace,
  };
};

porter.get = (subject, path) => {
  log(subject, path);
  return undefined;
};
porter.set = (subject, path, value, force = true) => {
  log(subject, path, value, force);
  return false;
};
porter.check = (subject, path) => {
  log(subject, path);
  return false;
};
porter.remove = (subject, path, pop = false) => {
  log(subject, path, pop);
  return pop ? undefined : false;
};
porter.replace = (subject, path, value, force = true) => {
  log(subject, path, value, force);
  return undefined;
};


export default porter;
