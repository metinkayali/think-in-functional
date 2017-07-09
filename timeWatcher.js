'use strict';

let timeWatcher =
  logFn =>
    (action, name) => {
      const t1 = new Date();
      action();
      const t2 = new Date();
      logFn(`${name} took ${t2-t1} ms`);
    };

module.exports = timeWatcher;