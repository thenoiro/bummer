import Porter from './porterClass';
import { inform } from './logger';
import {
  Subject,
  PorterAPI,
} from './commonTypes';


// Entry point
const porter: PorterAPI = (subject: Subject) => {
  const wrapper = new Porter(subject);

  return {
    get: wrapper.get.bind(wrapper),
    set: wrapper.set.bind(wrapper),
    check: wrapper.check.bind(wrapper),
    remove: wrapper.remove.bind(wrapper),
    replace: wrapper.replace.bind(wrapper),
  };
};
porter.get = (subject, ...options) => porter(subject).get(...options);
porter.set = (subject, ...options) => porter(subject).set(...options);
porter.check = (subject, ...options) => porter(subject).check(...options);
porter.remove = (subject, ...options) => porter(subject).remove(...options);
porter.replace = (subject, ...options) => porter(subject).replace(...options);


export default porter;
