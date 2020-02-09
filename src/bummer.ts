import Bummer from './bummerClass';
import {
  Subject,
  BummerAPI,
} from './commonTypes';


// Entry point
const bummer: BummerAPI = (subject: Subject) => {
  const wrapper = () => new Bummer(subject);

  return {
    get: (...args) => wrapper().get(...args),
    set: (...args) => wrapper().set(...args),
    check: (...args) => wrapper().check(...args),
    remove: (...args) => wrapper().remove(...args),
    replace: (...args) => wrapper().replace(...args),
  };
};
bummer.get = (subject, ...options) => bummer(subject).get(...options);
bummer.set = (subject, ...options) => bummer(subject).set(...options);
bummer.check = (subject, ...options) => bummer(subject).check(...options);
bummer.remove = (subject, ...options) => bummer(subject).remove(...options);
bummer.replace = (subject, ...options) => bummer(subject).replace(...options);


export default bummer;
