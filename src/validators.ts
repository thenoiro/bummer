import { Subject, AnyPath } from './commonTypes';
import { isObject } from './commonMethods';

export const isPath = (path: any): path is AnyPath => {
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
    return path.every(isPath);
  }
  return false;
};
export const isSubject = (subject: any): subject is Subject => isObject(subject);
