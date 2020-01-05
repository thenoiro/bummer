export type PathKeyString = string;
export type PathKeyNumber = number;
export type PathKeySymbol = symbol;
export type PathKey = PathKeyString | PathKeyNumber | PathKeySymbol;

export type Subject = object & {
  [key: string]: Value;
};
export type AnyPath = PathKey | PathKey[];
export type Value = any;
export type Result = boolean;
export type Flag = boolean;

export interface SubjectMapMember {
  key: PathKey;
  exist: Flag;
  created: Flag;
  available: Flag;
  value: Value;
  target: Subject | null;
}
export type SubjectMapOptions = Partial<Omit<SubjectMapMember, 'key'>> & Pick<SubjectMapMember, 'key'>;

export type SubjectMap = SubjectMapMember[];

export interface PorterResultInterface {
  done: Result;
  value: Value;
  track: SubjectMapMember[];
  errors: string[];
  val(): Value;
}

export interface PorterAPIMethods {
  get(subject: Subject, path: AnyPath): PorterResultInterface;
  set(subject: Subject, path: AnyPath, value: Value, force?: Flag): PorterResultInterface;
  check(subject: Subject, path: AnyPath): PorterResultInterface;
  remove(subject: Subject, path: AnyPath, pop?: Flag): PorterResultInterface;
  replace(subject: Subject, path: AnyPath, value: Value, force?: Flag): PorterResultInterface;
}
export interface PorterAPI extends PorterAPIMethods {
  (subject: Subject): PorterWrapper;
}
export interface PorterWrapper extends PorterClassInterface {}

export interface PorterClassInterface {
  get(path: AnyPath): PorterResultInterface;
  set(path: AnyPath, value: Value, force?: Flag): PorterResultInterface;
  check(path: AnyPath): PorterResultInterface;
  remove(path: AnyPath, pop?: Flag): PorterResultInterface;
  replace(path: AnyPath, value: Value, force?: Flag): PorterResultInterface;
}
