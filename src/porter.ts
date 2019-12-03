type Subject = object;
type Path = string;
type PathKey = string | symbol | number;
type AnyPath = string | PathKey[];
type Value = any;

interface PorterAPIMethods {
    get(subject: Subject, path: AnyPath): any;
    set(subject: Subject, path: AnyPath, value: Value, force?: boolean): any;
    check(subject: Subject, path: AnyPath): boolean;
    remove(subject: Subject, path: AnyPath, pop?: boolean): any;
}
interface PorterAPI extends PorterAPIMethods {
    (subject: Subject): PorterWrapper;
}
interface PorterWrapper {
    get(path: AnyPath): any;
    set(path: AnyPath, value: Value, force?: boolean): any;
    check(path: AnyPath): boolean;
    remove(path: AnyPath, pop?: boolean): any;
}

const log = console.log;
const rnd = Math.random;


class Porter implements PorterWrapper {
    private subject: Subject;

    constructor(subject: Subject) {
        this.subject = subject;
    }

    get(path: AnyPath) {
        log(path, this.subject);
    }
    set(path: AnyPath, value: Value, force = true) {
        log(path, value, force);
    }
    check(path: AnyPath) {
        log(path);
        return rnd() > 0.5;
    }
    remove(path: AnyPath, pop = false) {
        log(path, pop);
        return rnd() > 0.5 ? rnd() > 0.5 : {};
    }
}

const porter: PorterAPI = (subject) => {
    const wrapper = new Porter(subject);

    return {
        get: wrapper.get,
        set: wrapper.set,
        check: wrapper.check,
        remove: wrapper.remove,
    };
}
porter.get = (subject, path) => {
    log(subject, path);
}
porter.set = (subject, path, value, force = true) => {
    log(subject, path, value, force);
    return rnd() > 0.5;
}
porter.check = (subject, path) => {
    log(subject, path);
    return rnd() > 0.5;
}
porter.remove = (subject, path, pop = false) => {
    log(subject, path, pop);
    return rnd() > 0.5 ? rnd() > 0.5 : {};
}


if (module && typeof module === 'object') {
    module.exports = porter;
}
