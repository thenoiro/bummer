import Porter from './porterClass';
import { inform } from './logger';
import { isObject } from './commonMethods';
import {
  AnyPath,
  Subject,
  PorterAPI,
} from './commonTypes';


// Validators
const validatePath = (path: any): path is AnyPath => {
  if (typeof path === 'string') {
    return true;
  }
  if (typeof path === 'symbol') {
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


// Entry point
const porter: PorterAPI = (subject: any) => {
  const isValidSubject = validateSubject(subject);
  const wrapper = new Porter(subject);

  return {
    get(path) {
      let isError = false;
      let result;
      const isValidPath = validatePath(path);

      if (!isValidSubject) {
        inform.error(ERRORS.SUBJECT);
        isError = true;
      }
      if (!isValidPath) {
        inform.error(ERRORS.PATH);
        isError = true;
      }
      if (!isError) {
        result = wrapper.get(path);
      }
      return result;
    },

    set(path, value, force = true) {
      let result = false;
      let isError = false;
      const isValidPath = validatePath(path);

      if (!isValidSubject) {
        inform.error(ERRORS.SUBJECT);
        isError = true;
      }
      if (!isValidPath) {
        inform.error(ERRORS.PATH);
        isError = true;
      }
      if (!isError) {
        result = wrapper.set(path, value, force);
      }
      return result;
    },

    check(path) {
      let result = false;
      let isError = false;
      const isValidPath = validatePath(path);

      if (!isValidSubject) {
        inform.error(ERRORS.SUBJECT);
        isError = true;
      }
      if (!isValidPath) {
        inform.error(ERRORS.PATH);
        isError = true;
      }
      if (!isError) {
        result = wrapper.check(path);
      }
      return result;
    },

    remove(path, pop = false) {
      let result;
      let isError = false;
      const isValidPath = validatePath(path);

      if (!isValidSubject) {
        inform.error(ERRORS.SUBJECT);
        isError = true;
      }
      if (!isValidPath) {
        inform.error(ERRORS.PATH);
        isError = true;
      }
      if (!isError) {
        result = wrapper.remove(path, pop);
      } else if (!pop) {
        result = false;
      }
      return result;
    },

    replace(path, value, force = true) {
      let result;
      let isError = false;
      const isValidPath = validatePath(path);

      if (!isValidSubject) {
        inform.error(ERRORS.SUBJECT);
        isError = true;
      }
      if (!isValidPath) {
        inform.error(ERRORS.PATH);
        isError = true;
      }
      if (!isError) {
        result = wrapper.replace(path, value, force);
      }
      return result;
    },
  };
};
porter.get = (subject, ...options) => porter(subject).get(...options);
porter.set = (subject, ...options) => porter(subject).set(...options);
porter.check = (subject, ...options) => porter(subject).check(...options);
porter.remove = (subject, ...options) => porter(subject).remove(...options);
porter.replace = (subject, ...options) => porter(subject).replace(...options);


export default porter;
