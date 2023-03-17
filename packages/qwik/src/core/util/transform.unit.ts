import { suite } from 'uvu';
import { equal, throws } from 'uvu/assert';
import { combineExecutables, functionToString } from './transform';

const functionToStringSuite = suite('functionToString');
functionToStringSuite('convert a function to a string, with auto execution on', () => {
  function addFunc() {
    const a = 2;
    const b = 1;
    return a + b;
  }
  const actual = functionToString(addFunc);
  const expected =
    `function addFunc(){const a=2;const b=1;return a+b} addFunc();`.replace(/\s+/g, ' ').trim() +
    '\n';
  equal(actual, expected);
});

functionToStringSuite('convert a function to a string, without executing', () => {
  function addFunc() {
    const a = 2;
    const b = 1;
    return a + b;
  }
  const actual = functionToString(addFunc, false);
  const expected =
    `function addFunc(){const a=2;const b=1;return a+b}`.replace(/\s+/g, ' ').trim() + '\n';
  equal(actual, expected);
});

functionToStringSuite('throw error for arrow function to string', () => {
  const addFunc = () => {
    const a = 2;
    const b = 1;
    return a + b;
  };
  throws(() => functionToString(addFunc));
});

const combineExecutablesSuite = suite('combineExecutables');
combineExecutablesSuite('combine two functions', () => {
  function addFunc(): number {
    return 1 + 2;
  }
  function subFunc(): number {
    return 1 - 2;
  }
  const actual = combineExecutables([addFunc, subFunc]);
  const expected = `function addFunc(){return 1+2} addFunc(); function subFunc(){return 1-2} subFunc(); \n`;
  equal(actual.replace(/\s+/g, ' '), expected.replace(/\s+/g, ' '));
});
combineExecutablesSuite.run();
functionToStringSuite.run();
