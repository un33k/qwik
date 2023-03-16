import { suite } from 'uvu';
import { equal } from 'uvu/assert';
import { decodeHTML, encodeHTML } from './transform';

const encodeHtmlSuite = suite('encodeHTML');
encodeHtmlSuite('encode HTML', () => {
  // returns an empty string if the input is empty
  equal(encodeHTML(''), '');

  // encodes special characters correctly'
  const input = '<h1>Hello World!</h1>';
  const expectedOutput = '&lt;h1&gt;Hello World!&lt;/h1&gt;';
  equal(encodeHTML(input), expectedOutput);

  // returns the input string if it contains no special characters
  equal(encodeHTML('Hello World'), 'Hello World');
});

const decodeHtmlSuite = suite('decodeHTML');
decodeHtmlSuite('encode HTML', () => {
  // should decode HTML entities
  const html =
    '&lt;div&gt;Hello &amp; World&apos;s "Greatest" Website&apos;s &nbsp;&mdash; Qwik&lt;/div&gt;';
  const expected = '<div>Hello & World\'s "Greatest" Website\'s  — Qwik</div>';
  equal(decodeHTML(html), expected);

  // should leave non-HTML strings unchanged
  equal(decodeHTML('Hello, world!'), 'Hello, world!');
});

encodeHtmlSuite.run();
decodeHtmlSuite.run();
