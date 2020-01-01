import { PorterResultInterface, Value } from './commonTypes';

class PorterResult implements PorterResultInterface {
  errors = [];

  track = [];

  done = false;

  value: Value;
}

export default PorterResult;
