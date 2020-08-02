const assert = require('assert').strict;
const util = require('util');
const {Val, Rec} = require('../src/Type.js');

const log = x => console.log(util.inspect(x,false, null, true));

// Values

const Id = Val(
  x => typeof x === 'string' ?
    /\bvalid_id\b/i.test(x) :
    false,
  'Invalid id',
);

const ShortStr = Val(
  x => typeof x === 'string' &&
    x.length >= 2 &&
    x.length <= 24,
  'String must >= 2 and <= 24',
);

// Records

const Address = Rec({
  _id: Id,
  street: ShortStr,
});

// Enum hack

const Status = Val(
  x => typeof x === 'string' &&
    (x === 'Single' || x === 'Married'),
  'Must either equal Single or Married',
);

const User = Rec({
  _id: Id,
  name: ShortStr,
  address: Address,
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
// log(validUser);
assert.equal(validUser.msg, undefined);

const invalidUser = User({
  _id: 'invalid_id',
  name: 'a',
  address: {
    _id: 'invalid_id',
    street: 'S',
  },
  status: 'Foo',
});
// log(invalidUser);
assert.equal(!!invalidUser.msg, true);
assert.equal(invalidUser.msg._id, 'Invalid id');
/*
Output:
{ val:
  { _id: 'invalid_id',
    name: 'a',
    address: { _id: 'invalid_id', street: 'S' },
    status: 'Foo' },
 msg:
  { _id: 'Invalid id',
    name: 'String must >= 2 and <= 24',
    address: { _id: 'Invalid id', street: 'String must >= 2 and <= 24' }, 
    status: 'Must either equal Single or Married' } }
*/

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

// Complex record
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
// log(validLog);

const invalidLog = Log({
  _id: 'invalid_id',
  owner: 'invalid_id',
  users: 'invalid_id',
  entries: [
    {_id: 'valid_id', level: 'info'},
    {_id: 'valid_id', level: 'warn', data: 'Another message'},
  ],
});
// log(invalidLog);
assert(invalidLog.msg.entries[0].data, 'Must be a non-empty string');
/*
Output:
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
*/
