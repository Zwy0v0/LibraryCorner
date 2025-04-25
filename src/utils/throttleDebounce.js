export function createLimiter(fn, wait = 300, type = 'debounce') {
  let timer = null;
  let lastTime = 0;

  if (type === 'debounce') {
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, wait);
    };
  }

  if (type === 'throttle') {
    return function (...args) {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  }

  throw new Error("Type must be either 'debounce' or 'throttle'");
}