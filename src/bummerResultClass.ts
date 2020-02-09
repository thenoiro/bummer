import { BummerResultInterface, Value } from './commonTypes';

class BummerResult implements BummerResultInterface {
  errors = [];

  track = [];

  done = false;

  value: Value;


  constructor() {
    this.val = this.val.bind(this);
  }

  val(this: BummerResult): Value {
    return this.value;
  }
}

export default BummerResult;
