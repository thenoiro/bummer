import {
  Subject,
  PathKey,
  SubjectMap,
  SubjectMapMember,
  Flag,
  Value,
  SubjectMapOptions,
} from './commonTypes';
import { has } from './commonMethods';
import { isSubject } from './validators';


class SubjectMapInstance implements SubjectMapMember {
  key: PathKey;

  exist: Flag = false;

  created: Flag = false;

  available: Flag = false;

  target: Subject | null = null;

  value: Value = undefined;


  constructor(options: SubjectMapOptions) {
    this.key = options.key;

    if (has(options, 'exist') && typeof options.exist === 'boolean') {
      this.exist = options.exist;
    }
    if (has(options, 'created') && typeof options.created === 'boolean') {
      this.created = options.created;
    }
    if (has(options, 'available') && typeof options.available === 'boolean') {
      this.available = options.available;
    }
    if (has(options, 'target') && isSubject(options.target)) {
      this.target = options.target;
    }
    if (has(options, 'value')) {
      this.value = options.value;
    }
  }
}

const getSubjectMap = (
  subject: Subject,
  pathDetails: PathKey[],
  build: Flag = false,
): SubjectMap => {
  const result: SubjectMap = [];

  return pathDetails.reduce((accumulator, pathKey, i) => {
    // INFO: Hack to allow get property using symbol as a key.
    const subjectKey = pathKey as string;
    const nextMember: SubjectMapMember = new SubjectMapInstance({ key: subjectKey });
    const prevMember: SubjectMapMember | undefined = accumulator[accumulator.length - 1];
    let inspectedObject: Subject = i === 0 ? subject : prevMember.value;
    let inspectedObjectExist: Flag = isSubject(inspectedObject);

    if (!inspectedObjectExist && !prevMember.exist && build) {
      let numberKey: number = NaN;

      if (typeof subjectKey !== 'symbol') {
        numberKey = Number(subjectKey);
      }
      const isKeyNumber = !Number.isNaN(numberKey);
      const isValidNumber = Number.isInteger(numberKey) || !Number.isFinite(numberKey);
      const isNextObjectArray = isKeyNumber && isValidNumber;
      const newSubject: Subject = isNextObjectArray ? [] : {};

      if (isSubject(prevMember.target)) {
        prevMember.target[prevMember.key as string] = newSubject;
      }
      inspectedObject = newSubject;
      prevMember.value = newSubject;
      inspectedObjectExist = true;
    }
    if (inspectedObjectExist) {
      nextMember.target = inspectedObject;

      if (has(inspectedObject, subjectKey)) {
        nextMember.exist = true;
        nextMember.value = inspectedObject[subjectKey];
      } else if (build) {
        inspectedObject[subjectKey] = undefined;
        nextMember.created = true;
      }
    }
    nextMember.available = nextMember.exist || nextMember.created;
    accumulator.push(nextMember);
    return accumulator;
  }, result);
};


export default getSubjectMap;
