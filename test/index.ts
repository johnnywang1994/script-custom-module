function logDec(target, propName) {
  let value = target[propName];
  Object.defineProperty(target, propName, {
    get: () => value,
    set: (newVal) => {
      console.log('gocha');
      value = newVal;
    }
  })
}

// 套用到目標類上
class User {
  @logDec name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const johnny = new User('johnny');