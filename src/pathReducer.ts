import { AnyPath, PathKey, PathKeyString } from './commonTypes';

const isPathKeyString = (key: any): key is PathKeyString => typeof key === 'string';

const splitStringKey = (pathKey: PathKeyString): PathKeyString[] => {
  const result: PathKeyString[] = [];
  let pathKeyBillet: string = pathKey;
  let safeCounter: number = pathKey.length;

  while (safeCounter > 0) {
    const dotIndex: number = pathKeyBillet.indexOf('.');
    const bktOpenIndex: number = pathKeyBillet.indexOf('[');

    const isDot: boolean = dotIndex > -1;
    const isBkt: boolean = bktOpenIndex > -1;
    const noMatch: boolean = !isDot && !isBkt;
    // TODO: Implement error output when safeCounter couse the cycle ending
    safeCounter -= 1;

    if (noMatch) {
      // No more delimiters
      if (pathKeyBillet.length > 0) {
        result.push(pathKeyBillet);
      }
      break;
    }
    const dotGoesNext: boolean = isDot && (!isBkt || dotIndex < bktOpenIndex);
    const bktGoesNext: boolean = !dotGoesNext;

    if (dotGoesNext) {
      if (dotIndex === 0) {
        // TODO: Dot can't be at the 0 position. Double dot error, or something else.
        pathKeyBillet = pathKeyBillet.slice(1);
      } else {
        const partKey: string = pathKeyBillet.slice(0, dotIndex);
        pathKeyBillet = pathKeyBillet.slice(dotIndex + 1);
        result.push(partKey);
      }
    }

    if (bktGoesNext) {
      const keyBeforeBkt: boolean = bktOpenIndex > 0;
      const keyWithinBkt: boolean = !keyBeforeBkt;

      if (keyBeforeBkt) {
        const partKey: string = pathKeyBillet.slice(0, bktOpenIndex);
        pathKeyBillet = pathKeyBillet.slice(bktOpenIndex);
        result.push(partKey);
      }
      if (keyWithinBkt) {
        let bktCloseIndex: number = pathKeyBillet.indexOf(']', bktOpenIndex + 1);

        if (bktCloseIndex === -1) {
          // TODO: Implement close bracket miss error or warning
          bktCloseIndex = pathKeyBillet.length + 1;
          pathKeyBillet += ']';
        }
        const partKey: string = pathKeyBillet.slice(bktOpenIndex + 1, bktCloseIndex);
        pathKeyBillet = pathKeyBillet.slice(bktCloseIndex + 1);
        result.push(partKey);
      }
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
