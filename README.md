# 设计模式-单例
在整个应用中共享一个「单一的」「全局的」实例


单例是可以全局访问并且仅实例化一次的类。这个 *单一实例*  是可以在整个应用中被共享的，这使得单例非常适合管理应用程序中的全局状态

首先，让我们看看使用 ES2015 Class 语法的单例会是什么样子。举个例子，我们构建一个 名为 `Counter` 的类

- getInstance 方法：返回实例
- getCount 方法：获取当前 counter 的值
- increment 方法：counter的值 加 1
- decrement 方法：counter的值 减 1

```jsx
let counter = 0;

class Counter {
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
```

然而，这个类不是标准的单例！单例只允许被实例化一次。而现在，我们可以创建  Counter 类的多个实例

```jsx
let counter = 0;

class Counter {
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

const counter1 = new Counter();
const counter2 = new Counter();

console.log(counter1.getInstance() === counter2.getInstance()); // false
```

两次运行 new 方法，可以发现实例化出来的 counter1 与 counter2 是不同的实例。通过 getInstance 得到的值是两个不同的实例的引用，所以 counter1 与 counter2 不是严格相等的

让我们确保 Counter 类只能创建 的一个实例

确保只能创建一个实例的一种方法是创建一个名为 instance 的变量。在构造函数中，我们设置了 instance 变量等于用 new 方法创建出来的实例对象。我们可以通过判断 instance 变量的值是否为空来保证不会有多次的实例化行为。如果 instance 变量不为空，则证明已经实例化过了，则不需要再进行实例化； 如果再进行实例化，则会抛出错误让用户感知到

```jsx
let instance;
let counter = 0;

class Counter {
  constructor() {
    if (instance) {
      throw new Error("只能创建一个实例!");
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

const counter1 = new Counter();
const counter2 = new Counter();
// Error: 只能创建一个实例!
```

好的，我们现在已经做到可以防止创建多个实例了。

让我们从  `counter.js` 导出 `Counter` 实例。在导出之前，我们需要「 冻结 」这个实例。 `Object.freeze`  方法可以防止使用这个实例的代码修改这个实例。我们无法添加或修改被冻结的实例上的属性，这降低了 Singleton 上的值被覆盖的风险。

```jsx
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
export default singletonCounter;
```

让我们看一个实现 Counter 的应用例子。 文件如下：

- counter.js：包含 Counter 类，并将 Counter 实例默认导出
- index.js：加载 redButton.js 和 blueButton.js 模块
- redButton.js：导入Counter，并将 Counter 的 increment 方法作为事件监听器添加到红色按钮，并通过调用 getCount 方法打印 counter 的当前值
- blueButton.js：导入Counter，并将 Counter 的 increment 方法作为事件监听器添加到蓝色按钮，并通过调用 getCount 方法打印 counter 的当前值

blueButton.js 和 redButton.js 都从 counter.js 导入相同的实例。

当我们不管从 blueButton.js 或者 redButton.js 触发 increment 方法，Counter 实例上的 counter 属性的值都会更新。单例的值会在所有的文件中被共享，尽管我们是在不同的文件中触发了更新。

---

## 优点 or 缺点

通过限制实例化来保证只有一个实例对象可以节约很多内存。我们不必在每次实例化都为实例对象申请内存，单例的实例对象只需要申请一次内存就可以在整个应用中使用。然而单例模式经常被当作「反模式」，并且需要尽量避免在 javascript 中使用到它。

在许多编程语言中，例如 Java 或 C++，不可能像在 JavaScript 中那样直接创建对象。 在那些面向对象的编程语言中，我们需要创建一个类，它会创建一个对象。 该创建的对象具有类实例的值，就像 JavaScript 示例中的实例值一样。

但是，上面示例中显示的类实现实际上是矫枉过正。我们可以直接在 JavaScript 中创建对象，比如我们可以简单地使用**对象字面量**来实现完全相同的结果。让我们来介绍一下使用单例的一些缺点！

### 使用对象字面量

让我们使用与之前看到的相同的示例。 然而这一次，Counter 只是一个包含以下内容的对象字面量：

- 一个 count 属性
- increment 方法：counter的值 加 1
- decrement 方法：counter的值 减 1

```jsx
let count = 0;

const counter = {
  increment() {
    return ++count;
  },
  decrement() {
    return --count;
  }
};

Object.freeze(counter);
export { counter };
```

由于对象是通过引用传递的，redButton.js 和 blueButton.js 都在导入对同一个 counter 对象的引用。 修改这些文件中的任何一个中触发 counter 的 increment 方法，count 值的改变这在两个文件中都是可感知到的。

### 测试

测试单例模式的代码会比较麻烦。由于我们不能每次都创建新实例，因此所有测试都依赖于对上一次测试的全局实例的修改。在这种情况下，测试的顺序很重要，一个普通的修改可能会导致整个测试case 失败。 测试后，我们需要重置整个实例以重置测试所做的修改。

```jsx
import counterInstance from '../src/counter'
const Counter = counterInstance.counter

test("incrementing 1 time should be 1", () => {
    Counter.increment();
    expect(Counter.getCount()).toBe(1);
});

test("incrementing 3 extra times should be 4", () => {
    Counter.increment();
    Counter.increment();
    Counter.increment();
    expect(Counter.getCount()).toBe(4);
});

test("decrementing 1  times should be 3", () => {
    Counter.decrement();
    expect(Counter.getCount()).toBe(3);
})
```

## 全局行为

一个单例对象可以在整个应用的任何地方被获取和使用。全局变量也有相同的行为：全局变量可以在全局作用域被获取和使用，所以也可以在整个应用的任何地方被获取和使用。

设置全局变量一般被认为是一种比较不好的设计，因为修改全局变量的值可能会污染全局作用域，这可能会导致一些意想不到的副作用。

在 ES 2015 ，创建全局变量是不常见的。`let` 和 `const` 关键字保证了变量在块级作用域下，从而有效的防止意外污染全局作用域。JavaScript 中的新模块系统（import | export 语法）通过能够从模块中导出值，并将这些值导入其他文件中，使得创建全局可访问的值更容易而不会污染全局作用域。

但是，单例的常见用法是在整个应用中拥有某种全局状态。开发者的代码有多个模块同时依赖某个可变对象可能会导致 不可预知的行为（副作用）。

通常情况下，项目代码中某些模块会修改全局状态，而某些模块又会去消费这些全局状态的数据。所以执行顺序在这种情况下就比较重要了：我们不想要意外的提前消费数据，因为一开始是数据一般是空的。随着项目代码越来越多，逻辑越来越复杂，许许多多的组件互相依赖，这个时候理解数据的流向就变得越来月棘手；

### React 的状态管理

在 React 的项目中，我们通常使用像 Redux 或者 React Context 这样的工具来管理全局状态而不是使用单例。虽然这些工具提供的全局状态行为和单例很像，但他们一般会提供 「只读状态」而不是像单例中使用「可变状态」。使用 Redux 时，只有纯函数 reducer 可以在组件中通过 *dispatcher* 发送一个 *action* 后更新状态。

尽管使用这些工具不会神奇地消除拥有全局状态的缺点，但我们至少可以确保全局状态按照我们的预期方式发生变化，因为组件不能直接更新状态。

---

**[本文示例代码地址](https://github.com/zidanDirk/singleton-pattern)**


参考文献

- **[Do React Hooks replace Redux - Eric Elliott](https://medium.com/javascript-scene/do-react-hooks-replace-redux-210bab340672)**
- **[Working with Singletons in JavaScript - Vijay Prasanna](https://alligator.io/js/js-singletons/)**
- **[JavaScript Design Patterns: The Singleton - Samier Saeed](https://www.sitepoint.com/javascript-design-patterns-singleton/)**
- **[Singleton - Refactoring Guru](https://refactoring.guru/design-patterns/singleton)**
- **[patterns-dev](https://www.patterns.dev/posts/singleton-pattern/)**