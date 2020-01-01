export const isObject = (o: any): o is object => {
  if (o && typeof o === 'object') {
    return true;
  }
  return false;
};
export const has = (o: any, p: any): boolean => {
  if (!isObject(o)) {
    return false;
  }
  if (!p || typeof p !== 'string') {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(o, p);
};
