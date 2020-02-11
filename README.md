# [BUMMER](https://github.com/thenoiro/bummer) is a small script that helps easily and safely get, set, remove, replace or check an object's properties located at any depth.

```js
const bummer = require('bummer');
const settings = require('./widget').settings();

// let axisFormat;
// if (settings.yAxis && settings.yAxis[0] && settings.yAxis[0].labels) {
//   axisFormat = settings.yAxis[0].labels.format;
// }
const axisFormat = bummer(settings).get('yAxis[0].labels.format').val();

if (axisFormat) {
  /*
    'settings.yAxis[1]' object may exist, or may not. Bummer script
    will create this path automaticaly.
  */
  bummer(settings).set('yAxis[1].labels.format', axisFormat);
}
```

------------------------------------

## Usage:

+ [**`bummer.get()`**](#bummerget) - allows safely get a value from an object.

+ [**`bummer.set()`**](#bummerset) - allows to set a value.

+ [**`bummer.check()`**](#bummercheck) - checks is a property exist or not.

+ [**`bummer.remove()`**](#bummerremove) - allows to delete a property from an object.

+ [**`bummer.replace()`**](#bummerreplace) - allows to set up a new property, and returns an old one.

All these methods take two identical arguments first: [**`subject`**](#subject) and [**`path`**](#path), and always returns [**`bummer_result`**](#bummer_result) object.


### Caching:

**`bummer`** object is a function itself. It allows you to cache first argument, and only then call other methods. In this case you have to pass all the same arguments, but without first one. For example:

```js
// const name = bummer.get(data, 'user.meta.name').val();
// const phone = bummer.get(data, 'user.meta.phone[0]').val();
const settings = bummer(data);
const name = settings.get('user.meta.name').val();
const phone = settngs.get('user.meta.phone[0]').val();
```

------------------------------------

### `bummer.get()`

_**`bummer.get(`**_ [_**`subject,`**_](#subject) [_**`path`**_](#path) _**`)`**_

Gets a value according to the given _`path`_.

_**Returns**_ a [_`bummer_result`_](#bummer_result) object, where:

+ _**`.value`**_ - A value placed by the given _`path`_. In case no _`path`_ argument is provided, or in case the value doesn't exist (or equals to _`undefined`_) this field will be equal to _`undefined`_ too.

+ _**`.done`**_ equals _`true`_ in case the _`path`_ fully exist. Otherwise, it equals _`false`_.

#### Example:

```js
const sub = {
  user: {
    name: 'Guest',
    age: undefined,
  },
};
const name = bummer.get(sub, 'user.name');
const age = bummer.get(sub, 'user.age');
const phone = bummer.get(sub, 'user.meta.phone');

if (name.done) {
  console.log(name.val()); // > Guest
}
if (age.done) {
  console.log(name.val()); // > undefined
}
if (phone.done) {
  // Will never run because of phone.done === false
  console.log(phone.val()); // > undefined
}
```

------------------------------------

### `bummer.set()`

_**`bummer.set(`**_ [_**`subject,`**_](#subject) [_**`path,`**_](#path) _**`value [, force ] `**_ _**`)`**_

+ _**`value<any>`**_ - Value you want to set.

+ _**`force<boolean>`**_ - Optional. _`true`_ by default. Indicates whether the **bummer** should create a path (in case there are no neede objects on its way) or not.

Takes your value, and sets it up according to the given _`path`_. In case the _`force`_ argument is omitted or set to _`true`_ **bummer** will create all the needed objects on its way to the end of the _`path`_ if some of them don't exist.  
**Note**. If the _`force`_ argument is omitted or _`true`_ and one of the _`path`_ keys is a number (even if it placed inside of a string, e.g.: _`string.path.to.value.0`_), and it is not the last _`path`_ key, _**bummer**_ will create an array for that key.

_**Returns**_ a [_`bummer_result`_](#bummer_result) object, where:

+ _**`.value`**_ equals to _`true`_ (**value** was set up successfully) or _`false`_ (**bummer** could not set up the **value** for some reason).

+ _**`.done`**_ - the same as the _`.value`_.

#### Example:

```js
const data = {
  user: {
    name: 'Guest',
    age: undefined,
  },
};
bummer.set(data, 'user.name', 'Anonimous');
bummer.set(data, 'user.age', 35);
bummer.set(data, 'user.meta.phone[0]', '555-3141');

console.log(data.user);
// {
//   name: 'Anonimous',
//   age: 42,
//   meta: {
//     phone: [ '555-3141' ],
//   },
// }
```

------------------------------------

### `bummer.check()`

_**`bummer.check(`**_ [_**`subject,`**_](#subject) [_**`path`**_](#path) _**`)`**_

_**Returns**_ a [_`bummer_result`_](#bummer_result) object, where:

+ _**`.value`**_ equals to _`true`_ (property exist) or _`false`_ (it doesn't). **Note** that function doesn't take into account property value. It could be _`undefined`_ .

+ _**`.done`**_ - the same as the _`.value`_.

#### Example:

```js
const data = {
  name: 'Guest',
  phone: undefined,
};
if (bummer.check(data, 'name').val()) {
  console.log(data.name);   // > Guest
}
if (bummer.check(data, 'phone').val()) {
  console.log(data.phone);  // > undefined
}
if (bummer.check(data, 'address').val()) {
  console.log(data.address); // wont work
}
```

------------------------------------

### `bummer.remove()`

_**`bummer.remove(`**_ [_**`subject,`**_](#subject) [_**`path,`**_](#path) _**`[, pop = false ] `**_ _**`)`**_

+ _**`pop<boolean>`**_ - Optional. _`false`_ by default.

_**Returns**_ a [_`bummer_result`_](#bummer_result) object, where:

+ _**`.value`**_ is _`true`_ (success) or _`false`_ (fail). In case the _`pop`_ argument was _`true`_, this field will be equal to the removed property value (or _`undefined`_).

#### Example:

```js
const data = {
  name: 'Guest',
  age: 42,
};

bummer.remove(data, 'name').val(); // > true
bummer.remove(data, 'phone').val(); // > false
bummer.remove(data, 'age', true).val();  // > 42
bummer.remove(data, 'address', true).val(); // > undefined
console.log(data);  // > {}
```

------------------------------------

### `bummer.replace()`

_**`bummer.replace(`**_ [_**`subject,`**_](#subject) [_**`path,`**_](#path) _**`value [, force = true ] `**_ _**`)`**_

Almost the same as _`bummer.get`_, but will return a previous property value (if exist) instead of _`true`_ or _`false`_ within _`bummer_result`_ object.

+ _**`.value`**_ equals to _`true`_ (**value** was set up successfully) or _`false`_ (**bummer** could not set up the **value** for some reason).

+ _**`force<boolean>`**_ - Optional. _`true`_ by default. Indicates whether the **bummer** should create a path (in case there are no neede objects on its way) or not.

#### Example:

```js
const data = {
  name: 'Guest',
  age: 42,
};

const oldName = bummer.replace(data, 'name', 'Anonimous');
const oldStreet = bummer.replace(data, 'address.street', 'Oak');
const oldGender = bummer.replace(data, 'details.gender', 'Unicorn', false);

console.log(oldName.val()); // > Guest
console.log(oldStreet.val()); // > undefined
console.log(oldGender.val()); // > undefined
console.log(oldGender.done);  // > false
console.log(data);
// {
//   name: 'Anonimous',
//   age: 42,
//   address: {
//     street: 'Oak',
//   },
// }
```

------------------------------------

### `<subject>`

_**`subject<object>`**_ - object (or an array) you want to work with.  

------------------------------------

### `<path>`

_**`path<key|key[]>`**_ ([*`<key>`*](#key)) - path to the object's (subject) property you target to.

------------------------------------

### `<key>`

_**`key<string|number|symbol>`**_ - string, number or symbol, which describes the object property (in case of string it could describe several keys):

+ _**`key<string>`**_ - describes the path to the property (for example *`some.path.to.the.property`*). The string has almost the same sintax as in javascript. The object key's should be separated by dots or they should be placed inside the square brackets. **You musn't use** quotes as in javascript. It is means that javascript *`object['propertyName']`* is the same as bummer's *`object[propertyName]`*. If you will send to bummer *`object['propertyName']`* string as the path, it will be the same as javascript *`object["'propertyName'"]`*.

+ _**`key<number>`**_ - quite similar to the string type described before, and allows to get access to the array (or object) properties.

+ _**`key<symbol>`**_ - simply describes javascript symbol-key (the properties in javascript may be a symbols).

+ _**`key[]`**_ - contains ordered keys of any type described before. For example, the *`some.path.to.the.property`* is the same as *`['some', 'path', 'to', 'the', 'property']`*, or even *`['some.path', 'to', 'the[property]']`*. It is usefull in cases, when one of your properties is **symbol** type (e.g. *`['users[0].permissions', sym, 'read']`*).


#### Escape character

In the case of a non-standard property name, you can use **escape character** _**`/`**_. **NOTE**: because of _**`/`**_ symbol has used in javascript as an escape character too, you have to duplicate it when creating a string:

```js
const data = { target: {} };
data.target['some.non-standard[name]'] = 42;

const answer = bummer(data).get('target.some//non-standard//[name//]');
console.log(answer.val());  // > 42
```

------------------------------------

### `<bummer_result>`

_**`bummer_object<object>`**_ - details of operation.

+ _**`.errors<string[]>`**_ - human-readable error messages, if there any during the operation.

+ _**`.done<boolean>`**_ - is the operation has finished successfully.

+ _**`.value`**_ - for different operations returns different values. For example for *`bummer.get()`* it would be the target property value. But for *`bummer.check()`* it would be a **boolean** value (is the target property exist or not).

+ _**`.val<() => any>`**_ - function, which simply returns the value. The same as *`bummer_object.value`*.

+ _**`.track<track_object[]>`**_ ([*`<track_object>`*](#track_object)) - track details. One object for each key from the path (remember, that string-key may contain several path-keys).

------------------------------------

### `<track_object>`

_**`track_object<object>`**_ - details of current step.

+ _**`.key<key>`**_ - the name of property for current step (could be any type of [*`<key>`*](#key).

+ _**`.exist<boolean>`**_ - is the needed property exist or not.

+ _**`.created<boolean>`**_ - is the property was created by the bummer.

+ _**`.available<boolean>`**_ - is the property exist, or was created.

+ _**`.target<object|null>`**_ - inspected object for current step.

+ _**`.value<any>`**_ - current-step value (*`target[key]`*).

------------------------------------