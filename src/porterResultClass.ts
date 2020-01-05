import { PorterResultInterface, Value } from './commonTypes';

class PorterResult implements PorterResultInterface {
  errors = [];

  track = [];

  done = false;

  value: Value;


  constructor() {
    this.val = this.val.bind(this);
  }

  val(this: PorterResult): Value {
    return this.value;
  }
}

export default PorterResult;
