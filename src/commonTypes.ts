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

export interface BummerResultInterface {
  done: Result;
  value: Value;
  track: SubjectMapMember[];
  errors: string[];
  val(): Value;
}

export interface BummerAPIMethods {
  get(subject: Subject, path: AnyPath): BummerResultInterface;
  set(subject: Subject, path: AnyPath, value: Value, force?: Flag): BummerResultInterface;
  check(subject: Subject, path: AnyPath): BummerResultInterface;
  remove(subject: Subject, path: AnyPath, pop?: Flag): BummerResultInterface;
  replace(subject: Subject, path: AnyPath, value: Value, force?: Flag): BummerResultInterface;
}
export interface BummerAPI extends BummerAPIMethods {
  (subject: Subject): BummerWrapper;
}
export interface BummerWrapper extends BummerClassInterface {}

export interface BummerClassInterface {
  get(path: AnyPath): BummerResultInterface;
  set(path: AnyPath, value: Value, force?: Flag): BummerResultInterface;
  check(path: AnyPath): BummerResultInterface;
  remove(path: AnyPath, pop?: Flag): BummerResultInterface;
  replace(path: AnyPath, value: Value, force?: Flag): BummerResultInterface;
}
