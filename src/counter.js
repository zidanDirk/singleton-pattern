
/**
 * ES2015 Class
 */


/*
let instance;
let counter = 0;

class Counter {
  constructor() {
    if (instance) {
      throw new Error("You can only create one instance!");
    }
    instance = this;
  }

  getInstance() {
    return this;
  }

  getCount() {
    return counter;
  }

  increment() {
    return ++counter;
  }

  decrement() {
    return --counter;
  }
}

const singletonCounter = Object.freeze(new Counter());
export default {
    counter: singletonCounter
};

*/

/**
 * 对象字面量
 */


let count = 0;

const counter = {
  increment() {
    return ++count;
  },
  decrement() {
    return --count;
  },
  getCount() {
    return count;
  }
};

Object.freeze(counter);
export default { counter };
