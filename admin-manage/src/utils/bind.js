
// eslint-disable-next-line func-names
module.exports = function bind(fn, thisArg) {
  const wrap = function() {
    const args = new Array(arguments.length);
    for (let i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
  return wrap;
};
