import sum from '@/sum.ts'

console.log(sum);

function logDec(target, propName) {
  console.log(target);
  Object.defineProperty(target, propName, {
    get() {
      return this[`_${propName}`];
    },
    set(newVal) {
      console.log('gocha');
      this[`_${propName}`] = newVal;
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
console.log(johnny);