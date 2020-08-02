// Result = Ok | Err
const Ok = val => ({val});
const Err = (val, msg) => ({val, msg});

// Val = (pred, msg) => val => Result
exports.Val = (pred, msg) => val =>
  pred(val) ? Ok(val) : Err(val, msg);

// Rec = {key: val => Result} => obj => Result
const Rec = exports.Rec = defs => obj => {
  const val = {};
  let msg = null;
  for(const key in defs)
    if(defs.hasOwnProperty(key)) {
      const def = defs[key];
      const $val = obj[key];
      const result = Array.isArray(def) ?
        Arr(def[0])($val) : def($val);
      if(result.msg) {
        if(!msg) msg = {};
        msg[key] = result.msg;
      }
      val[key] = result.val;
    }
  return msg ? Err(val, msg) : Ok(val);
};

// Arr = def => arr => Result
const Arr = def => arr => {
  if(!Array.isArray(arr))
    return Err(arr, 'Must be an array');
  const val = [];
  let msg = null;
  const len = arr.length;
  for(let i = 0; i < len; i++) {
    const result = typeof def === 'function' ?
      def(arr[i]) : Rec(def)(arr[i]);
    if(result.msg) {
      if(!msg) msg = {};
      msg[i] = result.msg;
    }
    val.push(result.val);
  }
  return msg ? Err(val, msg) : Ok(val);
};
