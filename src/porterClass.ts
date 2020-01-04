import PorterResult from './porterResultClass';
import reducePath from './pathReducer';
import getSubjectMap from './subjectMapBuilder';
import { inform } from './logger';
import { isPath, isSubject } from './validators';
import {
  PathKey,
  Subject,
  AnyPath,
  Value,
  Flag,
  PorterClassInterface,
  PorterResultInterface,
  SubjectMap,
} from './commonTypes';


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
    const isValidSubject = isSubject(subject);

    if (!isValidSubject) {
      this.result.errors.push(ERRORS.SUBJECT);
      this.subject = {};
    }
  }


  get(this: Porter, path: AnyPath) {
    const isValidPath = this.validatePath(path);

    if (isValidPath) {
      const pathDetails: PathKey[] = reducePath(path);
      const subjectMap: SubjectMap = getSubjectMap(this.subject, pathDetails);
      inform.log(path, this.subject, subjectMap);
    }
    return this.result;
  }

  set(this: Porter, path: AnyPath, value: Value, force: Flag = true) {
    const isValidPath = this.validatePath(path);

    if (isValidPath) {
      const pathDetails: PathKey[] = reducePath(path);
      const subjectMap: SubjectMap = getSubjectMap(this.subject, pathDetails, force);
      inform.log(value, subjectMap);
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
    const isValidPath = isPath(path);

    if (!isValidPath) {
      this.result.errors.push(ERRORS.PATH);
    }
    return isValidPath;
  }
}


export default Porter;
