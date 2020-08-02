# js-type

Precisely define domain entities in JavaScript.

## Overview

Say you want to define a string which length must be between 2 and 24

```js
const ShortStr = Val(
  // The predicate can get as complex as you want...
  x => typeof x === 'string' &&
    x.length >= 2 &&
    x.length <= 24,
  'String must >= 2 and <= 24',
);

const john = ShortStr('John Doe');
console.log(john.val, john.msg) // John Doe, undefined

const x = ShortStr('x');
console.log(x.val, x.msg) // x, String must >= 2 and <= 24
```

## Record

Define records

```js
const Id = Val(
  x => typeof x === 'string' ?
    /\bvalid_id\b/i.test(x) :
    false,
  'Invalid id',
);

const Address = Rec({
  _id: Id,
  street: ShortStr,
});

// Simulating an enum
const Status = Val(
  x => typeof x === 'string' &&
    (x === 'Single' || x === 'Married'),
  'Must either equal Single or Married',
);

const User = Rec({
  _id: Id,
  name: ShortStr,
  address: Address, // Sub-record
  status: Status,
});

const validUser = User({
  _id: 'valid_id',
  name: 'John Doe',
  address: {
    _id: 'valid_id',
    street: 'Fake St.',
  },
  status: 'Single',
});
```

## Records with Collections

Records also can have arrays of records defined

```js
const Level = Val(
  x => typeof x === 'string' &&
    (x === 'warn' || x === 'info'),
  'Must equal either warn or info',
);

const NonEmptyStr = Val(
  x => typeof x === 'string' &&
    x.length > 0,
  'Must be a non-empty string'
);

const Log = Rec({
  _id: Id,
  owner: Id,
  users: [Id],
  entries: [{
    _id: Id,
    level: Level,
    data: NonEmptyStr
  }],
});

const validLog = Log({
  _id: 'valid_id',
  owner: 'valid_id',
  users: ['valid_id', 'valid_id'],
  entries: [
    {_id: 'valid_id', level: 'info', data: 'Some message'},
    {_id: 'valid_id', level: 'warn', data: 'Another message'},
  ],
});
```

## Errors

Access the `msg` property to see error messages

```js
{ val:
   { _id: 'invalid_id',
     owner: 'invalid_id',
     users: 'invalid_id',
     entries:
      [ { _id: 'valid_id', level: 'info', data: undefined },
        { _id: 'valid_id', level: 'warn', data: 'Another message' } ] },   
  msg:
   { _id: 'Invalid id',
     owner: 'Invalid id',
     users: 'Must be an array',
     entries: { '0': { data: 'Must be a non-empty string' } } } }
```

## Usage

This package is only ~50 lines of code long [Type.js](src/Type.js), it is a proof of concept still, if you find it useful please feel free to copy and modify. 
