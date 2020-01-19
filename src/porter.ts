import Porter from './porterClass';
import {
  Subject,
  PorterAPI,
} from './commonTypes';


// Entry point
const porter: PorterAPI = (subject: Subject) => {
  const wrapper = () => new Porter(subject);

  return {
    get: (...args) => wrapper().get(...args),
    set: (...args) => wrapper().set(...args),
    check: (...args) => wrapper().check(...args),
    remove: (...args) => wrapper().remove(...args),
    replace: (...args) => wrapper().replace(...args),
  };
};
porter.get = (subject, ...options) => porter(subject).get(...options);
porter.set = (subject, ...options) => porter(subject).set(...options);
porter.check = (subject, ...options) => porter(subject).check(...options);
porter.remove = (subject, ...options) => porter(subject).remove(...options);
porter.replace = (subject, ...options) => porter(subject).replace(...options);


export default porter;
