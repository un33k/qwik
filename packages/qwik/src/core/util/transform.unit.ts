import { suite } from 'uvu';
import { equal, throws } from 'uvu/assert';
import { decodeHTML, encodeHTML, functionToString } from './transform';

const encodeHtmlSuite = suite('encodeHTML');
encodeHtmlSuite('returns an empty string if the input is empty', () => {
  equal(encodeHTML(''), '');
});

encodeHtmlSuite('encodes special characters correctly', () => {
  const input = '<h1>Hello World!</h1>';
  const expectedOutput = '&lt;h1&gt;Hello World!&lt;/h1&gt;';
  equal(encodeHTML(input), expectedOutput);
});

encodeHtmlSuite('returns the input string if it contains no special characters', () => {
  equal(encodeHTML('Hello World'), 'Hello World');
});

const decodeHtmlSuite = suite('decodeHTML');
decodeHtmlSuite('should decode HTML entities', () => {
  const html =
    '&lt;div&gt;Hello &amp; World&apos;s "Greatest" Website&apos;s &nbsp;&mdash; Qwik&lt;/div&gt;';
  const expected = '<div>Hello & World\'s "Greatest" Website\'s  — Qwik</div>';
  equal(decodeHTML(html), expected);
});

decodeHtmlSuite('should leave non-HTML strings unchanged', () => {
  equal(decodeHTML('Hello, world!'), 'Hello, world!');
});

const functionToStringSuite = suite('functionToString');
functionToStringSuite('convert a function to a string, with auto execution on', () => {
  function addFunc() {
    const a = 1;
    const b = 2;
    return a + b;
  }
  const actual = functionToString(addFunc);
  const expected =
    `function addFunc(){const a=1;const b=2;return a+b} addFunc();`.replace(/\s+/g, ' ').trim() +
    '\n';
  equal(decodeHTML(actual), decodeHTML(expected));
});

functionToStringSuite('convert a function to a string, without executing', () => {
  function addFunc() {
    const a = 1;
    const b = 2;
    return a + b;
  }
  const actual = functionToString(addFunc, false);
  const expected =
    `function addFunc(){const a=1;const b=2;return a+b}`.replace(/\s+/g, ' ').trim() + '\n';
  equal(decodeHTML(actual), decodeHTML(expected));
});

functionToStringSuite('throw error for arrow function to string', () => {
  const addFunc = () => {
    const a = 1;
    const b = 2;
    return a + b;
  };
  throws(() => functionToString(addFunc));
});

// encodeHtmlSuite.run();
// decodeHtmlSuite.run();
functionToStringSuite.run();
