import PorterResult from './porterResultClass';
import reducePath from './pathReducer';
import getSubjectMap from './subjectMapBuilder';
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
  SubjectMapMember,
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
      this.result.track = subjectMap;
      this.result.done = subjectMap.every((s) => s.available);

      if (this.result.done) {
        this.result.value = subjectMap[subjectMap.length - 1].value;
      }
    }
    return this.result;
  }

  set(this: Porter, path: AnyPath, value: Value, force: Flag = true) {
    const isValidPath = this.validatePath(path);

    if (isValidPath) {
      const pathDetails: PathKey[] = reducePath(path);
      const subjectMap: SubjectMap = getSubjectMap(this.subject, pathDetails, force);
      this.result.track = subjectMap;
      this.result.done = subjectMap.every((s) => s.available);

      if (this.result.done) {
        const lastMember: SubjectMapMember = subjectMap[subjectMap.length - 1];
        const { target, key } = lastMember;

        if (isSubject(target)) {
          target[key as string] = value;
        }
      }
    }
    return this.result;
  }

  check(this: Porter, path: AnyPath) {
    const result: PorterResultInterface = this.get(path);
    result.value = result.done;
    return result;
  }

  remove(this: Porter, path: AnyPath, pop: Flag = false) {
    const result: PorterResultInterface = this.get(path);

    if (!pop) {
      result.value = result.done;
    }
    if (result.done) {
      const lastMember: SubjectMapMember = result.track[result.track.length - 1];
      const { target, key } = lastMember;

      if (isSubject(target)) {
        delete target[key as string];
      }
    }
    return result;
  }

  replace(this: Porter, path: AnyPath, value: Value, force = true) {
    const isValidPath = this.validatePath(path);

    if (isValidPath) {
      const pathDetails: PathKey[] = reducePath(path);
      const subjectMap: SubjectMap = getSubjectMap(this.subject, pathDetails, force);
      this.result.track = subjectMap;
      this.result.done = subjectMap.every((s) => s.available);

      if (this.result.done) {
        const lastMember: SubjectMapMember = subjectMap[subjectMap.length - 1];
        const { target, key } = lastMember;
        const targetKey = key as string;

        if (isSubject(target)) {
          const prevValue: Value = target[targetKey];
          target[targetKey] = value;
          this.result.value = prevValue;
        }
      }
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
