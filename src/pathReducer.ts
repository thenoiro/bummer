import { AnyPath, PathKey, PathKeyString } from './commonTypes';

const isPathKeyString = (key: any): key is PathKeyString => typeof key === 'string';

const splitStringKey = (pathKey: PathKeyString): PathKeyString[] => {
  const result: PathKeyString[] = [];
  let pathKeyBillet = pathKey;
  let safeCounter: number = pathKey.length;

  while (safeCounter > 0) {
    const dotIndex = pathKeyBillet.indexOf('.');
    const bktOpenIndex = pathKeyBillet.indexOf('[');
    // TODO: Implement error output when safeCounter couse the cycle ending
    safeCounter -= 1;

    if (dotIndex === -1 && bktOpenIndex === -1) {
      // No more delimiters
      if (pathKeyBillet.length > 0) {
        result.push(pathKeyBillet);
      }
      break;
    }
    if (dotIndex > -1 && (dotIndex < bktOpenIndex || bktOpenIndex === -1)) {
      // Dot goes first
      if (dotIndex === 0) {
        // TODO: Dot can't be at the 0 position. Double dot error, or something else.
        pathKeyBillet = pathKeyBillet.slice(1);
      } else {
        const partKey = pathKeyBillet.slice(0, dotIndex);
        result.push(partKey);
        pathKeyBillet = pathKeyBillet.slice(dotIndex + 1);
      }
    } else if (bktOpenIndex > 0) {
      // Something before bracket
      const partKey = pathKeyBillet.slice(0, bktOpenIndex);
      pathKeyBillet = pathKeyBillet.slice(bktOpenIndex);
      result.push(partKey);
    } else {
      // Start with bracket
      let bktCloseIndex = pathKeyBillet.indexOf(']', bktOpenIndex + 1);

      if (bktCloseIndex === -1) {
        // TODO: Implement close bracket miss error or warning
        bktCloseIndex = pathKeyBillet.length + 1;
        pathKeyBillet += ']';
      }
      const partKey = pathKeyBillet.slice(bktOpenIndex + 1, bktCloseIndex);
      pathKeyBillet = pathKeyBillet.slice(bktCloseIndex + 1);
      result.push(partKey);
    }
  }
  return result;
};

const destructurPathKey = (pathKey: PathKey): PathKey[] => {
  if (isPathKeyString(pathKey)) {
    return splitStringKey(pathKey);
  }
  return [pathKey];
};

const reducePath = (path: AnyPath): PathKey[] => {
  // TODO: Implement errors output
  const pathBillet: PathKey[] = Array.isArray(path) ? path : [path];
  const result: PathKey[] = [];

  return pathBillet.reduce((accumulator, pathKey) => {
    const destructuredPathKeys = destructurPathKey(pathKey);
    return [...accumulator, ...destructuredPathKeys];
  }, result);
};


export default reducePath;
