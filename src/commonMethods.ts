export const isObject = (o: any): o is object => o && typeof o === 'object';

export const has = (o: any, p: any): boolean => {
  if (!isObject(o)) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(o, p);
};
